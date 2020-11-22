const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/user");
// const bcrypt = require("bcrypt");

router.post("/login", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({
    email: req.body.email,
  });
  if (!user) return res.status(400).send("EMAIL_NOT_FOUND");
  const pwd = String(user.password).localeCompare(req.body.password);
  // const pwd = String(user.password) === String(req.body.password);
  if (pwd) return res.status(400).send("INVALID_PASSWORD");

  return user.isAdmin
    ? res.header("auth", user.isAdmin).json({
        user: {
          email: user.email,
          id: user._id,
          expiresIn: 3600,
          isAdmin: user.isAdmin,
        },
      })
    : res.json({
        user: {
          email: user.email,
          id: user._id,
          expiresIn: 3600,
          isAdmin: user.isAdmin,
        },
      });
});

router.post("/register", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let user = await User.findOne({
    email: req.body.email,
  });
  if (user) return res.status(400).send("EMAIL_EXISTS");
  // const salt = await bcrypt.genSalt(10);
  // const hashPwd = await bcrypt.hash(req.body.password, salt);
  // user = new User({ email: req.body.email, password: hashPwd, isAdmin: true });
  user = new User({
    email: req.body.email,
    password: req.body.password,
    isAdmin: false,
  });
  // user = new User({email: req.body.email, password: hashPwd, isAdmin: false});
  await user.save();
  res.json({
    // message: "User succesfull created",
    message: "Użytkownik został stworzony poprawnie",
    user: {
      email: user.email,
      id: user._id,
      expiresIn: 3600,
      isAdmin: user.isAdmin,
    },
  });
});

module.exports = router;
