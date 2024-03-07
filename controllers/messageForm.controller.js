import MessageForm from "../models/messageForm.model.js";
import { errorHandler } from "../utils/error.js";

export const create = async (req, res, next) => {
  if (
    (!req.body.name || !req.body.email,
    !req.body.phone,
    !req.body.topic,
    !req.body.message)
  ) {
    return next(errorHandler(400, "Please provide all required fields"));
  }

  const newMessageForm = new MessageForm({
    ...req.body,
  });
  try {
    const savedMessageForm = await newMessageForm.save();
    res
      .status(201)
      .json({ success: true, statusCode: 201, message: "Message created" });
  } catch (error) {
    next(error);
  }
};

export const getmessageforms = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const messageforms = await MessageForm.find({
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.messageformId && { _id: req.query.messageformId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalMessageForms = await MessageForm.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthMessageForms = await MessageForm.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      messageforms,
      totalMessageForms,
      lastMonthMessageForms,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export const deletemessageform = async (req, res, next) => {
  try {
    await MessageForm.findByIdAndDelete(req.params.messageformId);
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "The messageform has been deleted",
    });
  } catch (error) {
    next(error);
  }
};

export const updatemessageform = async (req, res, next) => {
  try {
    const updatedMessageForm = await MessageForm.findByIdAndUpdate(
      req.params.messageformId,
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          topic: req.body.topic,
          message: req.body.message,
        },
      },
      { new: true }
    );
    res
      .status(200)
      .json({ success: true, statusCode: 200, message: "Message updated" });
  } catch (error) {
    next(error);
  }
};
