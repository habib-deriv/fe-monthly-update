/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
type TAddChart = {
    showBuilder: (value: boolean) => void;
    title: string;
};

const AddChart = ({showBuilder, title}: TAddChart) => {
    return (
        <div
            className={'flex flex-col items-center justify-center pt-20 pb-20 w-1/4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 drop-shadow-lg w-1/3'}
            onClick={()=>showBuilder(true)}
        >
            <h1>{title}</h1>
        </div>);
};

export default AddChart;
