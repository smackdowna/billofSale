import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  getAllComments,
  getCommentById,
  postComment,
} from "../controllers/commentController.js";
const router = express.Router();

router.route("/getAllComments").get(isAuthenticated, getAllComments);
router.route("/postComment").post(postComment);
router.route("/comment/:id").get(isAuthenticated, getCommentById);
export default router;
