import { Layout } from "../../Layout";
import { useStoreState, useStoreDispatch } from "../../store/Core";
import "./Game.css";
import {
  CardEntity,
  CreatureEntity,
  isCreatureEntity,
} from "../../store/Types";
import { CardBackComponent, CardComponent } from "../../cards/Card";
import boardArt from "./board.png";
import deathArt from "./death.png";
import Conditions from "../../game/logic/conditions";
import Actions from "../../game/logic/actions";
import Pointers from "../logic/pointers";
import { useEffect, useState } from "react";
import { PROTECTION_POWER } from "../constants";

const OpponentHand = ({ hand }: { hand: CardEntity[] }) => {
  const { game } = useStoreState();
  const userSelectionId =
    game.player2.state.userSelection && "id" in game.player2.state.userSelection
      ? game.player2.state.userSelection?.id
      : null;
  return (
    <div className="Hand Hand--opponent">
      {hand.map((c, i) => (
        <div
          key={c.id}
          style={{
            transition: "transform 0.4s",
            transform:
              userSelectionId === c.id
                ? `
                rotate(0)
                translateY(15vh)
                scale(1.5)
                `
                : `
                rotate(${(i - Math.floor(hand.length / 2) ?? 0) * -4}deg)
                translateY(${Math.abs(i - Math.floor(hand.length / 2)) * -10}px)
                scale(1.5)
                `,
          }}
        >
          <CardBackComponent />
        </div>
      ))}
    </div>
  );
};

const Hand = ({ hand }: { hand: CardEntity[] }) => {
  const dispatch = useStoreDispatch();
  const { game } = useStoreState();
  const remainingResource = Pointers.remainingResource(game);
  const userSelectionId =
    game.player1.state.userSelection && "id" in game.player1.state.userSelection
      ? game.player1.state.userSelection?.id
      : null;
  return (
    <div className="Hand Hand--player">
      {hand.map((card, i) => (
        <div
          key={card.id}
          onClick={(e) => {
            e.stopPropagation();
            dispatch(Actions.selectCard(card));
          }}
          style={{
            transition: "transform 0.4s",
            transform:
              userSelectionId === card.id
                ? `
                rotate(0)
                translateY(-25vh)
                scale(2.5)
                `
                : `
                rotate(${(i - Math.floor(hand.length / 2) ?? 0) * 4}deg)
                translateY(${Math.abs(i - Math.floor(hand.length / 2)) * 10}px)
                scale(1.5)
          `,
          }}
        >
          <CardComponent
            card={card}
            className={
              (remainingResource >= card.cost &&
              !Pointers.selectedCreatures(game).length &&
              game.turn === "player1"
                ? "Game--playable "
                : "") + (userSelectionId === card.id ? "Game--selected" : "")
            }
          />
        </div>
      ))}
    </div>
  );
};

const Protection = ({ protection }: { protection: CardEntity[] }) => (
  <div
    className="Protection"
    title={`This card protects the player. It takes ${PROTECTION_POWER} power to destroy the protection. Destroyed cards from protection go to the player's hand.`}
  >
    {protection.map((c) => (
      <div key={c.id}>
        <CardBackComponent />
      </div>
    ))}
  </div>
);

const OpponentProtection = ({ protection }: { protection: CardEntity[] }) => {
  const dispatch = useStoreDispatch();
  const { game } = useStoreState();
  return (
    <div
      className="Protection Protection--opponent"
      title={`This card protects the player. It takes ${PROTECTION_POWER} power to destroy the protection. Destroyed cards from protection go to the player's hand.`}
    >
      {protection.map((c, i) => (
        <div key={i} onClick={() => dispatch(Actions.attackProtection(c))}>
          <CardBackComponent />
        </div>
      ))}
      {Conditions.playerCanWinGame(game) && (
        <div
          className="Protection__death-indicator"
          title="Finish your opponent!"
        >
          <img src={deathArt} onClick={() => dispatch(Actions.winGame())} />
        </div>
      )}
    </div>
  );
};

