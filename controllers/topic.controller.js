import Topic from "../models/topic.model.js";
import { errorHandler } from "../utils/error.js";

export const create = async (req, res, next) => {
  if (!req.body.content) {
    return next(errorHandler(400, "Please provide all required fields"));
  }

  const newTopic = new Topic({
    ...req.body,
    userId: req.user.id,
  });
  try {
    const savedTopic = await newTopic.save();
    res
      .status(201)
      .json({ success: true, statusCode: 201, message: "Topic created" });
  } catch (error) {
    next(error);
  }
};

export const gettopics = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const topics = await Topic.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.topicId && { _id: req.query.topicId }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalTopics = await Topic.countDocuments();

    res.status(200).json({
      topics,
      totalTopics,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export const deletetopic = async (req, res, next) => {
  try {
    await Topic.findByIdAndDelete(req.params.topicId);
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "The topic has been deleted",
    });
  } catch (error) {
    next(error);
  }
};

export const updatetopic = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this career"));
  }
  try {
    const updatedTopic = await Topic.findByIdAndUpdate(
      req.params.topicId,
      {
        $set: {
          content: req.body.content,
        },
      },
      { new: true }
    );
    res
      .status(200)
      .json({ success: true, statusCode: 200, message: "Topic updated" });
  } catch (error) {
    next(error);
  }
};
