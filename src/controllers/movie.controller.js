const prisma = require("@prisma/client").PrismaClient;
const { z } = require("zod");

const prismaClient = new prisma();

// Create a new movie
exports.createMovie = async (req, res) => {
    const schema = z.object({
      name: z.string(),
      yearOfRelease: z.number(),
      plot: z.string().optional(),
      poster: z.string().optional(),
      producerId: z.number().optional(),
      actorIds: z.array(z.number()).optional(), // List of actor IDs
    });
  
    try {
      const { name, yearOfRelease, plot, poster, producerId, actorIds } = schema.parse(req.body);
  
      // Validate actor IDs
      if (actorIds && actorIds.length > 0) {
        const existingActors = await prismaClient.actor.findMany({
          where: { id: { in: actorIds } },
        });
  
        const existingActorIds = existingActors.map((actor) => actor.id);
        const invalidActorIds = actorIds.filter((id) => !existingActorIds.includes(id));
  
        if (invalidActorIds.length > 0) {
          return res.status(400).json({
            error: `Invalid actor IDs: ${invalidActorIds.join(", ")}`,
          });
        }
      }
  
      const newMovie = await prismaClient.movie.create({
        data: {
          name,
          yearOfRelease,
          plot,
          poster,
          producerId,
          actors: actorIds
            ? {
                create: actorIds.map((actorId) => ({ actorId })),
              }
            : undefined,
        },
      });
  
      res.status(201).json({ message: "Movie created successfully", movie: newMovie });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };  

// Get all movies
exports.getAllMovies = async (req, res) => {
  try {
    const movies = await prismaClient.movie.findMany({
      include: {
        producer: true, // Include producer details
        actors: {
          include: { actor: true }, // Include actor details
        },
      },
    });

    res.status(200).json({ movies });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a movie by ID
exports.getMovieById = async (req, res) => {
  try {
    const { id } = req.params;

    const movie = await prismaClient.movie.findUnique({
      where: { id: parseInt(id) },
      include: {
        producer: true, // Include producer details
        actors: {
          include: { actor: true }, // Include actor details
        },
      },
    });

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json({ movie });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a movie by ID
exports.updateMovie = async (req, res) => {
  const schema = z.object({
    name: z.string().optional(),
    yearOfRelease: z.number().optional(),
    plot: z.string().optional(),
    poster: z.string().optional(),
    producerId: z.number().optional(),
    actorIds: z.array(z.number()).optional(),
  });

  try {
    const { id } = req.params;
    const { actorIds, ...data } = schema.parse(req.body);

    const updatedMovie = await prismaClient.movie.update({
      where: { id: parseInt(id) },
      data: {
        ...data,
        actors: actorIds
          ? {
              deleteMany: {}, // Clear existing relationships
              create: actorIds.map((actorId) => ({ actorId })),
            }
          : undefined,
      },
      include: {
        producer: true,
        actors: { include: { actor: true } },
      },
    });

    res.status(200).json({ message: "Movie updated successfully", movie: updatedMovie });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a movie by ID
exports.deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;

    await prismaClient.movie.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "Movie deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
