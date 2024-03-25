import { Spell } from "../../store/Types";
import art from "./fireLash.png";

export const FireLash: Spell = {
  cardId: "fireLash",
  name: "Fire Lash",
  cost: 2,
  img: art,
  keywords: [],
  type: "spell",
  playEffect: {
    description: "Remove one protection from the opponent",
    action: (state) => {
      const [card, ...rest] = state.player2.state.protection;
      if (!card) return state;
      return {
        ...state,
        player2: {
          ...state.player2,
          state: {
            ...state.player2.state,
            protection: rest,
            hand: [...state.player2.state.hand, card],
          },
        },
      };
    },
  },
};
