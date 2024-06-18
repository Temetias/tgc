import cardIndex from "./cards/CardIndex";
import { LOCAL_STORAGE_DECK_KEY } from "./constants";
import { Card } from "./store/Types";

export const validateDeckList = (deckList: string[]): boolean => {
  return (
    // No undefined cards
    deckList.every((cardId) => cardIndex[cardId] !== undefined) &&
    // Exactly 30 cards
    deckList.length === 30 &&
    // Only 3 copies of each card
    deckList.every(
      (cardId) => deckList.filter((id) => id === cardId).length <= 3
    )
  );
};

export const parseDeckFromLocalStorage = (): Card[] | null => {
  const deckList = localStorage.getItem(LOCAL_STORAGE_DECK_KEY);
  if (!deckList) return null;
  try {
    const parsedDeck = JSON.parse(deckList);
    if (Array.isArray(parsedDeck) && validateDeckList(parsedDeck)) {
      return parsedDeck.map((cardId) => cardIndex[cardId]);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_DECK_KEY);
      return null;
    }
  } catch (e) {
    localStorage.removeItem(LOCAL_STORAGE_DECK_KEY);
    return null;
  }
};
