import cors from "cors";
import "dotenv/config";
import express from "express";
import DBConnect from "./config/db";
import authRouter from "./routes/auth.routes";
import societyRouter from "./routes/society.routes";
import userRouter from "./routes/user.routes";

const app = express();

// Global middleware
app.use(express.json());
app.use(cors({ origin: "*" }));

// Routes
app.use("/auth", authRouter);
app.use("/society", societyRouter);
app.use("/user", userRouter);

// Health check
app.get("/", (_req, res) => {
  res.json({
    message: "Foyer Server is running",
    version: "1.0.0",
  });
});

// Start the Express server
const PORT = process.env.PORT || 8000;

const start = async () => {
  await DBConnect();
  app.listen(PORT, () => {
    console.log(`Foyer Server is running on http://localhost:${PORT}`);
  });
};

start().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
