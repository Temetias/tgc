import { Spell } from "../../store/Types";
import { processPostmortem } from "../../utils";
import { DestroyTooltip } from "../cardEffects";
import art from "./wave.png";

export const Wave: Spell = {
  cardId: "wave",
  name: "Wave",
  cost: 3,
  img: art,
  keywords: [],
  type: "spell",
  playEffect: {
    description: (
      <>
        <DestroyTooltip /> all enemy creatures with 2000 or less power
      </>
    ),
    action: (state) => ({
      ...state,
      player2: {
        ...state.player2,
        state: processPostmortem(
          {
            ...state.player2.state,
            field: state.player2.state.field.filter(
              (card) => card.power > 2000
            ),
          },
          state.player2.state.field.filter((card) => card.power <= 2000)
        ),
      },
    }),
  },
};
