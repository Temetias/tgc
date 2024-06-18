import { PROTECTION_POWER } from "../constants";
import {
  CardEntity,
  CreatureEntity,
  GameState,
  isCreatureEntity,
} from "../../store/Types";

export type GameCondition = (game: GameState) => boolean;

const playerHasCardSelected: GameCondition = (game) =>
  game.player1.state.userSelection !== null &&
  !Array.isArray(game.player1.state.userSelection);

const playerHasCreatureEntitiesSelected: GameCondition = (game) =>
  game.player1.state.userSelection !== null &&
  Array.isArray(game.player1.state.userSelection) &&
  (game.player1.state.userSelection as CardEntity[]).every(isCreatureEntity);

const playerHasPlayedResource: GameCondition = (game) =>
  game.player1.state.hasPlayedResource;

const playerHasPlayableCardSelected: GameCondition = (game) =>
  playerHasCardSelected(game) &&
  (game.player1.state.userSelection as CardEntity).cost <=
    game.player1.state.resource.length - game.player1.state.resourceSpent;

const playerHasCreaturesSelectedThatCanAttack = (game: GameState) => {
  if (!playerHasCreatureEntitiesSelected(game)) return false;
  const creatures = game.player1.state.userSelection as CreatureEntity[];
  if (
    !creatures.every(
      (c) =>
        isCreatureEntity(c) &&
        !c.hasAttacked &&
        (!c.wasPlayedThisTurn || c.keywords.includes("bloodlust"))
    )
  ) {
    return false;
  }
  return true;
};

const playerHasCreaturesSelectedThatCanAttackProtection: GameCondition = (
  game
) => {
  if (!playerHasCreaturesSelectedThatCanAttack(game)) return false;
  const creatures = game.player1.state.userSelection as CreatureEntity[];
  if (
    creatures.find(
      (c) => c.wasPlayedThisTurn && c.keywords.includes("bloodlust")
    )
  ) {
    return false; // make sure no bloodlust creatures are attacking protection
  }
  if (!game.player2.state.protection.length) return false;
  if (game.player2.state.field.length) return false;
  return creatures.reduce((acc, c) => acc + c.power, 0) >= PROTECTION_POWER;
};

const playerCanWinGame: GameCondition = (game) => {
  if (!playerHasCreaturesSelectedThatCanAttack(game)) return false;
  if (game.player2.state.field.length) return false;
  if (game.player2.state.protection.length) return false;
  return true;
};

const isPlayerTurn: GameCondition = (game) => game.turn === "player1";

const Conditions = {
  playerHasCardSelected,
  playerHasCreatureEntitiesSelected,
  playerHasPlayedResource,
  playerHasPlayableCardSelected,
  playerHasCreaturesSelectedThatCanAttack,
  playerHasCreaturesSelectedThatCanAttackProtection,
  playerCanWinGame,
  isPlayerTurn,
};

export default Conditions;
