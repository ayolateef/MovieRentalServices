const express = require('express');
const auth = require("../routes/auth");
const movies = require("../routes/movies");
const customers = require("../routes/customers");
const genres = require("../routes/genres");
const rentals = require("../routes/rentals");
const user = require("../routes/user");
const error = require("../middleware/error");

module.exports = function (app) {    
// if you any req delegate to these routerq3
app.use(express.json());
app.use("/api/movies", movies);
app.use("/api/customers", customers);
app.use("/api/rentals", rentals);
app.use("/api/user", user);
app.use("/api/genres", genres);
app.use("/api/auth", auth);
app.use(error);
}