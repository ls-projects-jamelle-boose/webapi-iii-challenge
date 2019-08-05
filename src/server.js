"use strict";

const express = require("express");
const moment = require("moment");
const helmet = require("helmet");
const cors = require("cors");

const UserRouter = require("../users/userRouter");

const PostRouter = require("../posts/postRouter");

const server = express();
server.use(express.json());

server.use(helmet());
server.use(cors());

server.use(logger);

server.use("/api/user", UserRouter);
server.use("/api/posts", PostRouter);

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  let now = moment().format();

  console.log(`${req.method} ${req.url} ${now}`);
  next();
}

server.use((err, req, res, next) => {
  res.status(500).json({
    message: `Bad panda`,
    err
  });
});

module.exports = server;
