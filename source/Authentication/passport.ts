import passport from "passport";
import data from "passport-google-oauth20";
import { uniqueCode, jwtSignUser, sendAuthMail } from "./index";
import db from "../models";

const GoogleStrategy = data.Strategy;
const User = db.User;

passport.use(
  new GoogleStrategy(
    {
      clientID: `${process.env.GOOGLE_CLIENT_ID}`,
      clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
      callbackURL: `${process.env.GOOGLE_CALLBACK}`,
    },
    async (accessToken, refreshToken, profile, done) => {
      const profileData = profile._json;
      try {
        //Check if user already exist using google id.
        const alreadyExist = await User.findOne({
          where: { googleId: profile.id },
        });
        if (alreadyExist) {
          done(null, alreadyExist);
        } else {
          //If user does not exist, create new user.
          const newUser = await User.create({
            name: profileData.name,
            password: profileData.sub,
            email: profileData.email,
            handle: profileData.email,
            photoUrl: profileData.picture,
            code: uniqueCode(),
            googleId: profile.id,
            active: false,
          });
          const token = jwtSignUser(newUser);
          await sendAuthMail(
            newUser.code,
            profileData.email,
            profileData.given_name
          );
          done(null, alreadyExist);
        }
      } catch (err) {
        console.error(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findOne({ where: { googleId: id } });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
