import React from "react";
import { Card } from "../store/Types";
import "./Card.css";
import { KEYWORD_TOOLTIPS } from "./cardEffects";
import cardback from "./cardback.png";

export const CardBackComponent = ({ className }: { className?: string }) => (
  <div className={"Card--container " + (className ? className : "")}>
    <div className="Card--padder"></div>
    <div
      className="Card Card--back"
      style={{
        backgroundImage: `url(${cardback})`,
      }}
    ></div>
  </div>
);

export const CardComponent = ({
  card,
  className,
}: {
  card: Card;
  className?: string;
}) => (
  <div className={"Card--container " + (className ? className : "")}>
    <div className="Card--padder"></div>
    <div
      className="Card Card--face"
      style={{
        backgroundImage: `url(${card.img})`,
      }}
    >
      <div
        className="Card--cost"
        title={`This card costs ${card.cost} resources to play. Resources are gained by playing cards to the resource. Resource replenishes every time player starts their turn.`}
      >
        {card.cost}
      </div>
      <div className="Card--text">
        <div>{card.name}</div>
        <div>
          <div>
            <b>
              {card.keywords?.map((keyword, i) => (
                <React.Fragment key={keyword}>
                  {!!i && ", "}
                  {KEYWORD_TOOLTIPS[keyword]()}
                </React.Fragment>
              ))}
            </b>
          </div>
          {card.playEffect?.description}
        </div>
      </div>
      <div
        className="Card--power"
        title={
          card.type === "creature"
            ? `This creature has a power of ${card.power}. Creatures can destroy other creatures of same or lesser power. Creatures die while attacking other creatures with same or lesser power. Multiple creatures can combine their offensive power.`
            : ""
        }
      >
        {card.type === "creature" ? <div>{card.power}</div> : null}
      </div>
    </div>
  </div>
);
