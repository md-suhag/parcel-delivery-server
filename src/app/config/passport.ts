/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";

import { User } from "../modules/user/user.model";
import { IsActive } from "../modules/user/user.interface";
import { Strategy as LocalStrategy } from "passport-local";
import bcryptjs from "bcryptjs";

passport.use(
  new LocalStrategy(
    {
      usernameField: "phone",
      passwordField: "password",
    },
    async (phone: string, password: string, done) => {
      try {
        const isUserExist = await User.findOne({ phone });
        if (!isUserExist) {
          return done("User does not exist");
        }

        if (!isUserExist.isVerified) {
          return done("User is not verified");
        }

        if (
          isUserExist.isActive === IsActive.BLOCKED ||
          isUserExist.isActive === IsActive.INACTIVE
        ) {
          return done(`User is ${isUserExist.isActive}`);
        }
        if (isUserExist.isDeleted) {
          return done("User is deleted");
        }
        const isGoogleAuthenticated = isUserExist.auths.some(
          (providerObjects) => providerObjects.provider == "google"
        );
        if (isGoogleAuthenticated && !isUserExist.password) {
          return done(null, false, {
            message:
              "You have auhthenticated through Google. So if you want to login with credentials, then at first login with google and set a password for your Gmail and then you can login with email and password",
          });
        }
        const ispasswordMatched = await bcryptjs.compare(
          password,
          isUserExist?.password as string
        );
        if (!ispasswordMatched) {
          return done(null, false, { message: "Password does not match" });
        }

        return done(null, isUserExist);
      } catch (error) {
        console.log(error);
        done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.log(error);
    done(error);
  }
});
