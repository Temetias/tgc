import { Creature } from "../../store/Types";
import art from "./angel.png";

export const Angel: Creature = {
  cardId: "angel",
  name: "Angel",
  cost: 6,
  img: art,
  keywords: [],
  power: 1500,
  type: "creature",
  playEffect: {
    description:
      "Take one card from the discard and put it in your protection.",
    action: (gameState) => {
      const [card, ...rest] = [...gameState.player1.state.discard].reverse();
      if (!card) return gameState;
      return {
        ...gameState,
        player1: {
          ...gameState.player1,
          state: {
            ...gameState.player1.state,
            protection: [...gameState.player1.state.protection, card],
            discard: rest.reverse(),
          },
        },
      };
    },
  },
};
