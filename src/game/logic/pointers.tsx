import { CreatureEntity, GameState } from "../../store/Types";
import Conditions from "./conditions";

export type GamePointer<T> = (game: GameState) => T;

const selectedCreatures: GamePointer<CreatureEntity[]> = (game) => {
  if (!Conditions.playerHasCreatureEntitiesSelected(game)) return [];
  return game.player1.state.userSelection as CreatureEntity[];
};

const remainingResource: GamePointer<number> = (game) =>
  game.player1.state.resource.length - game.player1.state.resourceSpent;

const Pointers = {
  selectedCreatures,
  remainingResource,
};

export default Pointers;
