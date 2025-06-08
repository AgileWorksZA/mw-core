import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { data as json } from "react-router";
// Use SQLite database
import { ticketingDB } from "~/modules/ticketing/db/schema.server";
import type { UpdateTicketInput } from "~/modules/ticketing/types";

export async function loader({ params }: LoaderFunctionArgs) {
  const { id } = params;

  if (!id) {
    return json({ error: "Ticket ID is required" }, { status: 400 });
  }

  const ticket = ticketingDB.getTicket(id);

  if (!ticket) {
    return json({ error: "Ticket not found" }, { status: 404 });
  }

  return json({ ticket });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { id } = params;

  if (!id) {
    return json({ error: "Ticket ID is required" }, { status: 400 });
  }

  const method = request.method;

  if (method === "PATCH" || method === "PUT") {
    // Update ticket
    const formData = await request.formData();
    const data = Object.fromEntries(formData.entries());

    const input: UpdateTicketInput = {};

    if (data.status) input.status = data.status as any;
    if (data.priority) input.priority = data.priority as any;
    if (data.assignedTo) input.assignedTo = data.assignedTo as string;
    if (data.resolution) input.resolution = data.resolution as string;
    if (data.category) input.category = data.category as any;

    const ticket = ticketingDB.updateTicket(id, input);

    if (!ticket) {
      return json({ error: "Ticket not found" }, { status: 404 });
    }

    return json({ ticket });
  }

  return json({ error: "Method not allowed" }, { status: 405 });
}
