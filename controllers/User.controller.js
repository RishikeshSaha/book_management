const jwt = require("jsonwebtoken");
const User = require("../models/User.model.js");
const asyncHandler = require("../middlewares/asyncHandler.middleware");


const authKey = "BookManagementSys";

const Register = asyncHandler(async (req, res) => {
  const { title, name, phone, email, password, address } = req.body;

  console.log("hello");

  let user = await User.findOne({ email });

  if (user) {
    return res.status(400).json({ message: "User already exists" });
  }
  user = new User({
    title,
    name,
    phone,
    email,
    password: password,
    address: {
      street: address?.street,
      city: address?.city,
      pincode: address?.pincode
    }
  });

  await user.save();
  res
    .status(201)
    .json({ status: 201, message: "User created successfully", user });
});

const Login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  let isPasswordValid = false;
  if (password == user.password) {
    isPasswordValid = true;
  }
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user._id }, authKey, {
    expiresIn: "1h",
  });

  console.log("token " + token)

  res.json({
    status: 201, message: "Logged in successfully",
    "token": token,
    user: {
      id: user._id,
      name: user.name,
      userId: user.userID
    }
  });
});

module.exports = { Register, Login };
