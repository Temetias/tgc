import { Spell } from "../../store/Types";
import { processPostmortem } from "../../utils";
import { DestroyTooltip } from "../cardEffects";
import art from "./formation.png";

export const Formation: Spell = {
  cardId: "formation",
  name: "Formation",
  cost: 3,
  img: art,
  keywords: [],
  type: "spell",
  playEffect: {
    description: "Increase the power of your creatures by 1000",
    action: (state) => {
      return {
        ...state,
        player2: {
          ...state.player2,
          state: {
            ...state.player2.state,
            field: state.player2.state.field.map((card) => ({
              ...card,
              power: card.power + 1000,
            })),
          },
        },
      };
    },
  },
};
