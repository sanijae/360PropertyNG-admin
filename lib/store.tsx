import { configureStore } from '@reduxjs/toolkit'
import userReducer from './features/users/userSlices';
import adminReducer from './features/admins/adminsSlices';
import propertyiesReducer from './features/properties/propertiesSlices';
import notificationReducer from './features/notifications/notificationSlices'
import contactReducer from './features/contacts/contactSlice'
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
};

export const makeStore = () => {
  return configureStore({
    reducer: {
      users: userReducer,
      admins: adminReducer,
      contacts: contactReducer,
      properties: propertyiesReducer,
      notifications: notificationReducer,
    }
  })
}
export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

