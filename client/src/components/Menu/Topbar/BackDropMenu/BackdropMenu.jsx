import React, {useState, useRef, useEffect} from "react";
import { useTranslation } from "react-i18next";
import i18next from 'i18next';
import Flags from "country-flag-icons/react/1x1";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

import classes from "./BackDropMenu.module.scss";

const BackDropMenu = (props) => {
  const [openMenu, setOpenMenu] = useState(false);
  const { t } = useTranslation();
  const menuRef = useRef(null);

  useEffect(()=>{
    document.addEventListener("mousedown", handleClose);
    //clean up eventlistener
    return () => {
      document.removeEventListener("mousedown", handleClose);
    }
  }, [menuRef])

  const handleClose = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setOpenMenu(false);
    }
  }

  const handleClick = () => {
    setOpenMenu(true);
  };

  const handleLanguageChange = (language) => {
    i18next.changeLanguage(language, (err) => {
      if (err) return console.log("Something went wrong", err)
    })
    setOpenMenu(null);
  }

  return (
    <React.Fragment>
    <div className={classes.account_icon_wrapper} onClick={handleClick}>
    <FontAwesomeIcon
      icon={faUser}
      cursor="pointer"
      className={classes.account_icon_wrapper_icon}
    />
      </div>
      <div
        ref={menuRef}
        className={
          openMenu
            ? [classes.backDropMenu, classes.open].join(" ")
            : classes.backDropMenu
        }
      >
        <ul className={classes.backDropMenu_items}>
          <li>{t("topNavbar.profile")}</li>
          <li>{t("topNavbar.account")}</li>
          <h3>{t("topNavbar.languageTitle")}</h3>
          <li onClick={() => handleLanguageChange("en")}>            
          <div className={classes.language_wrapper}>
              <Flags.GB title="Anglicky" className={classes.language_wrapper_flags}/>Anglicky
            </div></li>
          <li onClick={() => handleLanguageChange("sk")}>
            <div className={classes.language_wrapper}>
              <Flags.SK title="Slovak" className={classes.language_wrapper_flags}/>Slovensky
            </div>
          </li>
          <li>{t("topNavbar.logout")}</li>
        </ul>
      </div>
    </React.Fragment>
  );
};

export default BackDropMenu;