import * as actionTypes from "../actions/actionTypes";
import { updateObj, likePostReducerHelper } from "../../utils/utilities";
import updateArray from "react-addons-update";

const initialState = {
  posts: [],
  count: 0,
  loading: false,
  loadingCreatePost: false,
  uploadStatus: 0,
};

const createPostStart = (state, action) => {
  return updateObj(state, {
    loadingCreatePost: true,
  });
};

const createPostSuccess = (state, action) => {
  return updateObj(state, {
    loadingCreatePost: false,
    posts: [action.post, ...state.posts],
  });
};

const createPostFailed = (state, action) => {
  return updateObj(state, { loadingCreatePost: false });
};

const fetchFriendsPostStart = (state, action) => {
  return updateObj(state, { loading: true });
};

const fetchFriendsPostSuccess = (state, action) => {
  const concatedPosts = state.posts.concat(action.posts);
  return updateObj(state, {
    loading: false,
    count: action.count,
    posts: concatedPosts,
  });
};

const fetchFriendsPostFailed = (state, action) => {
  return updateObj(state, {
    loading: false,
  });
};

const clearPosts = (state, action) => {
  return updateObj(state, { posts: [] });
};

const likePostSuccess = (state, action) => {
  const postIndex = state.posts.findIndex(
    (post) => post.id === action.likes.postId
  );
  const updatedArr = likePostReducerHelper(postIndex, state.posts, action);

  return updateArray(state, {
    posts: {
      [postIndex]: {
        Likes: { $set: updatedArr },
      },
    },
  });
};

const deletePostStart = (state, action) => {
  return updateObj(state, { loading: true });
};

const deletePostSuccess = (state, action) => {
  return updateObj(state, {
    posts: state.posts.filter((post) => post.id !== action.postId),
    loading: false,
  });
};

const deletePostFailed = (state, action) => {
  return updateObj(state, {
    loading: false,
  });
};

const setEditMode = (state, action) => {
  const index = state.posts.findIndex((post) => post.id === action.postId);
  return updateArray(state, {
    posts: {
      [index]: {
        editMode: { $set: true },
      },
    },
  });
};

const deletePostImage = (state, action) => {
  const index = state.posts.findIndex((post) => post.id === action.postId);
  return updateArray(state, {
    posts: {
      [index]: {
        image: { $set: null },
      },
    },
  });
};

const updatePostStart = (state, action) => {
  return updateObj(state, { loading: true });
};

const updatePostSuccess = (state, action) => {
  const index = state.posts.findIndex(
    (post) => post.id === action.updatedPost.id
  );
  const updatedPost = {
    ...action.updatedPost,
    User: { ...state.posts[index].User },
    Likes: [...state.posts[index].Likes],
    editMode: false,
  };
  return updateArray(state, {
    loading: { $set: false },
    posts: {
      [index]: { $set: updatedPost },
    },
  });
};

const updatePostFailed = (state, action) => {
  return updateObj(state, { loading: false });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CREATE_POST_START:
      return createPostStart(state, action);
    case actionTypes.CREATE_POST_SUCCESS:
      return createPostSuccess(state, action);
    case actionTypes.CREATE_POST_FAILED:
      return createPostFailed(state, action);
    case actionTypes.FETCH_FRIENDS_POST_START:
      return fetchFriendsPostStart(state, action);
    case actionTypes.FETCH_FRIENDS_POST_SUCCESS:
      return fetchFriendsPostSuccess(state, action);
    case actionTypes.FETCH_FRIENDS_POST_FAILED:
      return fetchFriendsPostFailed(state, action);
    case actionTypes.CLEAR_POSTS:
      return clearPosts(state, action);
    case actionTypes.LIKER_POST:
      return likePostSuccess(state, action);
    case actionTypes.DELETE_POST_START:
      return deletePostStart(state, action);
    case actionTypes.DELETE_POST_SUCCESS:
      return deletePostSuccess(state, action);
    case actionTypes.DELETE_POST_FAILED:
      return deletePostFailed(state, action);
    case actionTypes.SET_EDIT_MODE:
      return setEditMode(state, action);
    case actionTypes.DELETE_POST_IMAGE:
      return deletePostImage(state, action);
    case actionTypes.UPDATE_POST_START:
      return updatePostStart(state, action);
    case actionTypes.UPDATE_POST_SUCCESS:
      return updatePostSuccess(state, action);
    case actionTypes.UPDATE_POST_FAILED:
      return updatePostFailed(state, action);
    default:
      return state;
  }
};

export default reducer;
