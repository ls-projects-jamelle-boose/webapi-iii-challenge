const moment = require("moment");

function logger(req, res, next) {
  let now = moment().format();

  console.log(`${req.method} ${req.url} ${now}`);
  next();
}

module.exports = logger;
