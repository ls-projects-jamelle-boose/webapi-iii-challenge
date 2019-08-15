const server = require("./src/server");
const port = 4000;

server.listen(port, err => {
  if (err) console.error(err);
  console.log(`*** Server running on http://localhost:${port} ***`);
});
