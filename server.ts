import express from "express";
import cors from "cors";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// In-memory store for demo
const users = new Map<string, { email: string; dob: string; verified: boolean }>();
const verificationCodes = new Map<string, { code: string; expires: number }>();

// REGISTER
app.post("/api/auth/register", (req, res) => {
  const { email, dob } = req.body;

  if (!email || !dob) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  verificationCodes.set(email, {
    code,
    expires: Date.now() + 600000,
  });

  console.log(`AUTH CODE FOR ${email}: ${code}`);

  users.set(email, {
    email,
    dob,
    verified: true,
  });

  res.json({
    success: true,
    message: "Registered successfully",
  });
});

// VERIFY
app.post("/api/auth/verify", (req, res) => {
  const { email, code } = req.body;

  const stored = verificationCodes.get(email);

  if (
    stored &&
    stored.code === code &&
    stored.expires > Date.now()
  ) {
    const user = users.get(email);

    if (user) {
      user.verified = true;
      verificationCodes.delete(email);

      return res.json({
        success: true,
        user,
      });
    }
  }

  res.status(400).json({
    error: "Invalid or expired code",
  });
});

// LOGIN
app.post("/api/auth/login", (req, res) => {
  const { email, dob } = req.body;

  const user = users.get(email);

  if (user && user.dob === dob) {
    return res.json({
      success: true,
      user,
    });
  }

  res.status(401).json({
    error: "Invalid credentials",
  });
});

// ROOT
app.get("/", (req, res) => {
  res.json({
    status: "Backend running",
  });
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});