import { MemoService } from "../../services/tables/memo.service";
import { memoObject } from "../../types/constants.eden";
import type { Memo } from "../../types/interface/tables/memo";
import { moneyworksRoute } from "./base/moneyworks.route";

export const memoRoutes = moneyworksRoute<Memo, "Memo", typeof memoObject>(
  "Memo",
  memoObject,
  new MemoService(),
  {
    summary: "Memos",
    description:
      "Stores dated memo entries and recall reminders associated with specific Name records (contacts/entities).",
    tags: ["CRM"],
  },
);
