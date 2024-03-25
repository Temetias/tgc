import { Spell } from "../../store/Types";
import { ReviveTooltip, revive } from "../cardEffects";
import art from "./raisethedead.png";

export const RaiseTheDead: Spell = {
  cardId: "raisethedead",
  name: "Raise The Dead",
  cost: 5,
  img: art,
  keywords: [],
  type: "spell",
  playEffect: {
    description: (
      <>
        <ReviveTooltip /> 2
      </>
    ),
    action: (state) => revive(revive(state)),
  },
};
