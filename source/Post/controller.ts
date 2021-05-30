import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { success, error, handleResponse } from "../utilities";
import { mychannel } from "../server";
import db from "../models";

//Destructure status codes
const { OK, INTERNAL_SERVER_ERROR, NOT_FOUND, UNAUTHORIZED, BAD_REQUEST } =
  StatusCodes;

//Set Post Model
const Post = db.Post;

/*
 * NAME - getAllPost
 * REQUEST METHOD - GET
 * AIM - Retrieve all posts from database
 */
const getAllPost = async (req: Request, res: Response): Promise<Response> => {
  try {
    const data = await Post.findAll({ order: [["id", "DESC"]] });
    return res.status(OK).json({
      status: success,
      message: "Posts retrieved successfully",
      data,
    });
  } catch (err) {
    console.log(err);
    return handleResponse(
      res,
      error,
      INTERNAL_SERVER_ERROR,
      "Something went wrong"
    );
  }
};

/*
 * NAME - getPost
 * REQUEST METHOD - GET
 * AIM - Get single post
 */
const getPost = async (req: Request, res: Response): Promise<Response> => {
  try {
    const post = await Post.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!post) return handleResponse(res, error, NOT_FOUND, "Post not found");
    return res.status(OK).json({
      status: success,
      message: "Post retrieved successfully",
      data: post,
    });
  } catch (err) {
    console.log(err);
    return handleResponse(
      res,
      error,
      INTERNAL_SERVER_ERROR,
      "Something went wrong"
    );
  }
};

/*
 * NAME - createPost
 * REQUEST METHOD - POST
 * AIM - Create new post
 */
const createPost = async (req: Request, res: Response): Promise<Response> => {
  const { content, photoUrl } = req.body;
  try {
    const data = await Post.create({
      name: "some name",
      content,
      likes: 0,
      photoUrl,
      handle: "hello",
    });
    mychannel.sendToQueue("create_post", Buffer.from(JSON.stringify(data)));
    return res.status(OK).json({
      status: success,
      message: "Post created successfully",
      data,
    });
  } catch (err) {
    console.log(err);
    return handleResponse(
      res,
      error,
      INTERNAL_SERVER_ERROR,
      "Something went wrong"
    );
  }
};

/*
 * NAME - editPost
 * REQUEST METHOD - PUT
 * AIM - Edit existing post
 */
const editPost = async (req: Request, res: Response): Promise<Response> => {
  const { content, photoUrl } = req.body;
  let post;
  try {
    post = await Post.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!post) return handleResponse(res, error, NOT_FOUND, "Post not found");
    post.content = content;
    post.photoUrl = photoUrl;
    const data = await post.save();
    mychannel.sendToQueue("update_post", Buffer.from(JSON.stringify(data)));
    return res.status(OK).json({
      status: success,
      message: "Post updated successfully",
      data,
    });
  } catch (err) {
    console.log(err);
    return handleResponse(
      res,
      error,
      INTERNAL_SERVER_ERROR,
      "Something went wrong"
    );
  }
};

/*
 * NAME - deletePost
 * REQUEST METHOD - DELETE
 * AIM - Delete single post
 */
const deletePost = async (req: Request, res: Response): Promise<Response> => {
  try {
    const post = await Post.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!post) return handleResponse(res, error, NOT_FOUND, "Post not found");
    await post.destroy();
    mychannel.sendToQueue(
      "delete_post",
      Buffer.from(JSON.stringify(req.params.id))
    );
    return res.status(OK).json({
      status: success,
      message: "Post deleted successfully",
    });
  } catch (err) {
    console.log(err);
    return handleResponse(
      res,
      error,
      INTERNAL_SERVER_ERROR,
      "Something went wrong"
    );
  }
};

/*
 * NAME - deleteAllPost
 * REQUEST METHOD - DELETE
 * AIM - Delete all post from database
 */
const deleteAllPost = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    await Post.destroy({ where: {}, truncate: true });
    return res.status(OK).json({
      status: success,
      message: "Posts deleted successfully",
    });
  } catch (err) {
    console.log(err);
    return handleResponse(
      res,
      error,
      INTERNAL_SERVER_ERROR,
      "Something went wrong"
    );
  }
};

/*
 * NAME - editPost
 * REQUEST METHOD - GET
 * AIM - Edit existing post
 */
const likePost = async (req: Request, res: Response): Promise<Response> => {
  let post;
  try {
    post = await Post.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!post) return handleResponse(res, error, NOT_FOUND, "Post not found");
    post.likes++;
    const data = await post.save();
    return res.status(OK).json({
      status: success,
      message: "Post liked successfully",
      data,
    });
  } catch (err) {
    console.log(err);
    return handleResponse(
      res,
      error,
      INTERNAL_SERVER_ERROR,
      "Something went wrong"
    );
  }
};

export {
  getAllPost,
  deleteAllPost,
  createPost,
  editPost,
  deletePost,
  likePost,
  getPost,
};
