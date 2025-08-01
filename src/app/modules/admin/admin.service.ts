import AppError from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { IsActive } from "../user/user.interface";

import { User } from "../user/user.model";
import httpStatus from "http-status-codes";

const getAllUsers = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(User.find(), query);

  const users = await queryBuilder.exclude(["password"]).paginate();

  const [data, meta] = await Promise.all([
    users.build(),
    queryBuilder.getMeta(),
  ]);
  return {
    data,
    meta,
  };
};

const blockUser = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  if (user.isActive === IsActive.BLOCKED) {
    throw new AppError(httpStatus.BAD_REQUEST, "User aready blocked");
  }
  await User.findByIdAndUpdate(
    userId,
    {
      isActive: IsActive.BLOCKED,
    },
    { runValidators: true }
  );

  return null;
};
const unBlockUser = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  if (user.isActive === IsActive.ACTIVE) {
    throw new AppError(httpStatus.BAD_REQUEST, "User aready active");
  }
  await User.findByIdAndUpdate(
    userId,
    {
      isActive: IsActive.ACTIVE,
    },
    { runValidators: true }
  );

  return null;
};

export const AdminService = {
  getAllUsers,
  blockUser,
  unBlockUser,
};
