import { StoreData } from "../../store/Core";
import {
  CardEntity,
  CreatureEntity,
  GameState,
  isCreatureEntity,
} from "../../store/Types";
import { pickRandomCards, processPostmortem } from "../../utils";
import Conditions from "./conditions";

export type GameAction<T> = (payload: T) => (game: GameState) => GameState;

const toStoreAction =
  <T extends any>(action: GameAction<T>) =>
  (payload: T) =>
  (sd: StoreData) => ({
    ...sd,
    game: action(payload)(sd.game),
  });

const selectCard: GameAction<CardEntity | null> = (card) => (game) => ({
  ...game,
  player1: {
    ...game.player1,
    state: {
      ...game.player1.state,
      userSelection: card,
    },
  },
});

const selectCreature: GameAction<CreatureEntity> = (creature) => (game) => {
  if (!isCreatureEntity(creature)) return game;
  if (creature.hasAttacked) return game;
  return {
    ...game,
    player1: {
      ...game.player1,
      state: {
        ...game.player1.state,
        userSelection: Conditions.playerHasCreatureEntitiesSelected(game)
          ? [
              ...(game.player1.state.userSelection as CreatureEntity[]),
              creature,
            ]
          : [creature],
      },
    },
  };
};

const playSelectionSpellToField: GameAction<void> = () => (game) => {
  if (!Conditions.playerHasCardSelected(game)) return game;
  const card = game.player1.state.userSelection as CardEntity;
  if (isCreatureEntity(card)) return game;
  if (!card.playEffect) return game;
  if (
    game.player1.state.resource.length - game.player1.state.resourceSpent <
    card.cost
  ) {
    return game;
  }
  const newGameState = card.playEffect.action(game);
  return {
    ...newGameState,
    player1: {
      ...newGameState.player1,
      state: processPostmortem(
        {
          ...newGameState.player1.state,
          hand: newGameState.player1.state.hand.filter((c) => c.id !== card.id),
          resourceSpent: newGameState.player1.state.resourceSpent + card.cost,
        },
        [card]
      ),
    },
  };
};

const playSelectionCreatureToField: GameAction<void> = () => (game) => {
  if (!Conditions.playerHasCardSelected(game)) return game;
  const card = game.player1.state.userSelection as CardEntity;
  if (!isCreatureEntity(card)) return game;
  if (
    game.player1.state.resource.length - game.player1.state.resourceSpent <
    card.cost
  )
    return game;
  const newGameState = card.playEffect ? card.playEffect.action(game) : game;
  return {
    ...newGameState,
    player1: {
      ...newGameState.player1,
      state: {
        ...newGameState.player1.state,
        field: [...newGameState.player1.state.field, card],
        hand: newGameState.player1.state.hand.filter((c) => c.id !== card.id),
        resourceSpent: newGameState.player1.state.resourceSpent + card.cost,
      },
    },
  };
};

const playSelectionCardToResource: GameAction<void> = () => (game) => {
  if (!Conditions.playerHasCardSelected(game)) return game;
  if (Conditions.playerHasPlayedResource(game)) return game;
  const card = game.player1.state.userSelection as CardEntity;
  return {
    ...game,
    player1: {
      ...game.player1,
      state: {
        ...game.player1.state,
        resource: [...game.player1.state.resource, card],
        hand: game.player1.state.hand.filter((c) => c.id !== card.id),
        hasPlayedResource: true,
      },
    },
  };
};

export const attackCreature: GameAction<CreatureEntity> =
  (target) => (game) => {
    if (!Conditions.playerHasCreaturesSelectedThatCanAttack(game)) return game;
    if (
      !target.keywords.includes("blocker") &&
      game.player2.state.field.find((c) => c.keywords.includes("blocker"))
    ) {
      return game;
    }
    const creatures = game.player1.state.userSelection as CreatureEntity[];
    const deadCreatures = creatures.filter((c) => c.power <= target.power);
    const survivedCreatures = creatures.filter((c) => c.power > target.power);
    const combinedPower = creatures.reduce((acc, c) => acc + c.power, 0);
    return {
      ...game,
      player2: {
        ...game.player2,
        state: processPostmortem(
          {
            ...game.player2.state,
            field:
              combinedPower >= target.power
                ? game.player2.state.field.filter((c) => c.id !== target.id)
                : game.player2.state.field,
          },
          combinedPower >= target.power ? [target] : []
        ),
      },
      player1: {
        ...game.player1,
        state: processPostmortem(
          {
            ...game.player1.state,
            userSelection: null,
            field: [
              ...game.player1.state.field
                .filter((c) => !deadCreatures.find((dc) => dc.id === c.id))
                .map((c) => ({
                  ...c,
                  hasAttacked:
                    c.hasAttacked ||
                    !!survivedCreatures.find((sc) => sc.id === c.id),
                })),
            ],
          },
          deadCreatures
        ),
      },
    };
  };

const attackProtection: GameAction<CardEntity> =
  (target: CardEntity) => (game) => {
    if (!Conditions.playerHasCreaturesSelectedThatCanAttackProtection(game)) {
      return game;
    }
    const creatures = game.player1.state.userSelection as CreatureEntity[];
    return {
      ...game,
      player2: {
        ...game.player2,
        state: {
          ...game.player2.state,
          protection: game.player2.state.protection.filter(
            (c) => c.id !== target.id
          ),
          hand: [...game.player2.state.hand, target],
        },
      },
      player1: {
        ...game.player1,
        state: {
          ...game.player1.state,
          userSelection: null,
          field: game.player1.state.field.map((c) => ({
            ...c,
            hasAttacked:
              !!creatures.find((cr) => cr.id === c.id) || c.hasAttacked,
          })),
        },
      },
    };
  };

const endTurn: GameAction<void> = () => (game) => {
  const [remaining, picked] = pickRandomCards(game.player2.state.stack, 1);
  return {
    ...game,
    player2: {
      ...game.player2,
      state: {
        ...game.player2.state,
        userSelection: null,
        hasPlayedResource: false,
        resourceSpent: 0,
        field: game.player2.state.field.map((c) => ({
          ...c,
          hasAttacked: false,
        })),
        hand: [...game.player2.state.hand, ...picked],
        stack: remaining,
      },
    },
    turn: game.turn === "player1" ? "player2" : "player1",
    turnNumber: game.turnNumber + 1,
  };
};

const winGame: GameAction<void> = () => (game) => {
  if (!Conditions.playerCanWinGame(game)) return game;
  return {
    ...game,
    winner: game.turn === "player1" ? "player1" : "player2",
  };
};

const Actions = {
  selectCard: toStoreAction(selectCard),
  selectCreature: toStoreAction(selectCreature),
  playSelectionSpellToField: toStoreAction(playSelectionSpellToField),
  playSelectionCreatureToField: toStoreAction(playSelectionCreatureToField),
  playSelectionCardToResource: toStoreAction(playSelectionCardToResource),
  attackCreature: toStoreAction(attackCreature),
  attackProtection: toStoreAction(attackProtection),
  endTurn: toStoreAction(endTurn),
  winGame: toStoreAction(winGame),
};

export default Actions;
