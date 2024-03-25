import { Creature } from "../../store/Types";
import { pickRandomCards } from "../../utils";
import art from "./greaterZombie.png";

export const GreaterZombie: Creature = {
  cardId: "greaterZombie",
  name: "Greater Zombie",
  cost: 4,
  img: art,
  keywords: [],
  power: 4000,
  type: "creature",
};
