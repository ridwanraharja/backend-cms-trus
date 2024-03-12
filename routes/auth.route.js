import express from "express";
import {
  signin,
  signout,
  signup,
  verifyToken,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", signout);
router.post("/verify-token", verifyToken);

export default router;
