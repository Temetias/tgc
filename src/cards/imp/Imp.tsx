import { Creature } from "../../store/Types";
import art from "./imp.png";

export const Imp: Creature = {
  cardId: "imp",
  name: "Imp",
  cost: 0,
  img: art,
  keywords: ["blocker"],
  power: 500,
  type: "creature",
};
