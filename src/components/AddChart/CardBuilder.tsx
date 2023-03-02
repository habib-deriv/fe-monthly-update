import CardBuilderForm from './CardBuilderForm';
import CardPreview from './CardPreview';

const CardBuilder = () => {
    return (
        <div className="flex flex-row justify-around">
            <CardBuilderForm />
            <CardPreview />
        </div>

    );
};

export default CardBuilder;
