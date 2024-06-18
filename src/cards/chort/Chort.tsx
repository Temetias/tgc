import { Creature } from "../../store/Types";
import art from "./chort.png";

export const Chort: Creature = {
  cardId: "chort",
  name: "Chort",
  cost: 4,
  img: art,
  keywords: ["bloodlust"],
  power: 3000,
  type: "creature",
};
