import { UserService } from "../../services/tables/user.service";
import { userObject } from "../../types/constants.eden";
import type { User } from "../../types/interface/tables/user";
import { moneyworksRoute } from "./base/moneyworks.route";

export const userRoutes = moneyworksRoute<User, "User", typeof userObject>(
  "User",
  userObject,
  new UserService(),
  {
    summary: "Users",
    description:
      "Provides a simple key-value storage table (string key, string data) for use by scripts or plug-ins.",
    tags: ["System"],
  },
);
