const prisma = require("@prisma/client").PrismaClient;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { z } = require("zod");

const prismaClient = new prisma();
const JWT_SECRET = "your_jwt_secret_key";

exports.signup = async (req, res) => {
  try {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });
    const { email, password } = schema.parse(req.body);

    const existingUser = await prismaClient.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prismaClient.user.create({
      data: { email, password: hashedPassword },
    });

    res.status(201).json({ message: "User created successfully", userId: newUser.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.signin = async (req, res) => {
  try {
    const schema = z.object({
      email: z.string().email(),
      password: z.string(),
    });
    const { email, password } = schema.parse(req.body);

    const user = await prismaClient.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ message: "Signin successful", token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
