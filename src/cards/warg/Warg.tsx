import { Creature } from "../../store/Types";
import art from "./warg.png";

export const Warg: Creature = {
  cardId: "warg",
  name: "Warg",
  cost: 2,
  img: art,
  keywords: ["bloodlust"],
  power: 1500,
  type: "creature",
};
