import React, { useState } from "react";
import { useSelector } from "react-redux";

import classes from "./Layout.module.scss";
import Topbar from "../components/Menu/Topbar/Topbar";
import SideDrawer from "../components/Menu/SideDrawer/SideDrawer";

const Layout = (props) => {
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);
  const isAuth = useSelector((state) => state.userAuth.token);

  const handleOpenSideDrawer = () => {
    setSideDrawerOpen(true);
  };

  const closeSideDrawer = () => {
    setSideDrawerOpen(false);
  };

  return (
    <React.Fragment>
      {isAuth && (
        <header>
          <Topbar menuClick={handleOpenSideDrawer} />
        </header>
      )}
              {isAuth && (
          <SideDrawer
            isOpen={sideDrawerOpen}
            closeSideDrawer={closeSideDrawer}
          />
        )}
      <main className={classes.main_wrapper}>
        <div
          className={
            isAuth
              ? classes.main_wrapper_content
              : [classes.main_wrapper_content, classes.linear].join(" ")
          }
        >
          {props.children}
        </div>
      </main>
    </React.Fragment>
  );
};

export default Layout;
