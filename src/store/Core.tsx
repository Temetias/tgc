import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  CardEntity,
  CreatureEntity,
  GameState,
  PlayerGameState,
  TransportableGameState,
  TransportablePlayerGameState,
  WsIncomingMessage,
  WsOutgoingMessage,
} from "./Types";
import { MOCK_DECK } from "../constants";
import { pickRandomCards } from "../utils";
import { v4 as uuidv4, v4 } from "uuid";
import CardIndex from "../cards/CardIndex";
import { parseDeckFromLocalStorage } from "../deckLoading";

export type StoreData = {
  game: GameState;
};

const initialStore: StoreData = (() => {
  console.log(parseDeckFromLocalStorage());
  const player1InitialDeck = (parseDeckFromLocalStorage() || MOCK_DECK).map(
    (c) => ({
      ...c,
      hasAttacked: false,
      wasPlayedThisTurn: false,
      id: uuidv4(),
    })
  );
  const player2InitialDeck = MOCK_DECK.map((c) => ({
    ...c,
    hasAttacked: false,
    wasPlayedThisTurn: false,
    id: uuidv4(),
  }));
  const [player1DeckRemaining, player1Hand] = pickRandomCards(
    player1InitialDeck,
    5
  );
  const [player1Deck, player1Protection] = pickRandomCards(
    player1DeckRemaining,
    5
  );
  const [player2DeckRemaining, player2Hand] = pickRandomCards(
    player2InitialDeck,
    5
  );
  const [player2Deck, player2Protection] = pickRandomCards(
    player2DeckRemaining,
    5
  );
  return {
    game: {
      player1: {
        name: "Player 1",
        state: {
          protection: player1Protection,
          hand: player1Hand,
          stack: player1Deck,
          resource: [],
          field: [],
          discard: [],
          graveyard: [],
          hasPlayedResource: false,
          resourceSpent: 0,
          userSelection: null,
        },
        deck: player1InitialDeck.map((c) => c.cardId),
      },
      player2: {
        name: "Player 2",
        state: {
          protection: player2Protection,
          hand: player2Hand,
          stack: player2Deck,
          resource: [],
          field: [],
          discard: [],
          graveyard: [],
          hasPlayedResource: false,
          resourceSpent: 0,
          userSelection: null,
        },
        deck: player2InitialDeck.map((c) => c.cardId),
      },
      turn: "player1",
      turnNumber: 1,
      winner: null,
    },
  };
})();

const StoreContext = createContext<{
  store: StoreData;
  dispatch: React.Dispatch<React.SetStateAction<StoreData>>;
}>({
  dispatch: (_) => {},
  store: { ...initialStore },
});

export const useStoreState = () => {
  const { store } = useContext(StoreContext);
  return store;
};

export const useStoreDispatch = () => {
  const { dispatch } = useContext(StoreContext);
  return dispatch;
};

const sendWsMessage = (ws: WebSocket, message: WsOutgoingMessage) => {
  if (ws.readyState === 1) {
    ws.send(JSON.stringify(message));
  }
};

const transportablePlayerGameStateToPlayerGameState = (
  tpgs: TransportablePlayerGameState
): PlayerGameState => ({
  ...tpgs,
  discard: tpgs.discard.map(
    ({ cardId, id, ...rest }) =>
      ({ ...CardIndex[cardId], id, ...rest } as CreatureEntity)
  ),
  field: tpgs.field.map(
    ({ cardId, id, ...rest }) =>
      ({ ...CardIndex[cardId], id, ...rest } as CreatureEntity)
  ),
  graveyard: tpgs.graveyard.map(
    ({ cardId, id, ...rest }) =>
      ({ ...CardIndex[cardId], id, ...rest } as CreatureEntity)
  ),
  hand: tpgs.hand.map(
    ({ cardId, id, ...rest }) =>
      ({ ...CardIndex[cardId], id, ...rest } as CardEntity)
  ),
  protection: tpgs.protection.map(
    ({ cardId, id, ...rest }) =>
      ({ ...CardIndex[cardId], id, ...rest } as CardEntity)
  ),
  resource: tpgs.resource.map(
    ({ cardId, id, ...rest }) =>
      ({ ...CardIndex[cardId], id, ...rest } as CardEntity)
  ),
  stack: tpgs.stack.map(
    ({ cardId, id, ...rest }) =>
      ({ ...CardIndex[cardId], id, ...rest } as CardEntity)
  ),
  userSelection:
    tpgs.userSelection === null
      ? null
      : tpgs.userSelection instanceof Array
      ? tpgs.userSelection.map(
          ({ cardId, id, ...rest }) =>
            ({ ...CardIndex[cardId], id, ...rest } as CreatureEntity)
        )
      : ({
          ...CardIndex[tpgs.userSelection.cardId],
          id: tpgs.userSelection.id,
        } as CardEntity),
});

