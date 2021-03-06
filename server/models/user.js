"use strict";
const { hashPwd } = require("../utils/utilities");
const config = require("../config/app");

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Friendship, { foreignKey: "user_1" });
      this.hasMany(models.Friendship, { foreignKey: "user_2" });
      this.hasMany(models.Post, { foreignKey: "userId" });
      this.hasMany(models.Likes, { foreignKey: "userId" });
      this.belongsToMany(models.Chat, {
        through: "ChatUser",
        foreignKey: "userId",
      });
      this.hasMany(models.ChatUser, { foreignKey: "userId" });
      this.hasMany(models.Message, { foreignKey: "fromUserId" });
      this.hasMany(models.LastReadMessage, { foreignKey: "chatId" });
    }
  }
  User.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      fullName: {
        type: DataTypes.VIRTUAL,
        get() {
          return `${this.firstName} ${this.lastName}`;
        },
        set() {
          return new Error("Dont try to set fullName");
        },
      },
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      role: DataTypes.STRING,
      avatar: {
        type: DataTypes.STRING,
        get() {
          const avatar = this.getDataValue("avatar");
          if (avatar) {
            const id = this.getDataValue("id");
            if (config.nodeEnv === "production") {
              return `${config.appUrl}/users/${id}/${avatar}`;
            } else {
              return `${config.appUrl}:${config.appPort}/users/${id}/${avatar}`;
            }
          } else {
            return null;
          }
        },
      },
      friendsCount: DataTypes.INTEGER,
      activated: DataTypes.BOOLEAN,
      activationToken: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
      hooks: {
        beforeCreate: (user) => hashPwd(user),
        beforeUpdate: (user) => hashPwd(user),
      },
    }
  );
  return User;
};
