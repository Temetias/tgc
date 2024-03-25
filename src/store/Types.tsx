// Note for copilot:
// We are using an old codebase from a previous project about cars.
// Current project is nothing about cars, it's a trading card game.

export const CREATURE = "creature" as const;

export const SPELL = "spell" as const;

export const isCreatureEntity = (card: CardEntity): card is CreatureEntity =>
  card.type === CREATURE;

export const isSpellEntity = (card: CardEntity): card is SpellEntity =>
  card.type === SPELL;

export type CommonKeyword = "draw";

export type CreatureKeyword = "blocker" | "fragile";

export type SpellKeyword = "flow";

export type Keyword = CreatureKeyword | SpellKeyword | CommonKeyword;

export type Effect = (state: GameState) => GameState;

export type CardMeta = {
  cardId: string;
  name: string;
  cost: number;
  img: string;
  playEffect?: {
    description: JSX.Element | string;
    action: Effect;
  };
};

export type Creature = {
  type: "creature";
  power: number;
  keywords: (CreatureKeyword | CommonKeyword)[];
} & CardMeta;

export type CreatureEntity = Creature & {
  id: string;
  hasAttacked: boolean;
};

export type Spell = {
  type: "spell";
  keywords: (SpellKeyword | CommonKeyword)[];
} & CardMeta;

export type SpellEntity = Spell & {
  id: string;
};

export type Card = Creature | Spell;

export type CardEntity = CreatureEntity | SpellEntity;

export type PlayerGameState = {
  protection: CardEntity[];
  hand: CardEntity[];
  resource: CardEntity[];
  stack: CardEntity[];
  discard: CardEntity[];
  graveyard: CreatureEntity[];
  field: CreatureEntity[];
  hasPlayedResource: boolean;
  resourceSpent: number;
  userSelection: CardEntity | CreatureEntity[] | null;
};

export type Player = {
  name: string;
  state: PlayerGameState;
  deck: string[];
};

export type GameState = {
  player1: Player;
  player2: Player;
  turn: "player1" | "player2";
  winner: "player1" | "player2" | null;
  turnNumber: number;
};

type TransportableCardEntity = {
  id: string;
  cardId: string;
};

export type TransportableCreatureEntity = TransportableCardEntity & {
  hasAttacked: boolean;
};

export type TransportablePlayerGameState = Omit<
  PlayerGameState,
  | "protection"
  | "hand"
  | "resource"
  | "stack"
  | "discard"
  | "graveyard"
  | "field"
  | "userSelection"
> & {
  protection: TransportableCardEntity[];
  hand: TransportableCardEntity[];
  resource: TransportableCardEntity[];
  stack: TransportableCardEntity[];
  discard: TransportableCardEntity[];
  graveyard: TransportableCreatureEntity[];
  field: TransportableCreatureEntity[];
  userSelection: TransportableCardEntity | TransportableCreatureEntity[] | null;
};

export type TransportablePlayer = Omit<Player, "state"> & {
  state: TransportablePlayerGameState;
};

export type TransportableGameState = Omit<GameState, "player1" | "player2"> & {
  player1: TransportablePlayer;
  player2: TransportablePlayer;
};

export type WsOutgoingMessage =
  | {
      type: "connect";
      payload: {
        gameId: string;
        playerId: string;
        gameState: TransportableGameState;
      };
    }
  | {
      type: "gameState";
      payload: {
        gameState: TransportableGameState;
        gameId: string;
        playerId: string;
      };
    };

export type WsIncomingMessage =
  | {
      type: "startGame";
      payload: {
        player1: string;
      };
    }
  | {
      type: "gameState";
      payload: {
        gameState: TransportableGameState;
      };
    }
  | {
      type: "waitingForOpponent";
      payload: undefined;
    }
  | {
      type: "joined";
      payload: {
        gameState: TransportableGameState;
      };
    };
