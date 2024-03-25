import { Spell } from "../../store/Types";
import { processPostmortem } from "../../utils";
import { DestroyTooltip } from "../cardEffects";
import art from "./doom.png";

export const Doom: Spell = {
  cardId: "doom",
  name: "Doom",
  cost: 7,
  img: art,
  keywords: [],
  type: "spell",
  playEffect: {
    description: (
      <>
        <DestroyTooltip /> all enemy creatures
      </>
    ),
    action: (state) => ({
      ...state,
      player2: {
        ...state.player2,
        state: processPostmortem(
          {
            ...state.player2.state,
            field: [],
          },
          state.player2.state.field
        ),
      },
    }),
  },
};
