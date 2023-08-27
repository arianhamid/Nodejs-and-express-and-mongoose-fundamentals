const express = require("express");
const app = express();

app.get("/api/users", (req, res) => {
  res.send([
    { id: 1, name: "user1" },
    { id: 2, name: "user2" },
  ]);
});

// get the environment
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("NODE_ENV:", app.get("env"));

app.get("/api/users/:id", (req, res) => {
  console.log(req.params);
  // res.send([
  //   { id: 1, name: "user1" },
  //   { id: 2, name: "user2" },
  // ]);
});

// $env: PORT = 1366;
// SET PORT = 1366  //not work
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`server listening on port ${port}`));
