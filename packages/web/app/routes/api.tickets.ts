import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { data as json } from "react-router";
// Use SQLite database
import { ticketingDB } from "~/modules/ticketing/db/schema.server";
import type {
  CreateTicketInput,
  UpdateTicketInput,
  TicketFilters,
} from "~/modules/ticketing/types";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const filters: TicketFilters = {};

  // Parse query parameters for filters
  const status = url.searchParams.getAll("status");
  if (status.length > 0) filters.status = status as any[];

  const category = url.searchParams.getAll("category");
  if (category.length > 0) filters.category = category as any[];

  const priority = url.searchParams.getAll("priority");
  if (priority.length > 0) filters.priority = priority as any[];

  const assignedTo = url.searchParams.get("assignedTo");
  if (assignedTo) filters.assignedTo = assignedTo;

  const dateFrom = url.searchParams.get("dateFrom");
  if (dateFrom) filters.dateFrom = dateFrom;

  const dateTo = url.searchParams.get("dateTo");
  if (dateTo) filters.dateTo = dateTo;

  // Get tickets and stats
  const tickets = ticketingDB.getTickets(filters);
  const stats = ticketingDB.getTicketStats();

  return json({ tickets, stats });
}

export async function action({ request }: ActionFunctionArgs) {
  const method = request.method;
  const formData = await request.formData();

  if (method === "POST") {
    // Create new ticket
    const data = Object.fromEntries(formData.entries());

    const input: CreateTicketInput = {
      title: data.title as string,
      description: data.description as string,
      userQuery: data.userQuery as string,
      aiResponse: (data.aiResponse as string) || undefined,
      errorDetails: (data.errorDetails as string) || undefined,
      category: data.category as any,
      priority: (data.priority as any) || undefined,
      metadata: data.metadata ? JSON.parse(data.metadata as string) : undefined,
    };

    const ticket = ticketingDB.createTicket(input);
    return json({ ticket });
  }

  return json({ error: "Method not allowed" }, { status: 405 });
}
