import type { MetaFunction } from "react-router";
import { Link } from "react-router";
import { Navigation } from "~/components/navigation";
import { AuthGuard } from "~/components/auth-guard";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { ArrowRight, Receipt, Building2, Wrench, Settings, Database, Plus } from "lucide-react";
import { useConnection } from "~/contexts/connection-context";
import { Alert, AlertDescription } from "~/components/ui/alert";

export const meta: MetaFunction = () => {
  return [
    { title: "MoneyWorks Dashboard" },
    { name: "description", content: "Enterprise accounting system interface" },
  ];
};

export default function Dashboard() {
  return (
    <AuthGuard requireConnection={false}>
      <DashboardContent />
    </AuthGuard>
  );
}

function DashboardContent() {
  const { connections, isLoading } = useConnection();
  
  const features = [
    {
      icon: Receipt,
      title: "Tax Rates",
      description: "Manage tax codes, rates, and configurations",
      href: "/tax-rates",
      requiresConnection: true,
    },
    {
      icon: Building2,
      title: "Company",
      description: "View and edit company information",
      href: "/company",
      requiresConnection: true,
    },
    {
      icon: Wrench,
      title: "Tools",
      description: "Evaluate MWScript expressions",
      href: "/tools/evaluate",
      requiresConnection: true,
    },
    {
      icon: Settings,
      title: "Settings",
      description: "Configure application preferences",
      href: "/settings",
      requiresConnection: false,
    },
  ];

  const hasConnections = !isLoading && connections.length > 0;

  return (
    <>
      <Navigation />
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome to MoneyWorks
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Manage your enterprise accounting data with ease
          </p>
        </div>

        {!hasConnections && !isLoading && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <Database className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>
                No MoneyWorks connections found. Set up a connection to access all features.
              </span>
              <Button asChild size="sm" className="ml-4">
                <Link to="/onboarding">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Connection
                </Link>
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const isDisabled = feature.requiresConnection && !hasConnections;
            
            return (
              <Card 
                key={feature.href} 
                className={isDisabled ? "opacity-60" : "hover:shadow-lg transition-shadow"}
              >
                <CardHeader>
                  <feature.icon className={`h-8 w-8 mb-2 ${isDisabled ? "text-muted-foreground" : "text-primary"}`} />
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {isDisabled ? (
                    <Button variant="ghost" className="w-full" disabled>
                      Connection Required
                    </Button>
                  ) : (
                    <Button asChild variant="ghost" className="w-full">
                      <Link to={feature.href}>
                        View <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 rounded-lg border bg-muted/50 p-8">
          <h2 className="text-2xl font-semibold mb-4">Quick Stats</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Total Tax Rates</p>
              <p className="text-2xl font-bold">10</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Users</p>
              <p className="text-2xl font-bold">1</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">API Status</p>
              <p className="text-2xl font-bold text-green-600">Online</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}