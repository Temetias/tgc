import { Card } from "../store/Types";
import { Angel } from "./angel/Angel";
import { Chort } from "./chort/Chort";
import { Doom } from "./doom/Doom";
import { Draconid } from "./draconid/Draconid";
import { FireLash } from "./fireLash/FireLash";
import { FlamingBallista } from "./flamingBallista/FlamingBallista";
import { Formation } from "./formation/Formation";
import { GreaterZombie } from "./greaterZombie/GreaterZombie";
import { Imp } from "./imp/Imp";
import { LesserZombie } from "./lesserZombie/LesserZombie";
import { Necromancer } from "./necromancer/Necromancer";
import { Protector } from "./protector/Protector";
import { RaiseTheDead } from "./raisethedead/RaiseTheDead";
import { Reaper } from "./reaper/Reaper";
import { Siren } from "./siren/Siren";
import { Warg } from "./warg/Warg";
import { Warrior } from "./warrior/Warrior";
import { Wave } from "./wave/Wave";

const allCards = [
  Angel,
  Chort,
  Doom,
  Draconid,
  FireLash,
  FlamingBallista,
  Formation,
  GreaterZombie,
  Imp,
  LesserZombie,
  Necromancer,
  Protector,
  RaiseTheDead,
  Reaper,
  Siren,
  Warg,
  Warrior,
  Wave,
];

const cardIndex = allCards.reduce((acc, card) => {
  acc[card.cardId] = card;
  return acc;
}, {} as Record<string, Card>);

export default cardIndex;
