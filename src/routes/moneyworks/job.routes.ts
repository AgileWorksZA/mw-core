import { JobService } from "../../services/tables/job.service";
import { jobObject } from "../../types/constants.eden";
import type { Job } from "../../types/interface/tables/job";
import { moneyworksRoute } from "./base/moneyworks.route";

export const jobRoutes = moneyworksRoute<Job, "Job", typeof jobObject>(
  "Job",
  jobObject,
  new JobService(),
  {
    summary: "Jobs",
    description: "Manages projects, cases, or work assignments with tracking for costs, time, and budgets.",
    tags: ["Project Management"],
  },
);