const express = require("express");
const movieController = require("../controllers/movie.controller");

const router = express.Router();

// Create a new movie
router.post("/", movieController.createMovie);

// Get all movies
router.get("/", movieController.getAllMovies);

// Get a movie by ID
router.get("/:id", movieController.getMovieById);

// Update a movie by ID
router.put("/:id", movieController.updateMovie);

// Delete a movie by ID
router.delete("/:id", movieController.deleteMovie);

module.exports = router;
