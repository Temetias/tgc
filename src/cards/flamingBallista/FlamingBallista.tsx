import { Spell } from "../../store/Types";
import { processPostmortem } from "../../utils";
import { DestroyTooltip } from "../cardEffects";
import art from "./flamingballista.png";

export const FlamingBallista: Spell = {
  cardId: "flamingBallista",
  name: "Flaming Ballista",
  cost: 3,
  img: art,
  keywords: [],
  type: "spell",
  playEffect: {
    description: (
      <>
        <DestroyTooltip /> the enemy creature with the highest power. If there
        are multiple, <DestroyTooltip /> all of them.
      </>
    ),
    action: (state) => {
      const highestPower = Math.max(
        ...state.player2.state.field.map((card) => card.power)
      );
      return {
        ...state,
        player2: {
          ...state.player2,
          state: processPostmortem(
            {
              ...state.player2.state,
              field: state.player2.state.field.filter(
                (card) => card.power < highestPower
              ),
            },
            state.player2.state.field.filter(
              (card) => card.power === highestPower
            )
          ),
        },
      };
    },
  },
};
