import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    doctorExist: {}
}

export const doctorSlice = createSlice({
    name: 'doctor',
    initialState,
    reducers: {
        saveDoctor: (state, action) => {
            state.doctorExist = action.payload
        },
        clearDoctor: (state) => {
            state.doctorExist = {}
        }

    },
})

// Action creators are generated for each case reducer function
export const { saveDoctor, clearDoctor } = doctorSlice.actions

export default doctorSlice.reducer