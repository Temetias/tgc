import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { StoreProvider } from "./store/Core";
import { RouterProvider, Navigate, createHashRouter } from "react-router-dom";
import { Game } from "./game/ui/Game";
import { v4 } from "uuid";
import { DeckBuilder } from "./deckbuilder/DeckBuilder";
import { MainMenu } from "./mainmenu/MainMenu";

const router = createHashRouter([
  {
    path: "/",
    element: <MainMenu />,
  },
  {
    path: "/game/:gameId/:playerId",
    element: (
      <StoreProvider>
        <Game />
      </StoreProvider>
    ),
  },
  {
    path: "/deckbuilder",
    element: <DeckBuilder />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  //  <React.StrictMode>
  <RouterProvider router={router} />
  //  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