const transportableGameStateToGameState = (
  tgs: TransportableGameState
): GameState => ({
  ...tgs,
  player1: {
    ...tgs.player1,
    state: transportablePlayerGameStateToPlayerGameState(tgs.player1.state),
  },
  player2: {
    ...tgs.player2,
    state: transportablePlayerGameStateToPlayerGameState(tgs.player2.state),
  },
});

const playerGameStateToTransportablePlayerGameState = (
  pgs: PlayerGameState
): TransportablePlayerGameState => ({
  ...pgs,
  discard: pgs.discard.map(({ id, cardId, ...rest }) => ({
    id,
    cardId,
    ...("power" in rest ? { power: rest.power } : {}),
    ...("hasAttacked" in rest ? { hasAttacked: rest.hasAttacked } : {}),
    ...("wasPlayedThisTurn" in rest
      ? { wasPlayedThisTurn: rest.wasPlayedThisTurn }
      : {}),
  })),
  field: pgs.field.map(({ id, cardId, ...rest }) => ({
    id,
    cardId,
    hasAttacked: rest.hasAttacked,
    wasPlayedThisTurn: rest.wasPlayedThisTurn,
  })),
  graveyard: pgs.graveyard.map(({ id, cardId, ...rest }) => ({
    id,
    cardId,
    hasAttacked: rest.hasAttacked,
    wasPlayedThisTurn: rest.wasPlayedThisTurn,
  })),
  hand: pgs.hand.map(({ id, cardId, ...rest }) => ({
    id,
    cardId,
    ...("power" in rest ? { power: rest.power } : {}),
    ...("hasAttacked" in rest ? { hasAttacked: rest.hasAttacked } : {}),
    ...("wasPlayedThisTurn" in rest
      ? { wasPlayedThisTurn: rest.wasPlayedThisTurn }
      : {}),
  })),
  protection: pgs.protection.map(({ id, cardId, ...rest }) => ({
    id,
    cardId,
    ...("power" in rest ? { power: rest.power } : {}),
    ...("hasAttacked" in rest ? { hasAttacked: rest.hasAttacked } : {}),
    ...("wasPlayedThisTurn" in rest
      ? { wasPlayedThisTurn: rest.wasPlayedThisTurn }
      : {}),
  })),
  resource: pgs.resource.map(({ id, cardId, ...rest }) => ({
    id,
    cardId,
    ...("power" in rest ? { power: rest.power } : {}),
    ...("hasAttacked" in rest ? { hasAttacked: rest.hasAttacked } : {}),
    ...("wasPlayedThisTurn" in rest
      ? { wasPlayedThisTurn: rest.wasPlayedThisTurn }
      : {}),
  })),
  stack: pgs.stack.map(({ id, cardId, ...rest }) => ({
    id,
    cardId,
    ...("power" in rest ? { power: rest.power } : {}),
    ...("hasAttacked" in rest ? { hasAttacked: rest.hasAttacked } : {}),
    ...("wasPlayedThisTurn" in rest
      ? { wasPlayedThisTurn: rest.wasPlayedThisTurn }
      : {}),
  })),
  userSelection:
    pgs.userSelection === null
      ? null
      : pgs.userSelection instanceof Array
      ? pgs.userSelection.map(({ id, cardId, ...rest }) => ({
          id,
          cardId,
          hasAttacked: rest.hasAttacked,
          wasPlayedThisTurn: rest.wasPlayedThisTurn,
          ...("power" in rest ? { power: rest.power } : {}),
        }))
      : {
          id: pgs.userSelection.id,
          cardId: pgs.userSelection.cardId,
          ...("power" in pgs.userSelection
            ? { power: pgs.userSelection.power }
            : {}),
          ...("hasAttacked" in pgs.userSelection
            ? { hasAttacked: pgs.userSelection.hasAttacked }
            : {}),
          ...("wasPlayedThisTurn" in pgs.userSelection
            ? { wasPlayedThisTurn: pgs.userSelection.wasPlayedThisTurn }
            : {}),
        },
});

