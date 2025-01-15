const express = require("express");
const producerController = require("../controllers/producer.controller");

const router = express.Router();

// Create a new producer
router.post("/", producerController.createProducer);

// Get all producers
router.get("/", producerController.getAllProducers);

// Get a producer by ID
router.get("/:id", producerController.getProducerById);

// Update a producer by ID
router.put("/:id", producerController.updateProducer);

// Delete a producer by ID
router.delete("/:id", producerController.deleteProducer);

module.exports = router;
