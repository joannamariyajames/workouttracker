import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from 'fs';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory store for demo (Clear on restart)
// In a real app, use Firestore or a DB
const users = new Map<string, { email: string; dob: string; verified: boolean }>();
const verificationCodes = new Map<string, { code: string; expires: number }>();

// AUTH ENDPOINTS
app.post("/api/auth/register", (req, res) => {
  const { email, dob } = req.body;
  if (!email || !dob) return res.status(400).json({ error: "Missing fields" });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  verificationCodes.set(email, { code, expires: Date.now() + 600000 }); // 10 mins

  console.log(`\n\n[AUTH] CODE FOR ${email}: ${code}\n\n`);

  users.set(email, { email, dob, verified: false });
  res.json({ success: true, message: "Code sent to console" });
});

app.post("/api/auth/verify", (req, res) => {
  const { email, code } = req.body;
  const stored = verificationCodes.get(email);

  if (stored && stored.code === code && stored.expires > Date.now()) {
    const user = users.get(email);
    if (user) {
      user.verified = true;
      verificationCodes.delete(email);
      return res.json({ success: true, user });
    }
  }

  res.status(400).json({ error: "Invalid or expired code" });
});

app.post("/api/auth/login", (req, res) => {
  const { email, dob } = req.body;
  const user = users.get(email);

  if (user && user.dob === dob) {
    return res.json({ success: true, user });
  }

  res.status(401).json({ error: "Invalid credentials" });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
