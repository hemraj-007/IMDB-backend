const prisma = require("@prisma/client").PrismaClient;
const { z } = require("zod");

const prismaClient = new prisma();

// Create a new producer
exports.createProducer = async (req, res) => {
  const schema = z.object({
    name: z.string(),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]),
    dob: z.string(),
    bio: z.string().optional(),
  });

  try {
    const { name, gender, dob, bio } = schema.parse(req.body);

    const newProducer = await prismaClient.producer.create({
      data: { name, gender, dob: new Date(dob), bio },
    });

    res.status(201).json({ message: "Producer created successfully", producer: newProducer });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all producers
exports.getAllProducers = async (req, res) => {
  try {
    const producers = await prismaClient.producer.findMany();
    res.status(200).json({ producers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a producer by ID
exports.getProducerById = async (req, res) => {
  try {
    const { id } = req.params;

    const producer = await prismaClient.producer.findUnique({
      where: { id: parseInt(id) },
      include: { movies: true }, // Include related movies
    });

    if (!producer) {
      return res.status(404).json({ message: "Producer not found" });
    }

    res.status(200).json({ producer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a producer by ID
exports.updateProducer = async (req, res) => {
  const schema = z.object({
    name: z.string().optional(),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
    dob: z.string().optional(),
    bio: z.string().optional(),
  });

  try {
    const { id } = req.params;
    const data = schema.parse(req.body);

    const updatedProducer = await prismaClient.producer.update({
      where: { id: parseInt(id) },
      data: { ...data, dob: data.dob ? new Date(data.dob) : undefined },
    });

    res.status(200).json({ message: "Producer updated successfully", producer: updatedProducer });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a producer by ID
exports.deleteProducer = async (req, res) => {
  try {
    const { id } = req.params;

    await prismaClient.producer.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "Producer deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
