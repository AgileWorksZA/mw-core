import { DetailService } from "../../services/tables/detail.service";
import { detailObject } from "../../types/constants.eden";
import type { Detail } from "../../types/interface/tables/detail";
import { moneyworksRoute } from "./base/moneyworks.route";

export const detailRoutes = moneyworksRoute<Detail, "Detail", typeof detailObject>(
  "Detail",
  detailObject,
  new DetailService(),
  {
    summary: "Details",
    description: "Stores individual line items (details) for each transaction, linking back to the parent Transaction record. Note: This endpoint is deprecated and will be removed in a future release.",
    tags: ["Transaction"],
  },
);
