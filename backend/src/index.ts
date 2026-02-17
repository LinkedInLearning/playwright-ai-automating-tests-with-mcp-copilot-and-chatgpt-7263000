import express from "express";
import { db } from "./db.js";
import { login } from "./authService.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use((_req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/api/health", (_req, res) => {
  let database: string = "connected";
  try {
    db.prepare("SELECT 1").get();
  } catch {
    database = "error";
  }
  res.json({
    ok: true,
    message: "BuggyBoard API is running",
    database,
  });
});

app.post("/api/login", (req, res) => {
  const username = (req.body?.username as string) ?? "";
  const password = (req.body?.password as string) ?? "";
  const result = login(username, password);

  if (result.success) {
    res.status(200).json({ username: result.username });
    return;
  }

  switch (result.code) {
    case "BLANK_USERNAME":
      res.status(400).json({
        error: "blank_username",
        message: "Username cannot be blank.",
      });
      return;
    case "BLANK_PASSWORD":
      res.status(400).json({
        error: "blank_password",
        message: "Password cannot be blank.",
      });
      return;
    case "MISSING_CREDENTIALS":
      res.status(400).json({
        error: "missing_credentials",
        message: "Please enter your username and password.",
      });
      return;
    case "INVALID_CREDENTIALS":
      res.status(401).json({
        error: "invalid_credentials",
        message: "Invalid username or password.",
      });
      return;
  }
});

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
