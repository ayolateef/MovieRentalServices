const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  // validate the username or password
  const { error } = validate(req.body);
  // return status if its invalid
  if (error) return res.status(400).send(error.details[0].message);
  //validation to know te user is not already register
  let user = await User.findOne({ email: req.body.email });
  // if user is not present in te db return bad req error d client
  if (!user) return res.status(400).send("Invalid email or password");
  // validate the password
  const validPassword = await bcrypt.compare(
    req.body.password,
    user.password,
    salt
  );
  // if its an invalid password
  if (!validPassword) return res.status(400).send("Invalid email or password");

  //generating a token
  const token = user.generateAuthToken();
//send to d client
  res.send(token);
});

function validate(req) {
  const schema = {
    email: Joi.string().email().min(5).max(255).required(),
    password: Joi.string().min(5).max(255).required(),
  };
  return Joi.validate(req, schema);
}

module.exports = router;
