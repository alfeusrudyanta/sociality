import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Post } from '@/types/feed';

type FeedState = {
  postInteractions: Record<number, Post>;
};

const initialState: FeedState = {
  postInteractions: {},
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setPostInteractions(state, action: PayloadAction<Post[]>) {
      action.payload.forEach((post) => {
        state.postInteractions[post.id] = post;
      });
    },
    updatePostLikes(state, action: PayloadAction<{ postId: number }>) {
      const post = state.postInteractions[action.payload.postId];
      if (post) {
        post.likeCount += 1;
        post.likedByMe = true;
      }
    },
    updatePostUnLikes(state, action: PayloadAction<{ postId: number }>) {
      const post = state.postInteractions[action.payload.postId];
      if (post) {
        post.likeCount -= 1;
        post.likedByMe = false;
      }
    },
    updatePostComments(state, action: PayloadAction<{ postId: number }>) {
      const post = state.postInteractions[action.payload.postId];
      if (post) {
        post.commentCount += 1;
      }
    },
  },
});

export const {
  setPostInteractions,
  updatePostLikes,
  updatePostUnLikes,
  updatePostComments,
} = feedSlice.actions;
export default feedSlice.reducer;
