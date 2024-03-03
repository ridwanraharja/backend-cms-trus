import mongoose from "mongoose";
import "dotenv/config";

const connection = mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log(error);
  });

export default connection;
