const { Customer, validate } = require("../models/customer");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const customers = await Customer.find().sort("name");
  res.send(customers);
});

router.post("/", async (req, res) => {
  //validate
  const { error } = validate(req.body);
  // if  found return 404 status
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  // save to the db
  let customers = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  });
  customers = await customers.save();
  res.send(customers); // send to the client
});

router.put("/:id", async (req, res) => {
  // Validate customer
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  // find the customer by ID
  // and den update
  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      phone: req.body.phone,
      isGold: req.body.isGold,
    },
    { new: true }
  );

  /* const movie = movies.find(movie => movie.id ===      //parseInt(req.params.id));*/

  // if not found return 404 status
  if (!customer) res.status(404).send("Customer with given ID not found");
  //  movie.name = req.body.name;

  // then send customer
  res.send(customer);
});

router.delete("/:id", async (req, res) => {
  // find the customer by ID
  // and den update
  const customer = await Customer.findByIdAndRemove(req.params.id);

  // if not found return 404 status
  if (!customer) res.status(404).send("Movie with given ID not found");
  res.send(customer);
});

router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) res.status(404).send("Customer with given ID not found");
  res.send(customer);
});

module.exports = router;
