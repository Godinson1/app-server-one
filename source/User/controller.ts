import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { success, error, handleResponse } from "../utilities";
import db from "../models";

//Destructure status codes
const { OK, INTERNAL_SERVER_ERROR, NOT_FOUND, UNAUTHORIZED, BAD_REQUEST } =
  StatusCodes;

//Set User Model
const User = db.User;

/*
 * NAME - getAllUser
 * REQUEST METHOD - GET
 * AIM - Retrieve all users from database
 */
const getAllUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const data = await User.findAll({ order: [["id", "DESC"]] });
    return res.status(OK).json({
      status: success,
      message: "Users data retrieved successfully",
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
 * NAME - deleteAllUser
 * REQUEST METHOD - DELETE
 * AIM - Delete all users from database
 */
const deleteAllUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    await User.destroy({ where: {}, truncate: true });
    return res.status(OK).json({
      status: success,
      message: "Users data deleted successfully",
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

export { getAllUser, deleteAllUser };
