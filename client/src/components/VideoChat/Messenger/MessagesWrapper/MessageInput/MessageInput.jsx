import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSmile,
  faUpload,
  faTimes,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import { Picker } from "emoji-mart";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";

import * as action from "../../../../../store/actions";
import classes from "./MessageInput.module.scss";
import "emoji-mart/css/emoji-mart.css";
import useDimensions from "../../../../../hooks/useDimensions";

const MessageInput = ({ user, toUserId, chatId }) => {
  const fileUpload = useRef(null);
  const msgInput = useRef(null);
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [image, setImage] = useState("");
  const socket = useSelector((state) => state.chat.socket);
  const imageUploadProgress = useSelector(
    (state) => state.chat.imageUploadProgress
  );
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { width } = useDimensions();

  const handleMessageInput = (e) => {
    const value = e.target.value;
    setMessage(value);

    // user is typing notification
    const receiver = {
      chatId: chatId,
      fromUser: user.id,
      toUserId: toUserId,
    };

    if (value.length >= 1) {
      receiver.typing = true;
      socket.emit("typing", receiver);
    } else if (value.length === 0) {
      receiver.typing = false;
      socket.emit("typing", receiver);
    }
  };
  const handleKeyDown = (e, imageUpload) => {
    if (e.key === "Enter") sendMessage(imageUpload);
  };

  const sendMessage = (imageUpload, imageUrl, imageForSendEvent) => {
    if (message.length < 1 && !imageUpload) return;

    const msg = {
      type: imageUpload ? "image" : "text",
      fromUser: user,
      toUserId: toUserId,
      chatId: chatId,
      message: imageUpload ? imageUrl : message,
    };
    setMessage("");
    setImage("");
    dispatch(action.userTyping(false));
    // send message
    socket.emit("sendMessage", msg);
    const messageToRedux = {
      id: 0,
      type: msg.type,
      User: msg.fromUser,
      chatId: msg.chatId,
      fromUserId: msg.fromUser.id,
      message: msg.type === "text" ? msg.message : imageForSendEvent,
    };
    dispatch(action.sendMessage(messageToRedux));
  };

  const handleImageUpload = () => {
    const formData = new FormData();
    formData.append("id", chatId);
    formData.append("image", image);

    dispatch(action.imageChatUpload(formData, sendMessage, chatId));
  };

  const selectEmoji = (emoji) => {
    const startPosition = msgInput.current.selectionStart;
    const endPosition = msgInput.current.selectionEnd;
    const emojiLength = emoji.native.length;
    const value = msgInput.current.value;

    setMessage(
      value.substring(0, startPosition) +
        emoji.native +
        value.substring(endPosition, value.length)
    );

    msgInput.current.focus();
    msgInput.current.selectionEnd = endPosition + emojiLength;
    setShowEmojiPicker(!showEmojiPicker);
  };

  MessageInput.propTypes = {
    user: PropTypes.object,
    toUserId: PropTypes.number,
    chatId: PropTypes.number,
    lastId: PropTypes.number,
    messages: PropTypes.array,
  };

  let emojiPosition = "-170px";
  if (width <= 500) emojiPosition = "-100px";
  return (
    <div className={classes.input}>
      <div className={classes.input_imageUpload}>
        {!image.name && (
          <div className={classes.input_imageUpload_image}>
            <label htmlFor="image">
              <FontAwesomeIcon
                icon={faImage}
                className={classes.input_imageUpload_image_icon}
                onClick={() => fileUpload.current.click()}
              />
            </label>
            <input
              ref={fileUpload}
              accept="image/x-png,image/gif,image/jpeg,image/jpg,image/png"
              type="file"
              name="image"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>
        )}
        <div className={classes.input_imageUpload_details}>
          {image.name && (
            <React.Fragment>
              {width > 500 && <p>{image.name}</p>}
              {imageUploadProgress > 0 && <p>{imageUploadProgress} %</p>}
              {imageUploadProgress !== 100 && (
                <React.Fragment>
                  <FontAwesomeIcon
                    icon={faUpload}
                    className={classes.input_imageUpload_image_icon}
                    onClick={() => handleImageUpload()}
                  />
                  <FontAwesomeIcon
                    icon={faTimes}
                    className={classes.input_imageUpload_image_icon}
                    onClick={() => setImage("")}
                  />
                </React.Fragment>
              )}
            </React.Fragment>
          )}
        </div>
      </div>
      <div className={classes.input_messageInput}>
        <input
          ref={msgInput}
          type="text"
          placeholder="Message..."
          value={message}
          onChange={(e) => handleMessageInput(e)}
          onKeyDown={(e) => handleKeyDown(e, false)}
        />
        <FontAwesomeIcon
          icon={faSmile}
          className={classes.input_messageInput_icon}
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        />
        {showEmojiPicker && (
          <Picker
            title="Pick your emoji"
            emoji="point_up"
            style={{
              position: "absolute",
              bottom: "30px",
              left: emojiPosition,
            }}
            onSelect={selectEmoji}
          />
        )}
      </div>
    </div>
  );
};

export default MessageInput;
