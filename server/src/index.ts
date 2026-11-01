import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { config, featureStatus } from "./config.js";

const app = express();

app.set("trust proxy", 1); // Render sits behind a proxy
app.use(helmet());
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json({ limit: "1mb" }));
app.use(
  "/api",
  rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: true, legacyHeaders: false })
);

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    time: new Date().toISOString(),
    limits: { maxAudioMb: config.maxAudioMb, maxVideoMb: config.maxVideoMb },
    features: featureStatus(),
  });
});

app.use("/api", (_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Central error handler: never leak stack traces or file paths.
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ error: "Something went wrong on the server." });
});

app.listen(config.port, () => {
  console.log(`Server listening on port ${config.port}`);
});
