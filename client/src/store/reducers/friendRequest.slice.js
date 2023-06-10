import { createSlice } from '@reduxjs/toolkit';

const FriendRequestSlice = createSlice({
  name: 'friendRequest',
  initialState: {
    numberRequest: 0,
  },
  reducers: {
    receiverRequest: (state, action) => {
      state.numberRequest = state.numberRequest + 1;
    },
    acceptRequest: (state, action) => {},
    refuseRequest: (state, action) => {},
    getNumberRequest: (state, action) => {},
  },
});
export const { receiverRequest, acceptRequest, refuseRequest, getNumberRequest } = FriendRequestSlice.actions;
export default FriendRequestSlice.reducer;
