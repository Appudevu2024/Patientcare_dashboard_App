import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    staffExist: {}
}

export const staffSlice = createSlice({
    name: 'staff',
    initialState,
    reducers: {
        saveStaff: (state, action) => {
            state.staffExist = action.payload.staffExist;
        },
        clearStaff: (state) => {
            state.staffExist = {}
        }

    },
})

// Action creators are generated for each case reducer function
export const { saveStaff, clearStaff } = staffSlice.actions

export default staffSlice.reducer