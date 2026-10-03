import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ParsedApiError, parseApiError } from "@/lib/apiError";
import { ContactPayload, ContactState } from "@/types/contact";
import { createContact } from "@/redux/api/contactApi";

const initialState: ContactState = {
    loading: false,
    success: false,
    error: null,
};

export const submitContact = createAsyncThunk<
    unknown,
    ContactPayload,
    { rejectValue: ParsedApiError }
>(
    "contact/submit",
    async (data, { rejectWithValue }) => {
        try {
            return await createContact(data);
        } catch (error: unknown) {
            return rejectWithValue(
                parseApiError(error, "Failed to send message. Please try again."),
            );
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
            .addCase(submitContact.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error =
                    action.payload?.message ||
                    "Failed to send message. Please try again.";
            });
    },
});

export const { resetContactState } = contactSlice.actions;
export default contactSlice.reducer;