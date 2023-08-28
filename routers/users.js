const express = require("express");
const router = express.Router();
const users = require("../users");
const { body, validationResult } = require("express-validator");

router.get("/", (req, res) => {
  res.json({ data: users, message: "ok" });
});

router.get("/:id", (req, res) => {
  const user = users.find((user) => user.id === parseInt(req.params.id));
  if (!user)
    return res.status(404).json({ data: null, message: "user not found" });
  res.json({
    data: user,
    message: "ok",
  });
});

router.post(
  "/",
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

router.put(
  "/:id",
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
router.delete("/:id", (req, res) => {
  const user = users.find((user) => user.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ data: null, message: "user not found" });
  }
  const index = users.indexOf(user);
  users.splice(index, 1);
  res.json({ data: users, message: "user deleted" });
});

module.exports = router;
