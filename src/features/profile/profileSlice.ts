import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ProfileUserData } from '@/types/users';

const initialState: ProfileUserData = {
  id: 0,
  name: '',
  username: '',
  bio: '',
  avatarUrl: null,
  email: '',
  phone: '',
  counts: {
    post: 0,
    followers: 0,
    following: 0,
    likes: 0,
  },
  isFollowing: false,
  isMe: false,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<ProfileUserData>) {
      return action.payload;
    },
    handleAddFollowing(state) {
      state.counts.following += 1;
    },
    handleDeleteFollowing(state) {
      state.counts.following -= 1;
    },
  },
});

export const { setProfile, handleAddFollowing, handleDeleteFollowing } =
  profileSlice.actions;
export default profileSlice.reducer;
