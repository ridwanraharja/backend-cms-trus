import express from "express";
import "./connection.js";

const app = express();

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
