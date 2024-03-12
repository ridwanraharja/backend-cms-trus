import Career from "../models/career.model.js";
import { errorHandler } from "../utils/error.js";

export const create = async (req, res, next) => {
  if (
    (!req.body.title || !req.body.content,
    !req.body.city,
    !req.body.country,
    !req.body.link)
  ) {
    return next(errorHandler(400, "Please provide all required fields"));
  }

  const newCareer = new Career({
    ...req.body,
    userId: req.user.id,
  });
  try {
    const savedCareer = await newCareer.save();
    res
      .status(201)
      .json({ success: true, statusCode: 201, message: "Career created" });
  } catch (error) {
    next(error);
  }
};

export const getcareers = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const careers = await Career.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.careerId && { _id: req.query.careerId }),
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

    const totalCareers = await Career.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthCareers = await Career.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      careers,
      totalCareers,
      lastMonthCareers,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export const deletecareer = async (req, res, next) => {
  try {
    await Career.findByIdAndDelete(req.params.careerId);
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "The career has been deleted",
    });
  } catch (error) {
    next(error);
  }
};

export const updatecareer = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this career"));
  }
  try {
    const updatedCareer = await Career.findByIdAndUpdate(
      req.params.careerId,
      {
        $set: {
          title: req.body.title,
          city: req.body.city,
          country: req.body.country,
          link: req.body.link,
        },
      },
      { new: true }
    );
    res
      .status(200)
      .json({ success: true, statusCode: 200, message: "Career updated" });
  } catch (error) {
    next(error);
  }
};
