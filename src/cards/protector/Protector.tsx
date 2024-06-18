import { Creature } from "../../store/Types";
import art from "./protector.png";

export const Protector: Creature = {
  cardId: "protector",
  name: "Protector",
  cost: 3,
  img: art,
  keywords: ["blocker"],
  power: 2500,
  type: "creature",
};
