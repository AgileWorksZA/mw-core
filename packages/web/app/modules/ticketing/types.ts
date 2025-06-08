export interface Ticket {
  id: string;
  title: string;
  description: string;
  userQuery: string;
  aiResponse?: string;
  errorDetails?: string;
  category: TicketCategory;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  assignedTo?: string;
  resolution?: string;
  metadata?: Record<string, any>;
}

export type TicketCategory =
  | "api_error"
  | "missing_feature"
  | "unclear_query"
  | "data_issue"
  | "authentication"
  | "other"
  | "bug";

export type TicketStatus =
  | "new"
  | "in_progress"
  | "blocked"
  | "resolved"
  | "closed";

export type TicketPriority = "low" | "medium" | "high" | "critical";

export interface CreateTicketInput {
  title: string;
  description: string;
  userQuery: string;
  aiResponse?: string;
  errorDetails?: string;
  category: TicketCategory;
  priority?: TicketPriority;
  metadata?: Record<string, any>;
}

export interface UpdateTicketInput {
  status?: TicketStatus;
  priority?: TicketPriority;
  assignedTo?: string;
  resolution?: string;
  category?: TicketCategory;
}

export interface TicketFilters {
  status?: TicketStatus[];
  category?: TicketCategory[];
  priority?: TicketPriority[];
  assignedTo?: string;
  dateFrom?: string;
  dateTo?: string;
}
