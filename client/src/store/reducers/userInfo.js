import * as actionTypes from "../actions/actionTypes";
import updateArray from "react-addons-update";

import { updateObj, likePostReducerHelper } from "../../utils/utilities";
import { friendStatus } from "../../constants/friendStatus";
import { deleteChatSuccess } from "../actions/chat";

const initialState = {
  userInfo: {},
  userPosts: [],
  countPosts: null,
  isFriend: null,
  loading: false,
  loadingPost: false,
};

const getUserInfoStart = (state, action) => {
  return updateObj(state, { loading: true });
};

const getUserInfoSuccess = (state, action) => {
  return updateObj(state, {
    loading: false,
    userInfo: action.userInfo,
    isFriend: action.isFriend,
  });
};

const getUserInfoFailed = (state, action) => {
  return updateObj(state, { loading: false });
};

const addUserOnInfoPage = (state, action) => {
  return updateObj(state, {
    ...state.userInfo,
    isFriend: friendStatus.pending,
  });
};

const getUserPostsStart = (state, action) => {
  return updateObj(state, { loadingPost: true });
};

const getUserPostsSuccess = (state, action) => {
  return updateObj(state, {
    userPosts: state.userPosts.concat(action.userPosts),
    loadingPost: false,
    countPosts: action.count,
  });
};

const getUserPostFailed = (state, action) => {
  return updateObj(state, { loadingPost: false });
};

const cleanUpUserInfo = (state, action) => {
  return initialState;
};

const likeUserPostSucces = (state, action) => {
  const postIndex = state.userPosts.findIndex(
    (post) => post.id === action.likes.postId
  );
  const updatedArr = likePostReducerHelper(postIndex, state.userPosts, action);

  return updateArray(state, {
    userPosts: {
      [postIndex]: {
        Likes: { $set: updatedArr },
      },
    },
  });
};

const deleteFriendship = (state, action) => {
  return updateObj(state, { isFriend: friendStatus.doesntExists });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_USER_INFO_START:
      return getUserInfoStart(state, action);
    case actionTypes.GET_USER_INFO_SUCCESS:
      return getUserInfoSuccess(state, action);
    case actionTypes.GET_USER_INFO_FAILED:
      return getUserInfoFailed(state, action);
    case actionTypes.ADD_USER_ON_INFO_PAGE:
      return addUserOnInfoPage(state, action);
    case actionTypes.GET_USER_POSTS_START:
      return getUserPostsStart(state, action);
    case actionTypes.GET_USER_POSTS_SUCCESS:
      return getUserPostsSuccess(state, action);
    case actionTypes.GET_USER_POSTS_FAILED:
      return getUserPostFailed(state, action);
    case actionTypes.LIKE_USER_POST:
      return likeUserPostSucces(state, action);
    case actionTypes.CLEAN_UP_USER_INFO:
      return cleanUpUserInfo(state, action);
    case actionTypes.DELETE_FRIENDSHIP:
      return deleteFriendship(state, action);
    default:
      return state;
  }
};

export default reducer;
