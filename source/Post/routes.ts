import express from "express";
import {
  getAllPost,
  deleteAllPost,
  createPost,
  getPost,
  likePost,
  deletePost,
  editPost,
} from "./index";
import { auth } from "../Authentication";
const router = express.Router();

router.get("/", getAllPost);
router.delete("/", deleteAllPost);
router.post("/post", createPost);
router.get("/post/:id", getPost);
router.get("/post/:id/like", likePost);
router.delete("/post/:id", deletePost);
router.put("/post/:id", editPost);

export { router };
