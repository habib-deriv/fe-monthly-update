import React from 'react';
import './preview.scss';

type TItem = {
    item: any;
}

const Star = ({ item }: TItem) => {
    return (
        <div className="preview-star__container flex align-middle justify-start rounded-md">
            <div
                className="preview-star__image flex items-end rounded-l-md bg-cover bg-bottom w-48 relative"
                style={{ backgroundImage: `url(${item.image})`}}
            >
                <div className="preview-star__image__overlay rounded-l-md"></div>
                <div className="preview-star__title w-full rounded-bl-md">
                    <h1 className="text-white relative z-10 text-2xl font-bold p-4">
                        {item.name}
                    </h1>
                </div>
            </div>

            <div className="preview-star__achievements flex-1 rounded-r-md">
                <div className="preview-star__achievements__content flex flex-col justify-end p-4">
                    <ul className="list-disc ml-4">
                        {item.achievements.split(' | ').map((item: string, idx: number) => {
                            return (
                                <li
                                    key={idx}
                                    className="text-white text-sm mb-2"
                                >
                                    {item}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Star;
