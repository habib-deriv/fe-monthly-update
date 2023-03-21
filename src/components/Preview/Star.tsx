import React from "react";
import "./preview.scss";

type TItem = {
  item: any;
};

const Star = ({ item }: TItem) => {
  return (
    <div className="preview-star__container">
      <div
        className="preview-star__img bg-cover"
        style={{ backgroundImage: `url(${item.image})` }}
      ></div>

      <div className="preview-star__achievements__content flex flex-col p-4">
        <div className="preview-star__title w-full rounded-bl-md">
          <h1 className="text relative z-10 text-2xl font-bold p-4">
            {item.name}
          </h1>
          <div className="preview-star__team text-white">{item.team}</div>
        </div>
        <ul className="list-disc ml-4 mt-4">
          {item.achievements.split(" | ").map((item: string, idx: number) => {
            return (
              <li
                key={idx}
                className="preview-star__list-item text text-sm mb-2"
              >
                {item}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Star;
