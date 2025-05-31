import { LinkService } from "../../services/tables/link.service";
import { linkObject } from "../../types/constants.eden";
import type { Link } from "../../types/interface/tables/link";
import { moneyworksRoute } from "./base/moneyworks.route";

export const linkRoutes = moneyworksRoute<Link, "Link", typeof linkObject>(
  "Link",
  linkObject,
  new LinkService(),
  {
    summary: "links",
    description: "",
    tags: ["System"],
  },
);