const Resource = ({ resource }: { resource: CardEntity[] }) => {
  const { game } = useStoreState();
  const dispatch = useStoreDispatch();
  const showTooltip =
    Conditions.playerHasCardSelected(game) &&
    !Conditions.playerHasPlayedResource(game);
  return (
    <div
      data-title="Resource"
      className={"Resource " + (showTooltip ? "Resource--tooltip" : "")}
      title={
        "Resource " +
        (showTooltip
          ? "Cards in resource allow you to play cards from your hand. Resource replenishes every time player starts their turn. Cards in resource can't interact with the field."
          : "")
      }
      onClick={() => dispatch(Actions.playSelectionCardToResource())}
    >
      {resource.map((card) => (
        <div key={card.id}>
          <CardComponent card={card} />
        </div>
      ))}
    </div>
  );
};

const OpponentResource = ({ resource }: { resource: CardEntity[] }) => (
  <div className="Resource Resource--opponent">
    {resource.map((card) => (
      <div key={card.id}>
        <CardComponent card={card} />
      </div>
    ))}
  </div>
);

const Field = ({ field }: { field: CreatureEntity[] }) => {
  const { game } = useStoreState();
  const dispatch = useStoreDispatch();
  const showTooltip = Conditions.playerHasPlayableCardSelected(game);
  return (
    <div
      data-title="Field"
      className={"Field " + (showTooltip ? "Field--tooltip" : "")}
      title={
        showTooltip
          ? "Creatures on the field can attack other creatures and enemy protection."
          : ""
      }
      onClick={() => {
        if (Conditions.playerHasCardSelected(game)) {
          if (
            isCreatureEntity(game.player1.state.userSelection as CardEntity)
          ) {
            dispatch(Actions.playSelectionCreatureToField());
          } else {
            dispatch(Actions.playSelectionSpellToField());
          }
        }
      }}
    >
      {field.map((card, i) => (
        <div
          key={card.id}
          style={{
            transform: Pointers.selectedCreatures(game).includes(card)
              ? "translateY(-10px)"
              : "",
            transition: "transform 0.2s",
          }}
          onClick={(e) => {
            e.stopPropagation();
            dispatch(Actions.selectCreature(card));
          }}
        >
          <CardComponent
            card={card}
            className={
              (!card.hasAttacked &&
              !Pointers.selectedCreatures(game).length &&
              game.turn === "player1"
                ? "Game--playable "
                : "") +
              (Conditions.playerHasCreatureEntitiesSelected(game) &&
              (game.player1.state.userSelection as CreatureEntity[]).includes(
                card
              )
                ? "Game--selected"
                : "")
            }
          />
        </div>
      ))}
    </div>
  );
};

const OpponentField = ({ field }: { field: CreatureEntity[] }) => {
  const dispatch = useStoreDispatch();
  return (
    <div className="Field Field--opponent">
      {field.map((card) => (
        <div
          key={card.id}
          onClick={() => dispatch(Actions.attackCreature(card))}
        >
          <CardComponent card={card} />
        </div>
      ))}
    </div>
  );
};