const gameStateToTransportableGameState = (
  gs: GameState
): TransportableGameState => ({
  ...gs,
  player1: {
    ...gs.player1,
    state: playerGameStateToTransportablePlayerGameState(gs.player1.state),
  },
  player2: {
    ...gs.player2,
    state: playerGameStateToTransportablePlayerGameState(gs.player2.state),
  },
});

export const StoreProvider = ({ children }: PropsWithChildren) => {
  const [storeState, setStoreState] = useState<StoreData>({ ...initialStore });
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [stateReceived, setStateReceived] = useState(false);
  const [waitingForOpponent, setWaitingForOpponent] = useState(true);

  useEffect(() => {
    const wsInit = new WebSocket(
      process.env.NODE_ENV === "development"
        ? "ws://localhost:3001"
        : "ws://164.92.130.250:3001"
    );
    const [playerId, gameId] = [...window.location.href.split("/")].reverse();
    wsInit.onopen = () => {
      sendWsMessage(wsInit, {
        type: "connect",
        payload: {
          gameId,
          playerId,
          gameState: gameStateToTransportableGameState(storeState.game),
        },
      });
    };
    wsInit.onmessage = (event) => {
      const msg: WsIncomingMessage = JSON.parse(event.data);
      if (msg.type === "gameState") {
        setStateReceived(true);
        setStoreState({
          game: transportableGameStateToGameState(msg.payload.gameState),
        });
      }
      if (msg.type === "startGame") {
        setWaitingForOpponent(false);
        console.log("Game started!");
      }
      if (msg.type === "joined") {
        console.log("Joined game!");
        setWaitingForOpponent(false);
        const receivedGameState = transportableGameStateToGameState(
          msg.payload.gameState
        );
        setStoreState({
          game: {
            ...receivedGameState,
            player1: {
              ...receivedGameState.player1,
              deck: initialStore.game.player1.deck,
              state: {
                ...receivedGameState.player1.state,
                hand: initialStore.game.player1.state.hand,
                stack: initialStore.game.player1.state.stack,
              },
            },
          },
        });
      }
    };
    wsInit.onclose = () => {
      console.error("Disconnected from websocket");
    };
    wsInit.onerror = (error) => {
      console.error("Error connecting to websocket", error);
    };
    setWs(wsInit);
    return () => {
      if (wsInit.readyState === 1) {
        wsInit.close();
        setWs(null);
      }
    };
  }, []);

  useEffect(() => {
    if (ws && ws.readyState === 1) {
      if (stateReceived) {
        setStateReceived(false);
        return;
      }
      const [playerId, gameId] = window.location.href.split("/").reverse();
      sendWsMessage(ws, {
        type: "gameState",
        payload: {
          gameState: gameStateToTransportableGameState(storeState.game),
          gameId,
          playerId,
        },
      });
    }
  }, [storeState, ws]);

  return (
    <StoreContext.Provider
      value={{
        store: storeState,
        dispatch: setStoreState,
      }}
    >
      {children}
      {waitingForOpponent && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            bottom: "0",
            right: "0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(3px)",
          }}
        >
          <h1>Waiting for opponent</h1>
          <div>Link your friend to this URL to play!</div>
          <div>
            {(() => {
              const [_, gameId, ...rest] = [
                ...window.location.href.split("/"),
              ].reverse();
              // We're outside of React Router, so we need to get the game id from the URL
              const gameUrl = rest.reverse().join("/") + "/" + gameId;
              return gameUrl;
            })() +
              "/" +
              v4()}
          </div>
        </div>
      )}
    </StoreContext.Provider>
  );
};
