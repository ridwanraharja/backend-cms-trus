import mongoose from "mongoose";

const topicSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Topic = mongoose.model("Topic", topicSchema);

export default Topic;
