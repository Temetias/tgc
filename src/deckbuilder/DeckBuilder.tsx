import { useEffect, useState } from "react";
import { Layout } from "../Layout";
import { CardComponent } from "../cards/Card";
import cardIndex from "../cards/CardIndex";
import "./DeckBuilder.css";
import { LOCAL_STORAGE_DECK_KEY } from "../constants";
import { onlyUnique } from "../utils";
import { validateDeckList } from "../deckLoading";

export const DeckBuilder = () => {
  const [deck, setDeck] = useState<string[]>([]);

  useEffect(() => {
    const deck = localStorage.getItem(LOCAL_STORAGE_DECK_KEY);
    if (!deck) return;
    try {
      const parsedDeck = JSON.parse(deck);
      if (Array.isArray(parsedDeck) && validateDeckList(parsedDeck)) {
        setDeck(parsedDeck);
      } else {
        localStorage.removeItem(LOCAL_STORAGE_DECK_KEY);
      }
    } catch (e) {
      localStorage.removeItem(LOCAL_STORAGE_DECK_KEY);
    }
  }, []);

  return (
    <Layout>
      <div className="DeckBuilder">
        <div className="DeckList">
          {deck.filter(onlyUnique).map((cardId) => (
            <div className="DeckList__button-wrap" key={cardId}>
              {deck.filter((id) => id === cardId).length > 1 && (
                <div className="Decklist__button-count-indicator">
                  {deck.filter((id) => id === cardId).length}
                </div>
              )}
              <button
                onClick={() => {
                  const index = deck.indexOf(cardId);
                  setDeck([...deck.slice(0, index), ...deck.slice(index + 1)]);
                }}
                className="DeckList__button DeckList__button--card"
              >
                {cardIndex[cardId].name}
              </button>
            </div>
          ))}
          {validateDeckList(deck) && (
            <button
              className="DeckList__button DeckList__button--save"
              onClick={() => {
                localStorage.setItem(
                  LOCAL_STORAGE_DECK_KEY,
                  JSON.stringify(deck)
                );
                window.location.reload();
              }}
            >
              Save
            </button>
          )}
        </div>
        <div className="CardList">
          {Object.entries(cardIndex).map(([cardId, card]) => (
            <div
              key={cardId + deck.filter((id) => id === cardId).length}
              className="CardList__card"
              onClick={() => {
                if (deck.filter((id) => id === cardId).length >= 3) return;
                if (deck.length >= 30) return;
                setDeck([...deck, cardId]);
              }}
            >
              <CardComponent key={cardId} card={card} />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};
