import { Link } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { FileCode, Ticket, Bot } from "lucide-react";

export default function Index() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">OpenAPI UI Generator</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        <Link to="/ide" className="block h-full">
          <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <FileCode className="h-8 w-8 text-primary" />
                <CardTitle>IDE</CardTitle>
              </div>
              <CardDescription>
                Build and manage UI components from OpenAPI specifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Access the integrated development environment to create, edit,
                and manage your API-driven UI components.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/tickets" className="block h-full">
          <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Ticket className="h-8 w-8 text-primary" />
                <CardTitle>Support Tickets</CardTitle>
              </div>
              <CardDescription>
                Manage MoneyWorks AI Assistant issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View and manage support tickets for API errors, feature
                requests, and user queries that need attention.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/chat" className="block h-full">
          <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Bot className="h-8 w-8 text-primary" />
                <CardTitle>MoneyWorks AI Chat</CardTitle>
              </div>
              <CardDescription>
                Chat with MoneyWorks AI Assistant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Get help with MoneyWorks accounting tasks, MWScript, reports,
                and more using live data access.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
