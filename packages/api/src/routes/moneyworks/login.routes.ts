import { LoginService } from "../../services/tables/login.service";
import { loginObject } from "../../types/constants.eden";
import type { Login } from "../../types/interface/tables/login";
import { moneyworksRoute } from "./base/moneyworks.route";

export const loginRoutes = moneyworksRoute<Login, "Login", typeof loginObject>(
  "Login",
  loginObject,
  new LoginService(),
  {
    summary: "Logins",
    description: "Manages user login accounts, including initials, names, encrypted passwords, security levels, and assigned privileges (Gold/Datacentre only).",
    tags: ["System"],
  },
);
