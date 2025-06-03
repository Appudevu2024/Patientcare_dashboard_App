import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    staff: {}
}

export const staffSlice = createSlice({
    name: 'staff',
    initialState,
    reducers: {
        saveStaff: (state, action) => {
            state.staff = action.payload
        },
        clearStaff: (state) => {
            state.staff = {}
        }

    },
})

// Action creators are generated for each case reducer function
export const { saveStaff, clearStaff } = staffSlice.actions

export default staffSlice.reducer