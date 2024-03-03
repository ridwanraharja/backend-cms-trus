import express from "express";
import userRoutes from "./routes/user.route.js";
import "./connection.js";

const app = express();

app.listen(3000, () => {
  console.log("Server started on port 3000");
});

app.use("/api/user", userRoutes);
