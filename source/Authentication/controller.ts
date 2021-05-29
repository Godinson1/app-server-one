import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Op } from "sequelize";
import { success, error, handleResponse, PHOTO_URL } from "../utilities";
import { jwtSignUser, sendAuthMail, uniqueCode } from "./index";
import { validateLogin, validateReg } from "../validation";
import bcrypt from "bcryptjs";
import db from "../models";
import { IUser } from "../Model/interface";

//Destructure status codes
const {
  OK,
  INTERNAL_SERVER_ERROR,
  CREATED,
  NOT_FOUND,
  UNAUTHORIZED,
  BAD_REQUEST,
} = StatusCodes;

//Set User Model
const User = db.User;

/*
 * NAME - registerUser
 * REQUEST METHOD - POST
 * AIM - Securely register user with provided details.
 */
const registerUser = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const { email, name, phone, handle, password } = req.body;

    //Validate user data
    const { errors, valid } = validateReg({
      email,
      name,
      handle,
      password,
    });
    if (!valid)
      return res.status(BAD_REQUEST).json({
        status: error,
        message: errors,
      });

    //Check if user already exist using either email or handle.
    const alreadyExist = await User.findOne({
      where: {
        [Op.or]: [{ email }, { handle }, { phone }],
      },
    });
    if (alreadyExist)
      return handleResponse(
        res,
        error,
        BAD_REQUEST,
        `User with email/handle/phone already exist`
      );

    //If user does not exist, create new user.
    const newUser = await User.create({
      name,
      phone,
      password,
      email,
      handle,
      photoUrl: PHOTO_URL,
      code: uniqueCode(),
      active: false,
    });

    const token = jwtSignUser(newUser);
    await sendAuthMail(newUser.code, email, name.split(" ")[0]);
    return res.status(CREATED).json({
      status: success,
      token,
      message: "Successfully registered",
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
 * NAME - loginUser
 * REQUEST METHOD - POST
 * AIM - Securely sign in user with provided credentials.
 */
const loginUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { data, password } = req.body;

    //Validate users data.
    const { errors, valid } = validateLogin({
      data,
      password,
    });
    if (!valid)
      return res.status(BAD_REQUEST).json({
        status: error,
        message: errors,
      });

    //Check if user exist using data provided (email or handle).
    const userData = await User.findOne({
      where: {
        [Op.or]: [{ email: data }, { handle: data }, { phone: data }],
      },
    });
    if (!userData)
      return handleResponse(
        res,
        error,
        NOT_FOUND,
        `User with ${data} does not exist`
      );

    //Compare passwords and validate user.
    const isMatched = await bcrypt.compare(password, userData.password);
    if (!isMatched)
      return handleResponse(res, error, BAD_REQUEST, "Invalid Credentials");

    //Sign user in using jwt which return token.
    const token = jwtSignUser(userData);
    return res.status(OK).json({
      status: success,
      token,
      message: "Successfully Signed in",
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
 * NAME - login with Google
 * REQUEST METHOD - GET
 * AIM - Securely create or sign in user google account.
 */
const googleCallback = (req: Request, res: Response) => {
  try {
    const token = jwtSignUser(req.user as IUser);
    res.redirect(`http://localhost:3000?t=${token}`);
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

export { loginUser, registerUser, googleCallback };
