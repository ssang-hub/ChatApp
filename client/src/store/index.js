import { configureStore } from '@reduxjs/toolkit';
import authSlice from './reducers/auth.slice';
import settingSlice from './reducers/setting.slice';
import friendRequestSlice from './reducers/friendRequest.slice';
import Contacts from './reducers/contacts.slice';

const store = configureStore({
  reducer: {
    isAuth: authSlice,
    setting: settingSlice,
    Request: friendRequestSlice,
    contacts: Contacts,
  },
});
export default store;
