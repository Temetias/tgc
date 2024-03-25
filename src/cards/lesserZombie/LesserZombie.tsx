import { Creature } from "../../store/Types";
import { pickRandomCards } from "../../utils";
import art from "./lesserZombie.png";

export const LesserZombie: Creature = {
  cardId: "lesserZombie",
  name: "Lesser Zombie",
  cost: 0,
  img: art,
  keywords: [],
  power: 1000,
  type: "creature",
};
