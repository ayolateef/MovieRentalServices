const { Rental, validate } = require("../models/rentals");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const express = require("express");
const Fawn = require("fawn");
const mongoose = require("mongoose");
const router = express.Router();

Fawn.init(mongoose);
// Get d list of rentals
// GET /api/rentals

router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

router.post("/", async (req, res) => {
  // validate the rental
  const { error } = validate(req.body);
  // return status if its invalid
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid customer");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid movie");

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not available");

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie._id,
      title: movie.title,
    },
  });

  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update(
        "movies",
        { _id: movie._id },
        {
          $inc: { numberInStock: -1 },
        }
      )
      .run();

    res.send(rental);
  } catch (ex) {
    res.status(500).send("Failed transaction");
  }

  // rental = await rental.save();
  //     movie.numberInStock--;
  //    movie.save();
});

router.get("/:id", async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental) return res.status(404).send("Rental with given ID not found");

  res.send(rental);
});

module.exports = router;