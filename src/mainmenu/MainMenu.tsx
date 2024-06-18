import { useNavigate } from "react-router-dom";
import { Layout } from "../Layout";
import { v4 } from "uuid";
import "./MainMenu.css";
import { parseDeckFromLocalStorage } from "../deckLoading";

export const MainMenu = () => {
  const navigate = useNavigate();
  return (
    <Layout>
      <div className="MainMenu">
        {parseDeckFromLocalStorage()
          ? "Deck loaded from local storage."
          : "No deck loaded. You will start with a random deck."}
        <button onClick={() => navigate(`/game/${v4()}/${v4()}`)}>
          Start game
        </button>
        <button
          onClick={() => {
            navigate("/deckbuilder");
          }}
        >
          Deck builder
        </button>
      </div>
    </Layout>
  );
};
