import { Creature } from "../../store/Types";
import { pickRandomCards } from "../../utils";
import art from "./warrior.png";

export const Warrior: Creature = {
  cardId: "warrior",
  name: "Warrior",
  cost: 2,
  img: art,
  keywords: [],
  power: 2000,
  type: "creature",
};
