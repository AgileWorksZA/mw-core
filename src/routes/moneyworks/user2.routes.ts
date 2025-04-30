import { User2Service } from "../../services/tables/user2.service";
import { user2Object } from "../../types/constants.eden";
import type { User2 } from "../../types/interface/tables/user2";
import { moneyworksRoute } from "./base/moneyworks.route";

export const user2Routes = moneyworksRoute<User2, "User2", typeof user2Object>(
  "User2",
  user2Object,
  new User2Service(),
  {
    summary: "user2s",
    description: "",
    tags: ["System"],
  },
);
