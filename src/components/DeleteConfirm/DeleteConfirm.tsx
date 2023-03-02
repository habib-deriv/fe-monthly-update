import React from 'react';
import ReactDOM from 'react-dom';
import { useDispatch } from 'react-redux';
import { deleteRecord } from '@/utils/db-operations';
import { LoadingButton } from '@mui/lab';
import { Button } from '@mui/material';
import { setDeleteVisible, setRefresh } from '@/stores/content';

type TProps = {
    item_id: string;
    collection_name: string;
};

const DeleteConfirm = ({ item_id, collection_name }: TProps) => {
    const dispatch = useDispatch();
    const el = document.getElementById('modal-portal');
    const [is_loading, setLoading] = React.useState(false);

    const onConfirm = async () => {
        setLoading(true);
        await deleteRecord(collection_name, item_id).then(() => {
            dispatch(setRefresh(true));
            dispatch(setDeleteVisible(false));
        }).catch().finally(() => {
            setLoading(false);
        });
    };

    if (el) {
        return ReactDOM.createPortal(
            <div className="main-modal">
                <div className="bg-white rounded-md w-96 p-2">
                    <p className="font-bold text-lg p-4">Are you sure?</p>

                    <div className="p-4 flex items-center justify-end">
                        <Button
                            disableElevation
                            disabled={is_loading}
                            onClick={() => dispatch(setDeleteVisible(false))}
                        >
                            Cancel
                        </Button>
                        <LoadingButton
                            disableElevation
                            variant="contained"
                            color="error"
                            disabled={is_loading}
                            loading={is_loading}
                            onClick={() => onConfirm()}
                            className="ml-2"
                        >
                            Delete
                        </LoadingButton>
                    </div>
                </div>
            </div>,
            el
        );
    }
    return null;
};

export default DeleteConfirm;
