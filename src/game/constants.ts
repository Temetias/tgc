import { Angel } from "../cards/angel/Angel";
import { Doom } from "../cards/doom/Doom";
import { FireLash } from "../cards/fireLash/FireLash";
import { GreaterZombie } from "../cards/greaterZombie/GreaterZombie";
import { LesserZombie } from "../cards/lesserZombie/LesserZombie";
import { Necromancer } from "../cards/necromancer/Necromancer";
import { Protector } from "../cards/protector/Protector";
import { RaiseTheDead } from "../cards/raisethedead/RaiseTheDead";
import { Reaper } from "../cards/reaper/Reaper";
import { Warrior } from "../cards/warrior/Warrior";
import { Wave } from "../cards/wave/Wave";
import { Card } from "../store/Types";

export const PROTECTION_POWER = 2000;

export const MOCK_DECK: Card[] = [
  Necromancer,
  Necromancer,
  Necromancer,
  Protector,
  Protector,
  Wave,
  Wave,
  Reaper,
  Reaper,
  Reaper,
  GreaterZombie,
  GreaterZombie,
  GreaterZombie,
  GreaterZombie,
  GreaterZombie,
  LesserZombie,
  LesserZombie,
  LesserZombie,
  LesserZombie,
  LesserZombie,
  Doom,
  RaiseTheDead,
  RaiseTheDead,
  Warrior,
  Warrior,
  Warrior,
  Warrior,
  Warrior,
  Angel,
  Angel,
  FireLash,
  FireLash,
  FireLash,
];
