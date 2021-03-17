import { useEffect } from "react";
import socketClient from "socket.io-client";

import * as action from "../store/actions";

const useSocket = (userId, dispatch) => {
  useEffect(() => {
    const socket = socketClient.connect("http://localhost:8000");

    socket.emit("join", userId);

    socket.on("onlineUsers", (onlineUsers) =>
      dispatch(action.usersOnline(onlineUsers))
    );

    socket.on("offline", (user) => dispatch(action.usersOffline(user)));
  }, [dispatch]);
};

export default useSocket;