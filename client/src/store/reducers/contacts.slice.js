import { createSlice } from '@reduxjs/toolkit';

const Contacts = createSlice({
  name: 'friends',
  initialState: {
    friends: [],
    recent: [],
    groups: [],
    filter: '',
    sidebarFilter: '',
  },
  reducers: {
    setRecentContacts: (state, action) => {
      state.recent = action.payload;
    },
    updateNewRecentContacts: (state, action) => {
      console.log('data', action.payload.data);
      // state.recent = action.payload.data;
    },
    setFriends: (state, action) => {
      state.friends = action.payload;
    },
    changeFilter: (state, action) => {
      state.filter = action.payload;
    },
    changeSidebarFilter: (state, action) => {
      state.sidebarFilter = action.payload;
    },
    addGroup: (state, action) => {
      state.groups = state.groups.push(action.payload);
      const contacts = state.recent;
      contacts.push(action.payload);
      state.recent = contacts;
    },
  },
});
export const { setFriends, changeFilter, addGroup, setRecentContacts, updateNewRecentContacts, changeSidebarFilter } = Contacts.actions;
export default Contacts.reducer;
