const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, validate} = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});
//for creating new user
router.post("/", async (req, res) => {
  // validate the user's request
  const { error } = validate(req.body);
  // return status if its invalid
  if (error) return res.status(400).send(error.details[0].message);
  //validation to know te user is not already register
  let user = await User.findOne({ email: req.body.email });
  // if user is present in te db return bad req error d client
  if (user) return res.status(400).send("User already  registered");
  // reset to a new user
  user = new User(_.pick(req.body, ["name", "email", "password"] ));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
   // and save to db
   await user.save();

  const token = user.generateAuthToken();

   // send to the client
  res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
  
});

module.exports = router;
