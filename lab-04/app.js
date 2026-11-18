const express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "users.db");
const JWT_SECRET = "MY_SECRET_JWT_TOKEN_KEY_2024";

let db = null;

const initializeDBAndServer = async () => {
  db = await open({ filename: dbPath, driver: sqlite3.Database });
  app.listen(3000, () => {
    console.log("Server running at http://localhost:3000/");
  });
};

initializeDBAndServer();

app.post("/register/", async (req, res) => {
  const { username, name, password } = req.body;

  if (!username || !name || !password) {
    return res.status(400).json({ error: "Username, Name and Password are required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Password is too short" });
  }

  const existingUser = await db.get(
    "SELECT username FROM user WHERE username = ?",
    [username]
  );

  if (existingUser !== undefined) {
    return res.status(400).json({ error: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.run(
    "INSERT INTO user (username, name, password) VALUES (?, ?, ?)",
    [username, name, hashedPassword]
  );

  res.status(200).json({ message: "User created successfully" });
});

app.post("/login/", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and Password are required" });
  }

  const user = await db.get(
    "SELECT * FROM user WHERE username = ?",
    [username]
  );

  if (user === undefined) {
    return res.status(400).json({ error: "Invalid user" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({ error: "Invalid password" });
  }

  const payload = { username: user.username };
  const jwtToken = jwt.sign(payload, JWT_SECRET);

  res.status(200).json({ jwtToken });
});
