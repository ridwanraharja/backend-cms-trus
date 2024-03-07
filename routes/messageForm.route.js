import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import {
  create,
  deletemessageform,
  getmessageforms,
  updatemessageform,
} from "../controllers/messageForm.controller.js";
const router = express.Router();

router.post("/create", create);
router.get("/getmessageforms", getmessageforms);
router.delete("/deletemessageform/:messageformId", deletemessageform);
router.put("/updatemessageform/:messageformId", updatemessageform);

export default router;
