import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classnames from 'classnames';
import { Button, IconButton, Chip } from '@mui/material';
import { DeleteOutline, Edit, FileDownload } from '@mui/icons-material';
import { DeleteConfirm, AddForm, Skeleton, MonthSelector, EmptyList } from '@/components';
import { useFetch } from '@/hooks';
import { COLLECTIONS } from '@/constants';
import { capitalize, sendWeeklyTasks, has_items_in_month, has_items_in_week } from '@/utils';
import { setAddNewFormVisible, setDeleteVisible } from '@/stores/content';
import type { TFetchData } from '@/hooks/use_fetch';

const Tasks = () => {
    const dispatch = useDispatch();
    const { settings, content } = useSelector((state: any) => state);
    const [current_item, setCurrentItem] = useState<TFetchData | null>();
    const [is_loading, items, grouped_items] = useFetch(COLLECTIONS.TASK, 'week', settings.list.weeks);

    return (
        <div className="p-10">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center justify-start basis-1/3">
                    <h3 className="uppercase text-lg font-bold mr-2">Tasks</h3>
                    <Chip
                        label={capitalize(settings.date.month)}
                        size="small"
                        color="primary"
                        variant="outlined"
                    />
                </div>
                <div className="flex items-center justify-end basis-2/3">
                    <MonthSelector />
                    <Button
                        variant="contained"
                        disableElevation
                        color="primary"
                        size="small"
                        className="ml-2"
                        onClick={() => {
                            setCurrentItem(null);
                            dispatch(setAddNewFormVisible(true));
                        }}
                    >
                        Add New
                    </Button>
                </div>
            </div>

            {is_loading && <Skeleton row={6} />}
            {!is_loading && (!has_items_in_month(items, settings.date.month) || (items && !items.length)) && <EmptyList />}
            {!is_loading && has_items_in_month(items, settings.date.month) && items && items.length && Object.keys(grouped_items).map((key) => {
                return (
                    <div
                        className="mb-6"
                        key={key}
                    >
                        <div className="flex items-center justify-between">
                            <span className="block uppercase text-xs font-bold text-zinc-400">
                                Week {key}
                            </span>
                            {has_items_in_week(grouped_items, key, settings.date.month) && (
                                <IconButton
                                    aria-label="download"
                                    color="primary"
                                    size="small"
                                    onClick={() => sendWeeklyTasks(grouped_items[key], settings.date, key)}
                                >
                                    <FileDownload fontSize="small" />
                                </IconButton>
                            )}
                        </div>
                        {!has_items_in_week(grouped_items, key, settings.date.month) && (
                            <EmptyList
                                description="This Week is empty!"
                                has_title={false}
                                has_image={false}
                            />
                        )}
                        {grouped_items[key as any].map((item, idx) => {
                            return item.month === settings.date.month ? (
                                <div
                                    key={idx}
                                    className={classnames('flex items-center justify-between px-4 py-2 mb-2 rounded-md', { 'bg-green-100': item.type === 'achievement', 'bg-red-100': item.type === 'challenge' })}
                                >
                                    <div className="mr-4">
                                        <h3 className="text-sm font-medium mb-1">
                                            {item.title}
                                        </h3>
                                        <p className="text-xs mb-0 text-zinc-600">{item.description}</p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className={classnames('rounded-md uppercase text-xs mr-4 py-1 px-1 text-white font-medium', { 'bg-green-600': item.type === 'achievement', 'bg-sky-600': item.type === 'challenge' })}>{item.type}</span>
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
                            ) : null;
                        })}
                    </div>
                );
            })}

            {content.is_delete_visible && (
                <DeleteConfirm
                    item_id={current_item?.id!}
                    collection_name={COLLECTIONS.TASK}
                />
            )}
            {content.is_add_new_form_visible && (
                <AddForm
                    item={current_item!}
                    month={settings.date.month}
                    collection={COLLECTIONS.TASK}
                />
            )}
        </div>
    );
};

export default Tasks;
