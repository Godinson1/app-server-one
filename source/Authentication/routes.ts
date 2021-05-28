import express from "express";
import passport from "passport";
import { loginUser, registerUser, googleCallback } from "./controller";

// initializong express router
const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/success#", googleCallback);
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/success",
    failureRedirect: "/login",
  })
);

export { router };
