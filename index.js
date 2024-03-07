import express from "express";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import careerRoutes from "./routes/career.route.js";
import topicRoutes from "./routes/topic.route.js";
import messageFormRoutes from "./routes/messageForm.route.js";
import cors from "cors";
import "./connection.js";
import cookieParser from "cookie-parser";

const app = express();

app.set("trust proxy", 1);
app.use(
  cors({
    //To allow requests from client
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://127.0.0.1",
      "http://104.142.122.231",
    ],
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);

app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
  console.log("Server started on port 3000");
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/career", careerRoutes);
app.use("/api/topic", topicRoutes);
app.use("/api/messageform", messageFormRoutes);

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
