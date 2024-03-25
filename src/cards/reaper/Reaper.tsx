import { Creature } from "../../store/Types";
import { DrawTooltip, draw } from "../cardEffects";
import art from "./reaper.png";

export const Reaper: Creature = {
  cardId: "reaper",
  name: "reaper",
  cost: 5,
  img: art,
  keywords: [],
  power: 4000,
  type: "creature",
  playEffect: {
    description: (
      <>
        <DrawTooltip /> 1
      </>
    ),
    action: draw,
  },
};
