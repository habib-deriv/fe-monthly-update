import React from "react";
import "./preview.scss";

type TItem = {
  item: any;
};

const Star = ({ item }: TItem) => {
  return (
      <div className="wrapper">
          <div className="clash-card barbarian">
              <div className="clash-card__image clash-card__image--barbarian">
                  <img src={item.image} alt="barbarian"/>
              </div>
              <div className="clash-card__unit-name">{item.name}</div>
              <div className="clash-card__unit-description">
                  {item.achievements}
              </div>

              <div className={`clash-card__unit-stats clash-card__unit-stats--${item.color} clearfix`}>
                  <div className="one-third">
                      <div className="stat">{item.office}</div>
                      <div className="stat-value">office</div>
                  </div>

                  <div className="one-third no-border">
                      <div className="stat">FE</div>
                      <div className="stat-value">{item.team}</div>
                  </div>
              </div>

          </div>
      </div>
  );
};

export default Star;
