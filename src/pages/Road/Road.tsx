import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, IconButton, Snackbar } from '@mui/material';
import { DeleteOutline, Edit, Close } from '@mui/icons-material';
import { DeleteConfirm, EmptyList, AddForm, Skeleton } from '@/components';
import { COLLECTIONS } from '@/constants';
import { useFetch } from '@/hooks';
import { sendRoadItems } from '@/utils/export-data';
import { setAddNewFormVisible, setDeleteVisible } from '@/stores/content';
import type { TFetchData } from '@/hooks/use_fetch';

const Road = () => {
    const dispatch = useDispatch();
    const { settings, content } = useSelector((state: any) => state);
    const [current_item, setCurrentItem] = useState<TFetchData | null>();
    const [is_download_snackbar_visible, setDownloadSnackbarVisibility] = useState(false);
    const [is_empty, setIsEmpty] = useState(false);
    const [is_loading, items] = useFetch(COLLECTIONS.ROADMAP);

    useEffect(() => {
        if (!items.length) setIsEmpty(true);
        else setIsEmpty(false);
    }, [items]);

    return (
        <div className="p-10">
            <div className="flex items-center justify-between mb-2">
                <h3 className="uppercase text-lg font-bold">Road Ahead</h3>
                <div className="flex items-center justify-end">
                    <Button
                        variant="contained"
                        disableElevation
                        color="primary"
                        size="small"
                        onClick={() => {
                            setCurrentItem(null);
                            dispatch(setAddNewFormVisible(true));
                        }}
                    >
                        Add New
                    </Button>
                    <Button
                        variant="contained"
                        disableElevation
                        color="secondary"
                        size="small"
                        className="ml-2"
                        onClick={() => {
                            sendRoadItems(items, settings.date);
                            setDownloadSnackbarVisibility(true);
                        }}
                    >
                        Generate Videos
                    </Button>
                </div>
            </div>
            <div>
                {is_loading && <Skeleton row={6} />}
                {!is_loading && items && !items.length && <EmptyList />}
                {!is_loading && !is_empty && items.map((item) => {
                    return (
                        <div key={item.id}
                            className="flex items-center justify-between px-4 py-2 border-2 mt-2 rounded-md"
                        >
                            <p className="text-sm mb-0 text-zinc-600">{item.title}</p>
                            <div className="w-20 flex items-center justify-end">
                                <IconButton
                                    aria-label="edit"
                                    color="warning"
                                    size="small"
                                    onClick={() => {
                                        setCurrentItem(item);
                                        dispatch(setAddNewFormVisible(true));
                                    }}
                                >
                                    <Edit fontSize="small" />
                                </IconButton>
                                <IconButton
                                    aria-label="delete"
                                    color="error"
                                    size="small"
                                    onClick={() => {
                                        setCurrentItem(item);
                                        dispatch(setDeleteVisible(true));
                                    }}
                                >
                                    <DeleteOutline fontSize="small" />
                                </IconButton>
                            </div>
                        </div>
                    );
                })}
            </div>

            {content.is_delete_visible && (
                <DeleteConfirm
                    item_id={current_item?.id!}
                    collection_name={COLLECTIONS.ROADMAP}
                />
            )}
            {content.is_add_new_form_visible && (
                <AddForm
                    item={current_item!}
                    collection={COLLECTIONS.ROADMAP}
                />
            )}

            <Snackbar
                open={is_download_snackbar_visible}
                autoHideDuration={6000}
                onClose={() => setDownloadSnackbarVisibility(false)}
                message="Download Query Added. Check List a few minutes later."
                action={
                    <IconButton
                        size="small"
                        aria-label="close"
                        color="inherit"
                        onClick={() => setDownloadSnackbarVisibility(false)}
                    >
                        <Close fontSize="small" />
                    </IconButton>
                }
            />
        </div>
    );
};

export default Road;
