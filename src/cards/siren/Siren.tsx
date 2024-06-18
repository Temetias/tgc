import { Creature, CreatureEntity } from "../../store/Types";
import art from "./siren.png";

export const Siren: Creature = {
  cardId: "siren",
  name: "Siren",
  cost: 2,
  img: art,
  keywords: [],
  power: 1500,
  type: "creature",
  playEffect: {
    description: "Summon all other Sirens from your hand.",
    action: (gameState) => {
      const sirens = gameState.player1.state.hand.filter(
        (card) => card.cardId === "siren"
      ) as CreatureEntity[];
      if (sirens.length === 0) return gameState;
      return {
        ...gameState,
        player1: {
          ...gameState.player1,
          state: {
            ...gameState.player1.state,
            field: [...gameState.player1.state.field, ...sirens],
            hand: gameState.player1.state.hand.filter(
              (card) => card.cardId !== "siren"
            ),
          },
        },
      };
    },
  },
};
