import React from "react";

import classes from "./Card.module.scss";

const Card = () => {
  return (
    <div className={classes.card_wrapper_wide_angle}>
      <h2>Some dummy title</h2>
      <p>
        What is Lorem Ipsum Lorem Ipsum is simply dummy text of the printing and
        typesetting industry Lorem Ipsum has been the industry's standard dummy
        text ever since the 1500s when an unknown printer took a galley of type
        and scrambled it to make a type specimen book it has?
      </p>
    </div>
  );
};

export default Card;
