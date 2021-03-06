import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import {useSelector} from "react-redux";

import classes from "./Topbar.module.scss";
import BackDropMenu from "./BackDropMenu/BackdropMenu";
import SearchUsers from "./SearchUsers/SearchUsers";

const Topbar = (props) => {
  const { t } = useTranslation();
  const fullName = useSelector(state => state.userProfile.user.fullName);
  const avatar = useSelector(state => state.userProfile.user.avatar);
  const friendRequests = useSelector(state => state.friendRequest.requests);

  return (
    <div className={classes.topbar}>
      <div className={classes.topbar_left}>
        <div className={classes.topbar_left_iconWrapper} onClick={props.menuClick}>
          <FontAwesomeIcon icon={faBars} size="2x" color="white" />
        </div>
        <h1 className={classes.topbar_left_appName}>
          {t("topNavbar.appName")}
        </h1>
        <SearchUsers />
      </div>
      <div className={classes.topbar_right}>
        <p className={classes.topbar_right_name}>{fullName}</p>
        <BackDropMenu avatar={avatar} requests={friendRequests}/>
      </div>
    </div>
  );
};

export default Topbar;
