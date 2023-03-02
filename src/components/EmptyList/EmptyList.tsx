import EmptySVG from '@/assets/box-empty.svg';
import classNames from 'classnames';

type TProps = {
    title?: string;
    description?: string;
    has_title?: boolean;
    has_image?: boolean;
    has_description?: boolean;
}

const EmptyList = ({ title, description, has_title = true, has_image = true, has_description = true }: TProps) =>{
    return (
        <div className="flex flex-col items-center justify-between p-8 border-2 mt-2 rounded-md">
            {has_image && (
                <img
                    className="mb-4 w-48"
                    src={EmptySVG}
                    alt="Empty List"
                />
            )}
            {has_title && (
                <p className="text-lg text-black uppercase">
                    {title || 'The List is empty!'}
                </p>
            )}
            {has_description && (
                <p className={classNames('text-sm text-black mb-0', { 'mt-2': !!title })}>
                    {description || 'Add some items by clicking on the Add New button.'}
                </p>
            )}
        </div>
    );
};

export default EmptyList;
