const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    enum: ['Mr', 'Mrs', 'Miss']
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 15,
  },
  address: {
    street: { type: String },
    city: { type: String },
    pincode: { type: String }
  },
  createdAt: {
    type: Number,
    default: new Date().getTime()
  },
  updatedAt: {
    type: Number,
    default: new Date().getTime()
  },

});

const User = mongoose.model("User", userSchema);

module.exports = User;
