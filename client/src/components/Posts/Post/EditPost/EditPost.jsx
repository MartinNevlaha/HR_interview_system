import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisV,
  faEdit,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";

import classes from "./EditPost.module.scss";

export const EditPost = ({ deletePost, postId, setEditMode }) => {
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    document.addEventListener("mousedown", handleClose);

    return () => {
      document.removeEventListener("mousedown", handleClose);
    };
  }, [menuRef]);

  const handleClose = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setOpenMenu(false);
    }
  };

  const handleOpen = () => {
    setOpenMenu(true);
  };

  return (
    <div className={classes.edit_post}>
      <div className={classes.edit_post_container} onClick={handleOpen}>
        <FontAwesomeIcon
          icon={faEllipsisV}
          className={classes.edit_post_container_icon}
        />
      </div>
      <div
        ref={menuRef}
        className={
          openMenu
            ? [classes.edit_post_menu, classes.open].join(" ")
            : classes.edit_post_menu
        }
      >
        <ul className={classes.edit_post_menu_items}>
          <li>
            <div
              className={classes.edit_post_menu_items_item}
              onClick={() => {
                setEditMode(postId);
                setOpenMenu(false);
              }}
            >
              <FontAwesomeIcon icon={faEdit} size="1x" />
              <p>Edit</p>
            </div>
          </li>
          <li>
            <div
              className={classes.edit_post_menu_items_item}
              onClick={() => {
                deletePost(postId);
                setOpenMenu(false);
              }}
            >
              <FontAwesomeIcon icon={faTrashAlt} size="1x" />
              <p>Delete</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default EditPost;