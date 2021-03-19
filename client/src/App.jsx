import React, { useEffect, Suspense, lazy } from "react";
import { Switch, Route, withRouter, Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import "./App.scss";
import Layout from "./HOC/Layout";
import Toast from "./components/UI/Toast/Toast";
import ProtectedRoute from "./Router/ProtectedRoute";
import * as action from "./store/actions";
import Spinner from "./components/UI/Spinner/Spinner";

//component lazy load
const Login = lazy(() => import("./containers/Login"));
const Dashboard = lazy(() => import("./containers/Dashboard"));
const UserUpdate = lazy(() => import("./containers/UserUpdate"));
const FriendsList = lazy(() => import("./containers/FriendsList"));
const EmailActivation = lazy(() => import("./containers/EmailActivation"));
const FriendRequest = lazy(() => import("./containers/FriendRequest"));

function App() {
  const dispatch = useDispatch();
  const error = useSelector((state) => state.requestStatus.error);
  const success = useSelector((state) => state.requestStatus.success);
  const isAuth = useSelector((state) => state.userAuth.token);

  useEffect(() => {
    dispatch(action.authCheckState());
  }, [dispatch]);

  const { t } = useTranslation();

  let routes = (
    <Suspense fallback={<Spinner />}>
      <Switch>
        <ProtectedRoute path="/friends-list" component={FriendsList} />
        <ProtectedRoute path="/friend-requests" component={FriendRequest} />
        <ProtectedRoute path="/update-profile" component={UserUpdate} />
        <ProtectedRoute path="/" exact component={Dashboard} />
        <Route path="/activation/:token" component={EmailActivation} />
        {isAuth ? null : <Route path="/login" component={Login} />}
        <Redirect to="/" />
      </Switch>
    </Suspense>
  );

  return (
    <div className="App">
      <Layout>
        <Toast
          isShow={error || success}
          isSuccess={success ? true : false}
          message={error ? error.data.message : success}
        />
        {routes}
      </Layout>
    </div>
  );
}

export default withRouter(App);
