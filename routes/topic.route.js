import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import {
  create,
  deletetopic,
  gettopics,
  updatetopic,
} from "../controllers/topic.controller.js";
const router = express.Router();

router.post("/create", verifyToken, create);
router.get("/gettopics", gettopics);
router.delete("/deletetopic/:topicId/:userId", verifyToken, deletetopic);
router.put("/updatetopic/:topicId/:userId", verifyToken, updatetopic);

export default router;
