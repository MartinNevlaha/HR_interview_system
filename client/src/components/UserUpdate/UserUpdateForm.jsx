import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

import classes from "./UserUpdateForm.module.scss";
import Card from "../UI/Card/Card";
import Button from "../UI/Button/Button";
import TextField from "../Inputs/TextField/TextField";

const UserUpdate = () => {
  const [pwdReset, setPwdReset] = useState(false);

  const validate = Yup.object({
    firstName: Yup.string()
      .max(20, "Must be 20 characters or less")
      .required("First name is required"),
    lastName: Yup.string()
      .max(20, "Must be 20 characters or less")
      .required("Last name is required"),
    email: Yup.string().email("Email is invalid").required("Email is required"),
    oldPassword: Yup.string().min(6, "Password muste be at least 6 characters"),
    newPassword: Yup.string().min(6, "Password must be at least 6 characters"),
    confirmNewPassword: Yup.string().oneOf(
      [Yup.ref("newPassword"), null],
      "Password must match"
    ),
  });

  const handleResetPwd = (e) => {
    e.preventDefault();
    setPwdReset(!pwdReset);
  };

  return (
    <Formik
      initialValues={{
        firstName: "",
        lastName: "",
        email: "",
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
        avatar: "",
      }}
      validationSchema={validate}
      onSubmit={(userData) => {
        let data = new FormData();
        data.append("avatar", userData.avatar);
        // dispatch redux action to update data
      }}
    >
      {(formProps) => (
        <div className={classes.profile_container}>
          <h1>Here you can update your profile !</h1>
          <Form>
            <div className={classes.profile_container_inputs}>
              <Card type="medium_card">
                <h2>User avatar</h2>
                <div className={classes.profile_container_inputs_avatar}>
                  <FontAwesomeIcon icon={faUserCircle} size="10x" />
                  <input
                    className={
                      classes.profile_container_inputs_avatar_file_input
                    }
                    type="file"
                    name="avatar"
                    onChange={(e) =>
                      formProps.setFieldValue("avatar", e.target.files[0])
                    }
                  />
                </div>
              </Card>
              <Card type="small_card">
                <div className={classes.profile_container_inputs_text}>
                  <TextField label="First Name" name="firstName" type="text" />
                  <TextField label="Last Name" name="lastName" type="text" />
                  <TextField label="Email" name="email" type="email" />
                  <h2>To reset password push Reset button</h2>
                  <Button clicked={handleResetPwd}>
                    {pwdReset ? "Close" : "Reset"}
                  </Button>
                  {pwdReset && (
                    <React.Fragment>
                      <TextField
                        label="Old Password"
                        name="oldPassword"
                        type="password"
                      />
                      <TextField
                        label="New Password"
                        name="newPassword"
                        type="password"
                      />
                      <TextField
                        label="Confirm New password"
                        name="confirmNewPassword"
                        type="password"
                      />
                    </React.Fragment>
                  )}
                </div>
              </Card>
            </div>
            <Button type="submit">Update</Button>
          </Form>
        </div>
      )}
    </Formik>
  );
};

export default UserUpdate;
