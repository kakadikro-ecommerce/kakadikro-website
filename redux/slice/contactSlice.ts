import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ContactState } from "@/types/contact";
import { createContact } from "@/redux/api/contactApi";

const initialState: ContactState = {
    loading: false,
    success: false,
    error: null,
};

export const submitContact = createAsyncThunk(
    "contact/submit",
    async (data: {
        name: string;
        email: string;
        phone: string;
        message: string;
    }, { rejectWithValue }) => {
        try {
            return await createContact(data);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

const contactSlice = createSlice({
    name: "contact",
    initialState,
    reducers: {
        resetContactState: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(submitContact.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(submitContact.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(submitContact.rejected, (state, action: any) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
            });
    },
});

export const { resetContactState } = contactSlice.actions;
export default contactSlice.reducer;