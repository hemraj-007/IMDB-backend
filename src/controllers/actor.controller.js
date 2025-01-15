const prisma = require("@prisma/client").PrismaClient;
const { z } = require("zod");

const prismaClient = new prisma();

// Create a new actor
exports.createActor = async (req, res) => {
  const schema = z.object({
    name: z.string(),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]),
    dob: z.string(),
    bio: z.string().optional(),
  });

  try {
    const { name, gender, dob, bio } = schema.parse(req.body);

    const newActor = await prismaClient.actor.create({
      data: { name, gender, dob: new Date(dob), bio },
    });

    res.status(201).json({ message: "Actor created successfully", actor: newActor });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all actors
exports.getAllActors = async (req, res) => {
  try {
    const actors = await prismaClient.actor.findMany();
    res.status(200).json({ actors });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get an actor by ID
exports.getActorById = async (req, res) => {
  try {
    const { id } = req.params;

    const actor = await prismaClient.actor.findUnique({
      where: { id: parseInt(id) },
      include: { movies: true }, // Includes related movies
    });

    if (!actor) {
      return res.status(404).json({ message: "Actor not found" });
    }

    res.status(200).json({ actor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an actor by ID
exports.updateActor = async (req, res) => {
  const schema = z.object({
    name: z.string().optional(),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
    dob: z.string().optional(),
    bio: z.string().optional(),
  });

  try {
    const { id } = req.params;
    const data = schema.parse(req.body);

    const updatedActor = await prismaClient.actor.update({
      where: { id: parseInt(id) },
      data: { ...data, dob: data.dob ? new Date(data.dob) : undefined },
    });

    res.status(200).json({ message: "Actor updated successfully", actor: updatedActor });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an actor by ID
exports.deleteActor = async (req, res) => {
  try {
    const { id } = req.params;

    await prismaClient.actor.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "Actor deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
