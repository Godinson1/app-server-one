import jwt from "jsonwebtoken";
import { IUser } from "../Model/interface";
import nodemailer from "nodemailer";
import { welcomeBody, welcomeHeader, GMAIL } from "./index";

const jwtSignUser = (user: IUser): string => {
  const ONE_WEEK = 60 * 60 * 24 * 7;
  const { id, name, email, handle } = user;
  const userData = { id, name, email, handle };
  return jwt.sign(userData, `${process.env.jwt_secret}`, {
    expiresIn: ONE_WEEK,
  });
};

const uniqueCode = (): number => {
  return Math.floor(100000 + Math.random() * 900000);
};

const sendAuthMail = (code: number, email: string, firstName: string): void => {
  const transporter = nodemailer.createTransport({
    service: GMAIL,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: welcomeHeader(),
    html: welcomeBody(code, firstName),
  };

  transporter.sendMail(mailOptions, (error: any, info: any) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

export { sendAuthMail, jwtSignUser, uniqueCode };
