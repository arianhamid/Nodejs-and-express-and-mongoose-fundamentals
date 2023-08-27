const express = require("express");
const app = express();
const users = require("./users");
const bodyParser = require("body-parser");
const { body, validationResult } = require("express-validator");
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("config");

app.use(bodyParser.json()); // parse requests of content-type - application/json
app.use(bodyParser.urlencoded({ extended: true })); // parse requests of content-type - application/x-www-form-urlencoded

app.get("/api/users", (req, res) => {
  res.json({ data: users, message: "ok" });
});

app.get("/api/users/:id", (req, res) => {
  const user = users.find((user) => user.id === parseInt(req.params.id));
  if (!user)
    return res.status(404).json({ data: null, message: "user not found" });
  res.json({
    data: user,
    message: "ok",
  });
});

app.post(
  "/api/users",
  [
    body("email", "email must be valid").isEmail(),
    body("first_name", "first_name cant be empty").notEmpty(),
    body("last_name", "last name cant be empty").notEmpty(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(422)
        .json({ errors: errors.array(), message: "validation failed" });
    }
    users.push({ id: users.length + 1, ...req.body });
    res.json({ data: users, message: "ok" });
  }
);

app.put(
  "/api/users/:id",
  [
    body("email", "email must be valid").isEmail(),
    body("first_name", "first_name cant be empty").notEmpty(),
    body("last_name", "last name cant be empty").notEmpty(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(422)
        .json({ errors: errors.array(), message: "validation failed" });
    }
    const user = users.find((user) => user.id === parseInt(req.params.id));
    if (!user) {
      return res.status(404).json({ data: null, message: "user not found" });
    }
    const newUsers = users.map((user) => {
      if (user.id === parseInt(req.params.id)) {
        return { ...user, ...req.body };
      }
      return user;
    });
    res.json({ data: newUsers, message: "user updated" });
  }
);

// validate incoming requests
app.delete("/api/users/:id", (req, res) => {
  const user = users.find((user) => user.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ data: null, message: "user not found" });
  }
  const index = users.indexOf(user);
  users.splice(index, 1);
  res.json({ data: users, message: "user deleted" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`server listening on port ${port}`));

// get the environment variables
// console.log("NODE_ENV:", process.env.NODE_ENV);
// console.log("NODE_ENV:", app.get("env"));

// $env: PORT = 1366;
// set PORT = 1366  //not work
