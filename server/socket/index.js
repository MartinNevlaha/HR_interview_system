const config = require("../config/app");
const logger = require("../config/winston");
const timestamp = require("time-stamp");

const { createMessage } = require("./dbQueries");
const IoSocket = require("./middleware/IoSocket");
const Users = require("./users/users");

let users = new Users();

const SocketServer = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    },
  });
  const IoSocketInstance = new IoSocket(io, config.jwtSecret);
  // auth socket connection by token when its failed user unble connect to chat
  IoSocketInstance.authenticate();

  io.on("connection", (socket) => {
    socket.on("join", (user) => {
      let onlineUsers = [];

      if (users.getUser(user.id)) {
        return;
      } else {
        users.addUser(user.id, socket.id);
      }

      onlineUsers = users.getOnlineUsers();

      //send array of online users to every active socket
      io.emit("onlineUsers", onlineUsers);

      /*
      const sockets = users.getOnlineSockets();
      sockets.forEach((socket) => {
        try {
          io.to(socket).emit("onlineUsers", onlineUsers);
        } catch (error) {
          logger.error({
            time: timestamp("YYYY/MM/DD/HH:mm:ss"),
            level: "error",
            message: error,
          });
        }
      });
      */
    });

    socket.on("sendMessage", async (msg) => {
      const recipient = users.getUser(msg.toUserId);
      try {
        await createMessage(msg);
        if (recipient) {
          msg.User = msg.fromUser;
          msg.fromUserId = msg.fromUser.id;
          io.to(recipient.socketId).emit("receiveMessage", msg);
        }
      } catch (error) {
        logger.error({
          time: timestamp("YYYY/MM/DD/HH:mm:ss"),
          level: "error",
          message: error,
        });
      }
    });

    socket.on("disconnect", () => {
      const user = users.removeUser(null, socket.id);
      //send user id when user is going to offline to every active socket
      io.emit("offline", user.userId);
      /*
      sockets.forEach((socket) => {
        try {
          io.to(socket).emit("offline", user.userId);
        } catch (error) {
          console.log(error);
          logger.error({
            time: timestamp("YYYY/MM/DD/HH:mm:ss"),
            level: "error",
            message: error,
          });
        }
      });
      */
    });
  });
};

module.exports = SocketServer;
