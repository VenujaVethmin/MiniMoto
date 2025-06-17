import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import users from "../user.js";


const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

export const register = async (req, res) => {
  const { email, password } = req.body;
  const existingUser = users.find((u) => u.email === email);

  if (existingUser) return res.status(400).json({ msg: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: users.length + 1,
    email,
    password: hashedPassword,
  };

  users.push(newUser);
  const token = generateToken(newUser);

  res.json({ token, user: { id: newUser.id, email: newUser.email } });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);

  if (!user) return res.status(400).json({ msg: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

  const token = generateToken(user);
  res.json({ token, user: { id: user.id, email: user.email } });
};

export const protectedRoute = (req, res) => {
  res.json({ msg: `Welcome ${req.user.email}! This is a protected route.` });
};
