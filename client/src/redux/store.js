import { configureStore, combineReducers } from '@reduxjs/toolkit';
import adminReducer from './features/adminSlice';
import doctorReducer from './features/doctorSlice';
import staffReducer from './features/staffSlice';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Persist configurations for each reducer
const adminPersistConfig = {
  key: 'admin',
  storage,
};

const doctorPersistConfig = {
  key: 'doctor',
  storage,
};

const staffPersistConfig = {
  key: 'staff',
  storage,
};

// Apply persistReducer to each
const rootReducer = combineReducers({
  admin: persistReducer(adminPersistConfig, adminReducer),
  doctor: persistReducer(doctorPersistConfig, doctorReducer),
  staff: persistReducer(staffPersistConfig, staffReducer),
});

// Store configuration
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);