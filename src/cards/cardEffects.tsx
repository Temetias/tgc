import { Effect, Keyword } from "../store/Types";
import { pickRandomCards } from "../utils";

export const draw: Effect = (gameState) => {
  const [remaining, picked] = pickRandomCards(gameState.player1.state.stack, 1);
  return {
    ...gameState,
    player1: {
      ...gameState.player1,
      state: {
        ...gameState.player1.state,
        hand: [...gameState.player1.state.hand, ...picked],
        stack: remaining,
      },
    },
  };
};

export const DrawTooltip = () => (
  <b title="Adds a card from your stack to your hand">draw</b>
);

export const revive: Effect = (gameState) => {
  const [card, ...rest] = [...gameState.player1.state.graveyard].reverse();
  if (!card) return gameState;
  return {
    ...gameState,
    player1: {
      ...gameState.player1,
      state: {
        ...gameState.player1.state,
        hand: [...gameState.player1.state.hand, card],
        graveyard: rest.reverse(),
      },
    },
  };
};

export const ReviveTooltip = () => (
  <b title="Adds a card from your discard to your hand">revive</b>
);

export const DestroyTooltip = () => (
  <b title="Removes a card from the battlefield and puts it into the discard">
    destroy
  </b>
);

export const FragileTooltip = () => (
  <b title="If this creature is destroyed, it ends up in discard instead of graveyard">
    fragile
  </b>
);

export const BlockerTooltip = () => (
  <b title="Other creatures cannot be attacked if a blocker is on the battlefield">
    blocker
  </b>
);

export const BloodlustTooltip = () => (
  <b title="This creature can attack enemy creatures immediately after being played">
    bloodlust
  </b>
);

export const KEYWORD_TOOLTIPS: Record<Keyword, () => JSX.Element> = {
  blocker: BlockerTooltip,
  draw: DrawTooltip,
  flow: () => <></>,
  fragile: FragileTooltip,
  bloodlust: BloodlustTooltip,
};
