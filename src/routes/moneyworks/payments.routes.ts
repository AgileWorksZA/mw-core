import { PaymentsService } from "../../services/tables/payments.service";
import { paymentsObject } from "../../types/constants.eden";
import type { Payments } from "../../types/interface/tables/payments";
import { moneyworksRoute } from "./base/moneyworks.route";

export const paymentsRoutes = moneyworksRoute<Payments, "Payments", typeof paymentsObject>(
  "Payments",
  paymentsObject,
  new PaymentsService(),
  {
    summary: "paymentss",
    description: "",
    tags: ["System"],
  },
);
