import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import { Button, TextField, FormControl, Select, MenuItem, IconButton, OutlinedInput, InputAdornment } from '@mui/material';
import { Close, Add, DeleteOutline } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { COLLECTIONS } from '@/constants';
import { createRecord, updateRecord } from '@/utils/db-operations';
import { setAddNewFormVisible, setRefresh } from '@/stores/content';
import { capitalize } from '@/utils';
import type { FieldProps, FormikValues } from 'formik';

type TProps = {
    item?: TFormValues;
    month?: string;
    collection: string;
};

export type TFormValues = {
    id?: string;
    title?: string;
    description?: string;
    type?: string;
    week?: string;
};

const AddForm = ({ item, month, collection }: TProps) => {
    const dispatch = useDispatch();
    const { settings } = useSelector((store: any) => store);
    const [is_form_loading, setFormLoading] = React.useState(false);
    const [should_show_alert, setShowAlert] = React.useState(false);

    const normalized_values = (values: any) => {
        return collection === COLLECTIONS.STARS ? {
            id          : values.id,
            name        : values.name,
            slack       : values.slack,
            image       : values.image,
            year        : values.year,
            month       : values.month,
            achievements: typeof values.achievements === 'object' ? values.achievements : values.achievements.split(' | '),
        } : values;
    };
    
    const road_initial_values = {title: ''};
    const task_initial_values = {title: '', description: '', type: '', week: '', year: settings.date.year, month: settings.date.month};
    const star_initial_values = {name: '', image: '', year: settings.date.year, month: settings.date.month, achievements: [''], slack: ''};
    const initFormValues = () => {
        switch (collection) {
        case COLLECTIONS.STARS:
            return star_initial_values;
        case COLLECTIONS.ROADMAP:
            return road_initial_values;
        case COLLECTIONS.TASK:
            return task_initial_values;
        default:
            return road_initial_values;
        }
    };
    const [initial_values, setInitialValues] = React.useState<any>(initFormValues());

    useEffect(() => {
        setInitialValues(initFormValues());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [collection]);

    const addNewAchievement = () => {
        setInitialValues((prev_values: any) => { return {...prev_values, achievements: prev_values.achievements.concat([''])}; });
    };

    const removeAchievement = (index: string, values: any) => {
        if (values.achievements.length === 1) {
            setInitialValues((prev_values: any) => { return {...prev_values, achievements: [''] }; });
        } else {
            setInitialValues((prev_values: any) => { return {...prev_values, achievements: values.achievements.splice(index, 1)}; });
        }
    };

    const onSubmit = async (values: any, actions: any) => {
        setFormLoading(true);
        const form_body = collection === COLLECTIONS.STARS ? {
            name        : values.name,
            slack       : values.slack,
            image       : values.image,
            year        : values.year,
            month       : values.month,
            achievements: values.achievements.join(' | '),
        } : values;
        if (item?.id) {
            updateRecord(collection, item.id, form_body).then(() => {
                dispatch(setRefresh(true));
                dispatch(setAddNewFormVisible(false));
            }).catch().finally(() => {
                setFormLoading(false);
            });
        } else {
            createRecord(collection, form_body).then(() => {
                setShowAlert(true);
                setTimeout(() => {
                    setShowAlert(false);
                }, 3000);
                actions.resetForm(initFormValues());
            }).then(() => {
                dispatch(setRefresh(true));
                if (active_submit_button === 'save_close') {
                    dispatch(setAddNewFormVisible(false));
                }
            }).catch().finally(() => {
                setFormLoading(false);
            });
        }
    };

    let active_submit_button: string | null = null;
    const el = document.getElementById('modal-portal');

    if (el) {
        return ReactDOM.createPortal(
            <div className="main-modal">
                <div className="bg-white rounded-md w-96 p-0">
                    <div className="p-4 bg-gray-200 flex items-center justify-between rounded-t-md">
                        <h3 className="text-lg">Add New Item</h3>
                        <IconButton
                            aria-label="close"
                            size="small"
                            onClick={() => dispatch(setAddNewFormVisible(false))}
                        >
                            <Close fontSize="small" />
                        </IconButton>
                    </div>

                    <Formik
                        initialValues={item?.id ? normalized_values(item) : initial_values}
                        onSubmit={(values, actions) => { onSubmit(values, actions); }}
                    >
                        {({ values }) => (
                            <Form>
                                <div className="p-4">
                                    {(collection === COLLECTIONS.ROADMAP || collection === COLLECTIONS.TASK) && (
                                        <Field name="title">
                                            {({ field }: FieldProps<FormikValues>) => (
                                                <React.Fragment>
                                                    <span className="text-sm mb-2 block text-black">Title</span>
                                                    <TextField
                                                        {...field}
                                                        type="text"
                                                        className="w-full mb-3"
                                                    />
                                                </React.Fragment>
                                            )}
                                        </Field>
                                    )}
                                    {collection === COLLECTIONS.TASK && (
                                        <React.Fragment>
                                            <Field name="description">
                                                {({ field }: FieldProps<FormikValues>) => (
                                                    <React.Fragment>
                                                        <span className="text-sm mb-2 block text-black">Description</span>
                                                        <TextField
                                                            {...field}
                                                            type="text"
                                                            className="w-full mb-3"
                                                        />
                                                    </React.Fragment>
                                                )}
                                            </Field>
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1 mr-2">
                                                    <Field name="year">
                                                        {({ field }: FieldProps<FormikValues>) => (
                                                            <React.Fragment>
                                                                <span className="text-sm mb-2 block text-black">Year</span>
                                                                <TextField
                                                                    {...field}
                                                                    type="text"
                                                                    className="w-full mb-3"
                                                                />
                                                            </React.Fragment>
                                                        )}
                                                    </Field>
                                                </div>
                                                <div className="flex-1">
                                                    <Field name="month">
                                                        {({ field }: FieldProps<FormikValues>) => (
                                                            <FormControl fullWidth>
                                                                <span className="text-sm mb-2 block text-black">Month</span>
                                                                <Select
                                                                    {...field}
                                                                    className="w-full mb-3"
                                                                >
                                                                    {settings.list.months.map((month: string, idx: number) => {
                                                                        return (
                                                                            <MenuItem
                                                                                key={idx}
                                                                                value={month}
                                                                            >
                                                                                {capitalize(month)}
                                                                            </MenuItem>
                                                                        );
                                                                    })}
                                                                </Select>
                                                            </FormControl>
                                                        )}
                                                    </Field>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1 mr-2">
                                                    <Field name="type">
                                                        {({ field }: FieldProps<FormikValues>) => (
                                                            <FormControl fullWidth>
                                                                <span className="text-sm mb-2 block text-black">Type</span>
                                                                <Select
                                                                    {...field}
                                                                    className="w-full mb-3"
                                                                >
                                                                    <MenuItem value="achievement">Achievement</MenuItem>
                                                                    <MenuItem value="challenge">Challenge</MenuItem>
                                                                </Select>
                                                            </FormControl>
                                                        )}
                                                    </Field>
                                                </div>
                                                <div className="flex-1">
                                                    <Field name="week">
                                                        {({ field }: FieldProps<FormikValues>) => (
                                                            <FormControl fullWidth>
                                                                <span className="text-sm mb-2 block text-black">Week</span>
                                                                <Select
                                                                    {...field}
                                                                    className="w-full mb-3"
                                                                >
                                                                    <MenuItem value="one">One</MenuItem>
                                                                    <MenuItem value="two">Two</MenuItem>
                                                                    <MenuItem value="three">Three</MenuItem>
                                                                    <MenuItem value="four">Four</MenuItem>
                                                                    <MenuItem value="five">Five</MenuItem>
                                                                    <MenuItem value="six">Six</MenuItem>
                                                                </Select>
                                                            </FormControl>
                                                        )}
                                                    </Field>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    )}
                                    {collection === COLLECTIONS.STARS && (
                                        <React.Fragment>
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1 mr-2">
                                                    <Field name="name">
                                                        {({ field }: FieldProps<FormikValues>) => (
                                                            <React.Fragment>
                                                                <span className="text-sm mb-2 block text-black">Name</span>
                                                                <TextField
                                                                    {...field}
                                                                    type="text"
                                                                    className="w-full mb-3"
                                                                />
                                                            </React.Fragment>
                                                        )}
                                                    </Field>
                                                </div>
                                                <div className="flex-1">
                                                    <Field name="slack">
                                                        {({ field }: FieldProps<FormikValues>) => (
                                                            <React.Fragment>
                                                                <span className="text-sm mb-2 block text-black">Slack Username</span>
                                                                <TextField
                                                                    {...field}
                                                                    type="text"
                                                                    className="w-full mb-3"
                                                                    InputProps={{
                                                                        startAdornment: <InputAdornment position="start">@</InputAdornment>,
                                                                    }}
                                                                />
                                                            </React.Fragment>
                                                        )}
                                                    </Field>
                                                </div>
                                            </div>
                                            <Field name="image">
                                                {({ field }: FieldProps<FormikValues>) => (
                                                    <React.Fragment>
                                                        <span className="text-sm mb-2 block text-black">Avatar URL</span>
                                                        <TextField
                                                            {...field}
                                                            type="text"
                                                            className="w-full mb-3"
                                                        />
                                                    </React.Fragment>
                                                )}
                                            </Field>
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1 mr-2">
                                                    <Field name="year">
                                                        {({ field }: FieldProps<FormikValues>) => (
                                                            <React.Fragment>
                                                                <span className="text-sm mb-2 block text-black">Year</span>
                                                                <TextField
                                                                    {...field}
                                                                    type="text"
                                                                    className="w-full mb-3"
                                                                />
                                                            </React.Fragment>
                                                        )}
                                                    </Field>
                                                </div>
                                                <div className="flex-1">
                                                    <Field name="month">
                                                        {({ field }: FieldProps<FormikValues>) => (
                                                            <FormControl fullWidth>
                                                                <span className="text-sm mb-2 block text-black">Month</span>
                                                                <Select
                                                                    {...field}
                                                                    className="w-full mb-3"
                                                                >
                                                                    {settings.list.months.map((month: string, idx: number) => {
                                                                        return (
                                                                            <MenuItem
                                                                                key={idx}
                                                                                value={month}
                                                                            >
                                                                                {capitalize(month)}
                                                                            </MenuItem>
                                                                        );
                                                                    })}
                                                                </Select>
                                                            </FormControl>
                                                        )}
                                                    </Field>
                                                </div>
                                            </div>
                                            <div>
                                                <div>
                                                    <span className="text-sm mb-2 block text-black">Achievements</span>
                                                    {Object.keys(values.achievements).map((key) => {
                                                        return (
                                                            <Field
                                                                key={key}
                                                                name={`achievements[${key}]`}
                                                            >
                                                                {({ field }: FieldProps<FormikValues>) => (
                                                                    <OutlinedInput
                                                                        {...field}
                                                                        className="w-full mb-2"
                                                                        endAdornment={
                                                                            <InputAdornment position="end">
                                                                                {values.achievements.length === (Number(key) + 1) && (
                                                                                    <IconButton
                                                                                        aria-label="add"
                                                                                        color="primary"
                                                                                        size="small"
                                                                                        onClick={() => {
                                                                                            values.achievements.push('');
                                                                                            addNewAchievement();
                                                                                        }}
                                                                                    >
                                                                                        <Add fontSize="small" />
                                                                                    </IconButton>
                                                                                )}
                                                                                <IconButton
                                                                                    aria-label="delete"
                                                                                    color="primary"
                                                                                    size="small"
                                                                                    onClick={() => removeAchievement(key, values)}
                                                                                >
                                                                                    <DeleteOutline fontSize="small" />
                                                                                </IconButton>
                                                                            </InputAdornment>
                                                                        }
                                                                    />
                                                                )}
                                                            </Field>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    )}

                                    {should_show_alert && (
                                        <div className="bg-green-600 text-white text-sm mt-4 py-2 px-4 rounded-md">
                                            <p>
                                                Item Added Successfully!
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="border-t-2 p-4 flex items-center justify-between">
                                    <Button disableElevation
                                        color="error"
                                        disabled={is_form_loading}
                                        onClick={() => dispatch(setAddNewFormVisible(false))}
                                    >
                                        Cancel
                                    </Button>

                                    <div className="flex items-center justify-end">
                                        <LoadingButton
                                            disableElevation
                                            variant={item ? 'contained' : 'outlined'}
                                            disabled={is_form_loading || (!values.title && !values.name)}
                                            loading={is_form_loading}
                                            type="submit"
                                            onClick={() => { active_submit_button = 'save_close'; }}
                                        >
                                            Save
                                        </LoadingButton>

                                        {!item?.id && (
                                            <LoadingButton
                                                disableElevation
                                                variant="contained"
                                                disabled={is_form_loading || (!values.title && !values.name)}
                                                loading={is_form_loading}
                                                type="submit"
                                                onClick={() => { active_submit_button = 'save'; }}
                                                className="ml-2"
                                            >
                                                Save and Continue
                                            </LoadingButton>
                                        )}
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>,
            el
        );
    }
    return null;
};

export default AddForm;
