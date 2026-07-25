import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env";
import DBConnect from "./config/db";
import authRouter from "./routes/auth.routes";
import societyRouter from "./routes/society.routes";
import userRouter from "./routes/user.routes";
import { visitorRouter } from "./routes/visitor.routes";
import { uploadRouter } from "./routes/upload.routes";
import { complaintRouter } from "./routes/complaint.routes";
import { noticeRouter } from "./routes/notice.routes";
import errorMiddleware from "./middleware/errorMiddleware";

const app = express();

// Global middleware
app.use(helmet());
app.use(express.json());
app.use(cors({ origin: "*" }));

// Routes
app.use("/auth", authRouter);
app.use("/society", societyRouter);
app.use("/user", userRouter);
app.use("/visitors", visitorRouter);
app.use("/uploads", uploadRouter);
app.use("/complaints", complaintRouter);
app.use("/notices", noticeRouter);

// Health check
app.get("/", (_req, res) => {
  res.json({
    message: "Foyer Server is running",
    version: "1.0.0",
  });
});

// Global Error Middleware (must be registered after all routes)
app.use(errorMiddleware);

// Start the Express server
const PORT = env.PORT;

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
