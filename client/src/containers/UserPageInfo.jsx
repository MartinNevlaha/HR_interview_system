import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import * as action from "../store/actions";
import UserInfoSidebar from "../components/UserInfoSidebar/UserInfoSidebar";
import FriedList from "../components/FriendList/FriendList";
import UserPost from "../components/UserPosts/UserPosts";
import { likeStatus } from "../config/likeStatus";

const UserPageInfo = () => {
  const dispatch = useDispatch();
  const LIMIT = 15;
  const [page, setPage] = useState(0);
  const { userId } = useParams();
  const userInfo = useSelector((state) => state.userInfo.userInfo);
  const userPosts = useSelector((state) => state.userInfo.userPosts);
  const isFriend = useSelector((state) => state.userInfo.isFriend);
  const loading = useSelector((state) => state.userInfo.loading);
  const loadingPosts = useSelector((state) => state.userInfo.loadingPost);
  const loadingUserFriends = useSelector(
    (state) => state.userInfo.loadingFriends
  );
  const userFriendList = useSelector((state) => state.userInfo.userFriends);

  useEffect(() => {
    dispatch(action.getUserInfo(+userId));
    dispatch(action.getUserFriends(+userId));
    dispatch(action.getUserPosts(+userId, page, LIMIT));

    return () => {
      //clean up
      dispatch(action.cleanUpUserInfo());
    };
  }, [dispatch, userId]);

  const handleAddFriend = () => {
    const data = {
      friendId: +userId,
    };
    dispatch(action.addFriend(data, "onInfoPage"));
  };

  const handleLiker = (status, postUserId, postId) => {
    const data = {
      friendId: postUserId,
      likeOrUnlike:
        status === likeStatus.like ? likeStatus.like : likeStatus.dislike,
    };
    dispatch(action.likeUserPost(postId, data));
  };

  const handleLoadAnotherPosts = () => {
    setPage(page + 1);
    dispatch(action.getUserPosts(+userId, page + 1, LIMIT));
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-around",
        flexWrap: "wrap",
      }}
    >
      <div>
        <UserInfoSidebar
          isFriend={isFriend}
          userProfile={userInfo}
          addFriend={handleAddFriend}
        />
        <FriedList
          loading={loadingUserFriends}
          userFriends={userFriendList}
          isFriend={isFriend}
        />
      </div>
      <UserPost
        isFriend={isFriend}
        posts={userPosts}
        loading={loadingPosts}
        placeOfUsage="userPageInfo"
        liker={handleLiker}
        loadAnotherPosts={handleLoadAnotherPosts}
      />
    </div>
  );
};

export default UserPageInfo;
