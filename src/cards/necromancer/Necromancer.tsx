import { Creature } from "../../store/Types";
import { ReviveTooltip, revive } from "../cardEffects";
import art from "./necromancer.png";

export const Necromancer: Creature = {
  cardId: "necromancer",
  name: "Necromancer",
  cost: 4,
  img: art,
  keywords: ["fragile"],
  power: 2000,
  type: "creature",
  playEffect: {
    description: (
      <>
        <ReviveTooltip /> 1
      </>
    ),
    action: revive,
  },
};
