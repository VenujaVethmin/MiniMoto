import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client.js"; 

const prisma = new PrismaClient();


const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email , role : user.role }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

export const register = async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) return res.status(400).json({ msg: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });
  const token = generateToken(newUser);

  res.json({ token, user: { id: newUser.id, email: newUser.email } });
};

export const login = async (req, res) => {
  const { email, password } = req.body;


  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) return res.status(400).json({ msg: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

  const token = generateToken(user);
  res.json({ token, user: { id: user.id, email: user.email , role : user.role} });
};

export const protectedRoute = (req, res) => {
  res.status(200).json({id : req.user.id , email:req.user.email , role : req.user.role});
};
