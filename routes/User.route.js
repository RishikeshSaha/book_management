const express = require("express");
const userRouter = express.Router();
const {
  Register,
  Login
} = require("../controllers/User.controller.js");

userRouter.post("/register", Register);
userRouter.post("/login", Login);

module.exports = userRouter;
