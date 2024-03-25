import { Card } from "../store/Types";
import { Angel } from "./angel/Angel";
import { Doom } from "./doom/Doom";
import { FireLash } from "./fireLash/FireLash";
import { GreaterZombie } from "./greaterZombie/GreaterZombie";
import { LesserZombie } from "./lesserZombie/LesserZombie";
import { Necromancer } from "./necromancer/Necromancer";
import { Protector } from "./protector/Protector";
import { RaiseTheDead } from "./raisethedead/RaiseTheDead";
import { Reaper } from "./reaper/Reaper";
import { Warrior } from "./warrior/Warrior";
import { Wave } from "./wave/Wave";

const allCards = [
  Angel,
  Doom,
  FireLash,
  GreaterZombie,
  LesserZombie,
  Necromancer,
  Protector,
  RaiseTheDead,
  Reaper,
  Warrior,
  Wave,
];

const cardIndex = allCards.reduce((acc, card) => {
  acc[card.cardId] = card;
  return acc;
}, {} as Record<string, Card>);

export default cardIndex;
