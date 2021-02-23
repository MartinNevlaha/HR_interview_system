const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const timestamp = require("time-stamp");
const cron = require("node-cron");

const logger = require("./config/winston");
const config = require("./config/app");
const { cleanUpInactiveUsers } = require("./jobs/cleanUpInactiveUsers");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(
  morgan("combined", {
    stream: logger.stream,
  })
);

app.use("/api/users", require("./routes/authUser"));

//Error handler
app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  logger.error(
    `${timestamp("YYYY/MM/DD/HH:mm:ss")} - ${status} - ${message} - ${data} - ${
      req.originalUrl
    } - ${req.method} - ${req.ip}`
  );
  res.status(status);
  res.json({ message: message, data: data });
});

//run clean up database inactive users every day at 2:30 AM
cron.schedule("30 2 * * *", () => cleanUpInactiveUsers());

app.listen(config.appPort, () => {
  logger.log({
    time: timestamp("YYYY/MM/DD/HH:mm:ss"),
    level: "info",
    message: `Server is up and running on port ${config.appPort}`,
  });
});
