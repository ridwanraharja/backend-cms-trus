import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    next(errorHandler(400, "All fields are required"));
    return;
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.json({
      success: true,
      statusCode: 201,
      message: "User created successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    next(errorHandler(400, "All fields are required"));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid password"));
    }
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

    const { password: pass, ...rest } = validUser._doc;

    res.status(200).json({ ...rest, token, success: true });
  } catch (error) {
    next(error);
  }
};

export const signout = (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json({ success: true, message: "User signed out successfully" });
  } catch (error) {
    next(error);
  }
};

export const verifyToken = (req, res, next) => {
  const validationReq = req;
  const { authorization } = validationReq.headers;

  if (!authorization) {
    return res.status(401).json({
      statusCode: 401,
      message: "Token diperlukan",
    });
  }

  const token = authorization.split(" ")[1];
  const secret = process.env.JWT_SECRET;

  try {
    const jwtDecode = jwt.verify(token, secret);

    if (typeof jwtDecode !== "string") {
      validationReq.user = jwtDecode;
    }
  } catch (error) {
    return res.status(401).json({
      statusCode: 401,
      message: "Unauthorized",
    });
  }
  return res.status(200).json({
    success: true,
    statusCode: 200,
    message: "User authorized",
  });
};
