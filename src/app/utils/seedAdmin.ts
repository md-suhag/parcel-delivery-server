import { envVars } from "../config/env";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcryptjs from "bcryptjs";

export const seedAdmin = async () => {
  try {
    const isAdminExist = await User.findOne({
      phone: envVars.ADMIN_PHONE,
    });

    if (isAdminExist) {
      console.log("System Admin Already Exists!");
      return;
    }

    console.log("Trying to create Admin...");

    const hashedPassword = await bcryptjs.hash(
      envVars.ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND)
    );

    const authProvider: IAuthProvider = {
      provider: "credentials",
      providerId: envVars.ADMIN_EMAIL,
    };
    const payload: IUser = {
      name: "System admin",
      role: Role.ADMIN,
      phone: envVars.ADMIN_PHONE,
      email: envVars.ADMIN_EMAIL,
      password: hashedPassword,
      address: envVars.ADMIN_ADDRESS,

      auths: [authProvider],
    };
    const admin = await User.create(payload);
    console.log("System admin created successfully! \n");
    console.log(admin);
  } catch (error) {
    console.log(error);
  }
};
