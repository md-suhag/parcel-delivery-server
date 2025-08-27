import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";

import { IAuthProvider, IUser } from "../user/user.interface";
import bcryptjs from "bcryptjs";
import { envVars } from "../../config/env";
import { User } from "../user/user.model";
import { createNewAcccessTokenWithRefreshToken } from "../../utils/userTokens";

const register = async (payload: Partial<IUser>) => {
  const { phone, password, role, ...rest } = payload;

  const isUserExist = await User.findOne({ phone });

  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist");
  }
  if (!password) {
    throw new AppError(httpStatus.BAD_REQUEST, "Please provide password");
  }

  const hashedPassword = await bcryptjs.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: phone as string,
  };

  const user = await User.create({
    phone,
    password: hashedPassword,
    auths: [authProvider],
    role,
    ...rest,
  });
  user.password = undefined;
  return user;
};

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAcccessTokenWithRefreshToken(
    refreshToken
  );
  return {
    accessToken: newAccessToken,
  };
};
export const AuthService = {
  register,
  getNewAccessToken,
};
