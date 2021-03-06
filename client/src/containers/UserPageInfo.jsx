import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import * as action from "../store/actions";
import UserInfoSidebar from "../components/UserInfoSidebar/UserInfoSidebar";
import FriedList from "../components/FriendList/FriendList";
import UserPosts from "../components/UserPosts/UserPosts";
import { likeStatus } from "../constants/likeStatus";

const UserPageInfo = () => {
  const dispatch = useDispatch();
  const LIMIT = 15;
  const [page, setPage] = useState(0);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const { userId } = useParams();
  const userInfo = useSelector((state) => state.userInfo.userInfo);
  const userPosts = useSelector((state) => state.userInfo.userPosts);
  const isFriend = useSelector((state) => state.userInfo.isFriend);
  const loadingPosts = useSelector((state) => state.userInfo.loadingPost);
  const userFriendList = useSelector((state) => state.friends.userFriends);
  const loadingUserFriends = useSelector((state) => state.friends.loading);
  const countUserPosts = useSelector((state) => state.userInfo.countPosts);

  useEffect(() => {
    dispatch(action.getUserInfo(+userId));
    dispatch(action.getUserFriends(+userId));
    dispatch(action.getUserPosts(+userId, 0, LIMIT));

    return () => {
      //clean up
      dispatch(action.cleanUpUserInfo());
    };
  }, [dispatch, userId, LIMIT]);

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
    if (userPosts.length >= countUserPosts) {
      setHasMorePosts(false);
      return;
    }
    dispatch(action.getUserPosts(+userId, page + 1, LIMIT));
  };

  const handleDeleteFriendShip = (friendId) => {
    dispatch(action.deleteFriendship(friendId));
  }

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
      <div style={{ width: "25%", minWidth: "400px", margin: "1rem" }}>
        <UserInfoSidebar
          isFriend={isFriend}
          userProfile={userInfo}
          addFriend={handleAddFriend}
          onDeleteFriendship={handleDeleteFriendShip}
        />
        <FriedList
          loading={loadingUserFriends}
          userFriends={userFriendList}
          isFriend={isFriend}
        />
      </div>
      <UserPosts
        isFriend={isFriend}
        posts={userPosts}
        loading={loadingPosts}
        hasMorePosts={hasMorePosts}
        placeOfUsage="userPageInfo"
        liker={handleLiker}
        loadAnotherPosts={handleLoadAnotherPosts}
        userId={+userId}
      />
    </div>
  );
};

export default UserPageInfo;
