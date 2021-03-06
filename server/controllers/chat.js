const models = require("../models");
const { User, Chat, ChatUser, Message, LastReadMessage } = models;
const { Op } = require("sequelize");
const { sequelize } = require("../models");
const config = require("../config/app");
const moment = require("moment");

const friendStatus = require("../config/friendRequestStatus");

exports.getUserChatData = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        id: req.user.id,
      },
      attributes: {
        exclude: ["password", "activationToken", "activated", "email"],
      },
      include: [
        {
          model: Chat,
          include: [
            {
              model: User,
              where: {
                [Op.not]: {
                  id: req.user.id,
                },
              },
              attributes: {
                exclude: ["password", "activationToken", "activated", "email"],
              },
            },
            {
              model: Message,
              limit: 15,
              order: [["id", "DESC"]],
            },
            {
              model: LastReadMessage,
            },
          ],
        },
      ],
    });
    if (!user) {
      const error = new Error("Cant fetch user chat data");
      error.statusCode = 404;
      return next(error);
    }
    res.json({
      status: "Ok",
      message: "User chat data was fetched",
      chatsData: user.Chats,
    });
  } catch (error) {
    if (error.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
};

exports.createChat = async (req, res, next) => {
  const { friendId } = req.body;
  const t = await sequelize.transaction();
  try {
    if (req.isFriend === friendStatus.accept) {
      const user = await User.findOne({
        where: {
          id: req.user.id,
        },
        include: {
          model: Chat,
          where: {
            type: "dual",
          },
          include: [
            {
              model: ChatUser,
              where: {
                userId: friendId,
              },
            },
          ],
        },
      });

      //check if dual chat exists between this two users
      if (user && user.Chats.length > 0) {
        const error = new Error("Chat allready exists");
        error.statusCode = 403;
        return next(error);
      }

      const chat = await Chat.create({ type: "dual" }, { transaction: t });
      const chatUser = await ChatUser.bulkCreate(
        [
          {
            chatId: chat.id,
            userId: req.user.id,
          },
          {
            chatId: chat.id,
            userId: friendId,
          },
        ],
        { transaction: t }
      );

      const lastReadMessage = await LastReadMessage.bulkCreate(
        [
          { chatId: chat.id, userId: req.user.id },
          {
            chatId: chat.id,
            userId: friendId,
          },
        ],
        { transaction: t }
      );

      await t.commit();

      const createdChat = await Chat.findOne({
        where: {
          id: chat.id,
        },
        include: [
          {
            model: User,
            where: {
              [Op.not]: {
                id: req.user.id,
              },
            },
            attributes: {
              exclude: ["password", "activationToken", "activated", "email"],
            },
          },
          {
            model: Message,
          },
          {
            model: LastReadMessage,
          },
        ],
      });
      if (!createdChat) {
        const error = new Error("Cant create new chat");
        error.statusCode = 500;
        return next(error);
      }

      res.status(201).json({
        status: "Ok",
        message: "Chat was created",
        chat: createdChat,
      });
    } else {
      const error = new Error("Users are not friends");
      error.statusCode = 403;
      return next(error);
    }
  } catch (error) {
    await t.rollback();
    if (error.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
};

exports.getMessages = async (req, res, next) => {
  const limit = req.query.limit;
  const page = req.query.page || 0;
  const offset = page * limit;

  try {
    const messages = await Message.findAndCountAll({
      where: {
        chatId: req.query.chatId,
      },
      include: {
        model: User,
        attributes: {
          exclude: ["password", "activationToken", "activated", "email"],
        },
      },
      limit: limit,
      offset: offset,
      order: [["id", "DESC"]],
    });

    if (!messages) {
      const error = new Error("Cant fetch messages");
      error.statusCode = 404;
      return next(error);
    }

    res.json({
      status: "Ok",
      message: "Message was fetched",
      messages: messages.rows,
      count: messages.count,
    });
  } catch (error) {
    if (error.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
};

exports.deleteChat = async (req, res, next) => {
  const id = req.params.chatId;
  try {
    await Chat.destroy({
      where: {
        id: id,
      },
    });

    res.json({
      status: "Ok",
      message: "Chat was deleted",
    });
  } catch (error) {
    if (error.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
};

exports.imageUpload = (req, res, next) => {
  if (req.file) {
    return res.json({
      imageUrl: req.file.filename,
      imageUrlForSendEvent:
        config.nodeEnv !== "production"
          ? `${config.appUrl}:${config.appPort}/users/${req.user.id}/chats/${req.body.id}/${req.file.filename}`
          : `${config.appUrl}/users/${req.user.id}/chats/${req.body.id}/${req.file.filename}`,
    });
  } else {
    const error = new Error("No file to upload");
    error.statusCode = 500;
    return next(error);
  }
};

exports.seeMessage = async (req, res, next) => {
  try {
    const updatedLastSeenMessage = await LastReadMessage.update(
      { lastSeenMessage: moment() },
      {
        where: {
          chatId: req.params.chatId,
          userId: req.user.id,
        },
        returning: true,
      }
    );
    if (!updatedLastSeenMessage) {
      const error = new Error("Cant update last seen message on chat");
      error.statusCode = 500;
      return next(error);
    }
    res.json({
      status: "Ok",
      message: "LastSeenMessage was successfully updated",
      lastMessage: updatedLastSeenMessage[1][0],
    });
  } catch (error) {
    if (error.statusCode) {
      error.statusCode = 500;
    }
    return next(error);
  }
};
