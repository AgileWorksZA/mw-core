import { useState, useCallback } from "react";
import { useLoaderData, useFetcher, Outlet, Link } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { data as json } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Calendar,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Filter,
  MessageCircleQuestionIcon,
  Bug,
  Lightbulb,
  HelpCircle,
  Database,
  Key,
  MoreHorizontal,
  User,
  ChevronRight,
} from "lucide-react";
import type {
  Ticket,
  TicketStatus,
  TicketCategory,
  TicketPriority,
} from "~/modules/ticketing/types";
// Simple date formatting function
function formatDistanceToNow(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `${diffDays} days ago`;
  if (diffHours > 0) return `${diffHours} hours ago`;
  if (diffMins > 0) return `${diffMins} minutes ago`;
  return "just now";
}

export async function loader({ request }: LoaderFunctionArgs) {
  // Dynamically import the database module to ensure it only runs on the server
  const { ticketingDB } = await import("~/modules/ticketing/db/schema.server");
  const tickets = ticketingDB.getTickets();
  const stats = ticketingDB.getTicketStats();

  return json({ tickets, stats });
}

const statusColumns: {
  status: TicketStatus;
  label: string;
  icon: any;
  color: string;
}[] = [
  { status: "new", label: "New", icon: AlertCircle, color: "bg-blue-500" },
  {
    status: "in_progress",
    label: "In Progress",
    icon: Clock,
    color: "bg-yellow-500",
  },
  { status: "blocked", label: "Blocked", icon: XCircle, color: "bg-red-500" },
  {
    status: "resolved",
    label: "Resolved",
    icon: CheckCircle2,
    color: "bg-green-500",
  },
];

export const categoryIcons: Record<TicketCategory, any> = {
  api_error: Bug,
  missing_feature: Lightbulb,
  unclear_query: HelpCircle,
  data_issue: Database,
  authentication: Key,
  other: MoreHorizontal,
  bug: Bug,
};

export const priorityColors: Record<TicketPriority, string> = {
  low: "bg-gray-500",
  medium: "bg-blue-500",
  high: "bg-orange-500",
  critical: "bg-red-500",
};

export default function TicketsPage() {
  const { tickets, stats } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [filterCategory, setFilterCategory] = useState<TicketCategory | "all">(
    "all",
  );
  const [filterPriority, setFilterPriority] = useState<TicketPriority | "all">(
    "all",
  );

  const handleStatusChange = useCallback(
    (ticketId: string, newStatus: TicketStatus) => {
      fetcher.submit(
        { status: newStatus },
        { method: "PATCH", action: `/api/tickets/${ticketId}` },
      );
    },
    [fetcher],
  );

  const filteredTickets = tickets.filter((ticket) => {
    if (filterCategory !== "all" && ticket.category !== filterCategory)
      return false;
    if (filterPriority !== "all" && ticket.priority !== filterPriority)
      return false;
    return true;
  });

  const ticketsByStatus = statusColumns.reduce(
    (acc, col) => {
      acc[col.status] = filteredTickets.filter((t) => t.status === col.status);
      return acc;
    },
    {} as Record<TicketStatus, Ticket[]>,
  );
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Support Tickets</h1>
        <p className="text-muted-foreground">
          Manage MoneyWorks AI Assistant issues and feature requests
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">New Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.byStatus.new || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.byStatus.in_progress || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.byStatus.resolved || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters:</span>
        </div>

        <select
          value={filterCategory}
          onChange={(e) =>
            setFilterCategory(e.target.value as TicketCategory | "all")
          }
          className="px-3 py-1 text-sm border rounded-md"
        >
          <option value="all">All Categories</option>
          <option value="api_error">API Errors</option>
          <option value="missing_feature">Missing Features</option>
          <option value="unclear_query">Unclear Queries</option>
          <option value="data_issue">Data Issues</option>
          <option value="authentication">Authentication</option>
          <option value="other">Other</option>
        </select>

        <select
          value={filterPriority}
          onChange={(e) =>
            setFilterPriority(e.target.value as TicketPriority | "all")
          }
          className="px-3 py-1 text-sm border rounded-md"
        >
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statusColumns.map((column) => {
          const StatusIcon = column.icon;
          const columnTickets = ticketsByStatus[column.status] || [];

          return (
            <div key={column.status} className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <StatusIcon className="h-5 w-5" />
                <h3 className="font-semibold">{column.label}</h3>
                <Badge variant="secondary" className="ml-auto">
                  {columnTickets.length}
                </Badge>
              </div>

              <ScrollArea className="h-[600px]">
                <div className="space-y-3 pr-4">
                  {columnTickets.map((ticket) => {
                    console.log("ticket", ticket);
                    const CategoryIcon =
                      categoryIcons[ticket.category] ||
                      MessageCircleQuestionIcon;

                    return (
                      <Link key={ticket.id} to={`/tickets/${ticket.id}`}>
                        <Card
                          key={ticket.id}
                          className="cursor-pointer hover:shadow-md transition-shadow"
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2">
                                <CategoryIcon className="h-4 w-4 text-muted-foreground" />
                                <Badge
                                  variant="outline"
                                  className={`${priorityColors[ticket.priority]} text-white`}
                                >
                                  {ticket.priority}
                                </Badge>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                #{ticket.id.slice(0, 8)}
                              </span>
                            </div>
                            <h4 className="font-medium text-sm mt-2 line-clamp-2">
                              {ticket.title}
                            </h4>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                              {ticket.description}
                            </p>

                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDistanceToNow(
                                  new Date(ticket.createdAt),
                                )}
                              </div>
                              {ticket.assignedTo && (
                                <div className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {ticket.assignedTo}
                                </div>
                              )}
                            </div>

                            {column.status !== ticket.status && (
                              <div className="mt-3 flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-full text-xs"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusChange(
                                      ticket.id,
                                      column.status,
                                    );
                                  }}
                                >
                                  Move to {column.label}
                                  <ChevronRight className="h-3 w-3 ml-1" />
                                </Button>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          );
        })}
      </div>

      <Outlet />
    </div>
  );
}

// Ticket Details Modal Component
