const express = require("express");
const moment = require("moment");
// const cors = require("cors")

const server = express();
server.use(express.json());

server.use(logger);

server.get("/", (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  let now = moment().format();

  console.log(`${req.method} ${req.url} ${now}`);
  next();
}

module.exports = server;
