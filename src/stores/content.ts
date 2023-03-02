import { createSlice } from '@reduxjs/toolkit';

const controlScrollbar = (status: boolean) => {
    if (status) document.body.classList.add('main-hide-scrollbar');
    if (!status) document.body.classList.remove('main-hide-scrollbar');
};

export const contentSlice = createSlice({
    name        : 'content',
    initialState: {
        should_refresh         : false,
        is_delete_visible      : false,
        is_add_new_form_visible: false,
    },
    reducers: {
        setRefresh: (state, action) => {
            state.should_refresh = action.payload;
        },
        setDeleteVisible: (state, action) => {
            controlScrollbar(action.payload);
            state.is_delete_visible = action.payload;
        },
        setAddNewFormVisible: (state, action) => {
            controlScrollbar(action.payload);
            state.is_add_new_form_visible = action.payload;
        },
    }
});

export const { setRefresh, setDeleteVisible, setAddNewFormVisible } = contentSlice.actions;

export default contentSlice.reducer;
