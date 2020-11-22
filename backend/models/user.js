const Joi = require("Joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    minlength: 5,
    maxlength: 255
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 1024
  },
  isAdmin: Boolean
});

const User = mongoose.model("User", userSchema);

const validUsers = user => {
  const schema = {
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(6)
      .max(1024)
      .required()
  };
  return Joi.validate(user, schema);
};

exports.userSchema = userSchema;
exports.User = User;
exports.validate = validUsers;
