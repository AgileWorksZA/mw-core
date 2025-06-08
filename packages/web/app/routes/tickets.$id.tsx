import type { Ticket, TicketStatus } from "~/modules/ticketing/types";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { XCircle } from "lucide-react";
import { categoryIcons, priorityColors } from "./tickets";
import {
  useFetcher,
  useNavigate,
  useParams,
  useRouteLoaderData,
} from "react-router";
import { useCallback } from "react";

export default function TicketDetailsModal() {
  const id = useParams().id;
  const { tickets } = useRouteLoaderData("routes/tickets");
  const ticket = (tickets as Ticket[]).find((t) => t.id === id) as Ticket;
  const CategoryIcon = categoryIcons[ticket.category];
  const navigate = useNavigate();
  const onClose = () => {
    navigate(-1);
  };
  const fetcher = useFetcher();
  const handleStatusChange = useCallback(
    (ticketId: string, newStatus: TicketStatus) => {
      fetcher.submit(
        { status: newStatus },
        { method: "PATCH", action: `/api/tickets/${ticketId}` },
      );
    },
    [fetcher],
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-auto">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold">{ticket.title}</h2>
              <div className="flex items-center gap-2 mt-2">
                <CategoryIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {ticket.category
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </span>
                <Badge
                  variant="outline"
                  className={`${priorityColors[ticket.priority]} text-white`}
                >
                  {ticket.priority}
                </Badge>
                <Badge variant="outline">
                  {ticket.status
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </Badge>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <XCircle className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-1">Description</h3>
            <p className="text-sm text-muted-foreground">
              {ticket.description}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-1">User Query</h3>
            <div className="p-3 bg-muted rounded-md">
              <p className="text-sm">{ticket.userQuery}</p>
            </div>
          </div>

          {ticket.aiResponse && (
            <div>
              <h3 className="font-semibold mb-1">AI Response</h3>
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm">{ticket.aiResponse}</p>
              </div>
            </div>
          )}

          {ticket.errorDetails && (
            <div>
              <h3 className="font-semibold mb-1">Error Details</h3>
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-md">
                <pre className="text-xs text-red-600 dark:text-red-400 whitespace-pre-wrap">
                  {ticket.errorDetails}
                </pre>
              </div>
            </div>
          )}

          {ticket.resolution && (
            <div>
              <h3 className="font-semibold mb-1">Resolution</h3>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
                <p className="text-sm">{ticket.resolution}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Created:</span>
              <span className="ml-2">
                {new Date(ticket.createdAt).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Updated:</span>
              <span className="ml-2">
                {new Date(ticket.updatedAt).toLocaleString()}
              </span>
            </div>
            {ticket.resolvedAt && (
              <div>
                <span className="text-muted-foreground">Resolved:</span>
                <span className="ml-2">
                  {new Date(ticket.resolvedAt).toLocaleString()}
                </span>
              </div>
            )}
            {ticket.assignedTo && (
              <div>
                <span className="text-muted-foreground">Assigned to:</span>
                <span className="ml-2">{ticket.assignedTo}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            {ticket.status !== "resolved" && (
              <Button
                variant="default"
                size="sm"
                onClick={() => handleStatusChange(ticket.id, "resolved")}
              >
                Mark as Resolved
              </Button>
            )}
            {ticket.status === "new" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange(ticket.id, "in_progress")}
              >
                Start Working
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
