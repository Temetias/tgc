import cardIndex from "./cards/CardIndex";
import { LOCAL_STORAGE_DECK_KEY } from "./constants";
import { Card, CardEntity, CreatureEntity, Player } from "./store/Types";

// Randomly pics the specified amount of cards from the deck and returns the
// remaining deck and the picked cards.
// Use Math.random for selection for now
export const pickRandomCards = (
  deck: CardEntity[],
  amount: number
): [CardEntity[], CardEntity[]] => {
  const picked: CardEntity[] = [];
  let remaining: CardEntity[] = [...deck];
  while (picked.length < amount && remaining.length) {
    const index = Math.floor(Math.random() * remaining.length);
    picked.push(remaining[index]);
    remaining.splice(index, 1);
  }
  return [remaining, picked];
};

export const processPostmortem = (
  playerState: Player["state"],
  cards: CardEntity[]
): Player["state"] => {
  return cards.reduce((acc, card) => {
    if (card.type === "spell" || card.keywords.includes("fragile")) {
      return {
        ...acc,
        discard: [...acc.discard, card],
      };
    } else {
      return {
        ...acc,
        graveyard: [...acc.graveyard, card as CreatureEntity],
      };
    }
  }, playerState);
};

export const onlyUnique = <T extends string | number>(
  value: T,
  index: number,
  array: T[]
) => {
  return array.indexOf(value) === index;
};
