import { JobSheetService } from "../../services/tables/job-sheet.service";
import { jobSheetObject } from "../../types/constants.eden";
import type { JobSheet } from "../../types/interface/tables/jobsheet";
import { moneyworksRoute } from "./base/moneyworks.route";

export const jobSheetRoutes = moneyworksRoute<
  JobSheet,
  "JobSheet",
  typeof jobSheetObject
>("JobSheet", jobSheetObject, new JobSheetService(), {
  summary: "Job Sheets",
  description:
    "Tracks individual time entries, expenses, and other billable items associated with jobs/projects.",
  tags: ["Project Management"],
});