export const Game = () => {
  const { game } = useStoreState();
  const dispatch = useStoreDispatch();
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Esc") {
        dispatch(Actions.selectCard(null));
      }
    };
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [dispatch]);
  const [graveyardOverlayPlayer, setGraveyardOverlayPlayer] = useState<
    "player1" | "player2" | null
  >(null);
  return (
    <Layout>
      <div
        style={{
          backgroundImage: `
          linear-gradient(
            rgba(0, 0, 0, 0.1),
            rgba(0, 0, 0, 0.1)
          ),
          url(${boardArt})
          `,
        }}
        className="Game"
        onClick={() => dispatch(Actions.selectCard(null))}
      >
        <div className="Game__left"></div>
        <div className="Game__center">
          <div className="Gameside Gameside--opponent">
            <OpponentHand hand={game.player2.state.hand} />
            <OpponentResource resource={game.player2.state.resource} />
            <OpponentProtection protection={game.player2.state.protection} />
            <OpponentField field={game.player2.state.field} />
          </div>
          <div className="Gameside Gameside--player">
            <Field field={game.player1.state.field} />
            <Protection protection={game.player1.state.protection} />
            <Resource resource={game.player1.state.resource} />
            <Hand hand={game.player1.state.hand} />
          </div>
        </div>
        <div className="Game__right">
          <div>
            <div
              className="Game__stack"
              title={`Opponents stack has ${game.player2.state.stack.length} cards left.`}
            >
              {game.player2.state.stack.map((c, i) => (
                <div
                  key={c.id}
                  style={{
                    transform: `
                  translateY(calc(-50% + ${i * 0.5}px))
                  translateX(calc(-50% + ${i * 0.5}px))
                `,
                  }}
                >
                  <CardBackComponent />
                </div>
              ))}
            </div>
            <div
              className="Game__stack Game__stack--graveyard"
              title={`Opponents graveyard has ${game.player2.state.graveyard.length} cards.`}
              onClick={() => setGraveyardOverlayPlayer("player2")}
            >
              {game.player2.state.graveyard.map((c, i) => (
                <div
                  key={c.id}
                  style={{
                    transform: `
                  translateY(calc(-50% + ${i * 0.5}px))
                  translateX(calc(-50% + ${i * 0.5}px))
                `,
                  }}
                >
                  <CardComponent card={c} />
                </div>
              ))}
            </div>
          </div>
          <div>
            {game.turn === "player1" && (
              <button
                className="Game__end-turn"
                onClick={() => dispatch(Actions.endTurn())}
              >
                End Turn
              </button>
            )}
          </div>
          <div>
            <div
              className="Game__stack Game__stack--graveyard"
              title={`Your graveyard has ${game.player1.state.graveyard.length} cards.`}
              onClick={() => setGraveyardOverlayPlayer("player1")}
            >
              {game.player1.state.graveyard.map((c, i) => (
                <div
                  key={c.id}
                  style={{
                    transform: `
                  translateY(calc(-50% + ${i * 0.5}px))
                  translateX(calc(-50% + ${i * 0.5}px))
                `,
                  }}
                >
                  <CardComponent card={c} />
                </div>
              ))}
            </div>
            <div
              className="Game__stack"
              title={`Your stack has ${game.player1.state.stack.length} cards left.`}
            >
              {game.player1.state.stack.map((c, i) => (
                <div
                  key={c.id}
                  style={{
                    transform: `
                    translateY(calc(-50% + ${i * 0.5}px))
                    translateX(calc(-50% + ${i * 0.5}px))
                  `,
                  }}
                >
                  <CardBackComponent />
                </div>
              ))}
            </div>
          </div>
        </div>
        {game.winner && (
          <div className="Game__winner">
            <div>
              <header>{game.winner} wins</header>
              <div>Turn {game.turnNumber}</div>
            </div>
          </div>
        )}
        {graveyardOverlayPlayer && (
          <div
            className="Game__graveyard-overlay"
            onClick={() => setGraveyardOverlayPlayer(null)}
          >
            <div>{graveyardOverlayPlayer}</div>
            <div>
              <div>Graveyard</div>
              {[...game[graveyardOverlayPlayer].state.graveyard]
                .reverse()
                .map((c) => (
                  <div key={c.id} onClick={(e) => e.stopPropagation()}>
                    <CardComponent card={c} />
                  </div>
                ))}
            </div>
            <div>
              <div>Discard</div>
              {[...game[graveyardOverlayPlayer].state.discard]
                .reverse()
                .map((c) => (
                  <div key={c.id} onClick={(e) => e.stopPropagation()}>
                    <CardComponent card={c} />
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
