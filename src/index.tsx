import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { StoreProvider } from "./store/Core";
import { RouterProvider, Navigate, createHashRouter } from "react-router-dom";
import { Game } from "./game/ui/Game";
import { v4 } from "uuid";

const router = createHashRouter([
  {
    path: "/",
    element: <Navigate to={`/game/${v4()}/${v4()}`} />,
  },
  {
    path: "/game/:gameId/:playerId",
    element: <Game />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  //  <React.StrictMode>
  <StoreProvider>
    <RouterProvider router={router} />
  </StoreProvider>
  //  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
