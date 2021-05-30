import { router } from "./routes";
import { welcomeBody, welcomeHeader, GMAIL } from "./data";
import { sendAuthMail, jwtSignUser, uniqueCode } from "./helpers";
import { auth } from "./middleware";

export {
  router,
  welcomeHeader,
  welcomeBody,
  GMAIL,
  sendAuthMail,
  jwtSignUser,
  uniqueCode,
  auth,
};
