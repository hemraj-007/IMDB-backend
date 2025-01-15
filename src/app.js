const express = require("express");
const authRoutes = require("./routes/auth.routes");
const actorRoutes = require("./routes/actor.routes");
const movieRoutes = require("./routes/movie.routes");
const producerRoutes = require("./routes/producer.routes");
const cors = require("cors"); 

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/actors", actorRoutes);
app.use("/movies", movieRoutes);
app.use("/producers", producerRoutes); // Register producer routes

module.exports = app;

// "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidGVzdHVzZXJAZXhhbXBsZS5jb20iLCJpYXQiOjE3MzY2MDU0MTksImV4cCI6MTczNjYwOTAxOX0.jcW1O4avu9AcLzCWXG8PfanJsY7fT6ky_drltdik_0w"