import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    doctor: {}
}

export const doctorSlice = createSlice({
    name: 'doctor',
    initialState,
    reducers: {
        saveDoctor: (state, action) => {
            state.doctor = action.payload
        },
        clearDoctor: (state) => {
            state.doctor = {}
        }

    },
})

// Action creators are generated for each case reducer function
export const { saveDoctor, clearDoctor } = doctorSlice.actions

export default doctorSlice.reducer