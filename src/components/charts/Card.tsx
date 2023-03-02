import { nFormatter } from '@/utils';
type TCard = {
    title: string;
    value: number;
    class_name?: string;
    icon?: string;
    bgColor?: string;
    textColor?: string;
    onClick?: VoidFunction;
}

const Card = ({ title, value, class_name, icon, bgColor, textColor, onClick }: TCard) => {
    return(
        <div className={`flex flex-col items-center justify-center pt-10 pb-10 rounded-xl flex-grow ${class_name ? 'w-1/4' : ''} ${class_name ? class_name : ''}`}
            style={{
                backgroundColor: bgColor,
                color          : textColor,
            }}
            onClick={() => {
                if (onClick) {
                    onClick();
                }
            }}
        >
            {
                icon &&
                <div className="flex items-center justify-center mb-6 mr-auto ml-auto">
                    <img
                        src={icon}
                        alt="Icon"
                        width={24}
                        height={24}
                    />
                </div>
            }
            <h3 className='text-3xl font-bold'>{nFormatter(value || 0, 2)}</h3>
            <h6 className='text-sm opacity-70 font-medium leading-6'>{title}</h6>
        </div>
    );
};

export default Card;
