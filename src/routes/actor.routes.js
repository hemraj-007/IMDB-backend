const express = require("express");
const actorController = require("../controllers/actor.controller");

const router = express.Router();

// Create a new actor
router.post("/", actorController.createActor);

// Get all actors
router.get("/", actorController.getAllActors);

// Get an actor by ID
router.get("/:id", actorController.getActorById);

// Update an actor by ID
router.put("/:id", actorController.updateActor);

// Delete an actor by ID
router.delete("/:id", actorController.deleteActor);

module.exports = router;
