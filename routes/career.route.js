import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import {
  create,
  deletecareer,
  getcareers,
  updatecareer,
} from "../controllers/career.controller.js";
const router = express.Router();

router.post("/create", verifyToken, create);
router.get("/getcareers", getcareers);
router.delete("/deletecareer/:careerId/:userId", verifyToken, deletecareer);
router.put("/updatecareer/:careerId/:userId", verifyToken, updatecareer);

export default router;
