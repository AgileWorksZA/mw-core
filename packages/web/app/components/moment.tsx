import moment from "moment";
import { ClientOnly } from "./client-only";

export default function Moment({ date }: { date?: string | Date }) {
  if (!date) {
    return <span className="text-gray-500">No date provided</span>;
  }
  return <ClientOnly>{moment(date).format("YYYY-MM-DD")}</ClientOnly>;
}
