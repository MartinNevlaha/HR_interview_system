"use strict";
const config = require("../config/app");

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Chat, { foreignKey: "chatId" });
      this.belongsTo(models.User, { foreignKey: "fromUserId" });
    }
  }
  Message.init(
    {
      type: DataTypes.STRING,
      chatId: DataTypes.INTEGER,
      fromUserId: DataTypes.INTEGER,
      message: {
        type: DataTypes.TEXT,
        get() {
          const type = this.getDataValue("type");
          const chatId = this.getDataValue("chatId");
          const userId = this.getDataValue("fromUserId");
          const content = this.getDataValue("message");
          if (type === "text") {
            return content;
          } else {
            if (config.nodeEnv === "production") {
              return `${config.appUrl}/users/${userId}/chats/${chatId}/${content}`;
            } else {
              return `${config.appUrl}:${config.appPort}/users/${userId}/chats/${chatId}/${content}`;
            }
          }
        },
      },
    },
    {
      sequelize,
      modelName: "Message",
    }
  );
  return Message;
};
