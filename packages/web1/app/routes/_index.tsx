import type { MetaFunction } from "react-router";
import { Link } from "react-router";
import { Navigation } from "~/components/navigation";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { ArrowRight, Receipt, Building2, Wrench, Settings } from "lucide-react";

export const meta: MetaFunction = () => {
  return [
    { title: "MoneyWorks Dashboard" },
    { name: "description", content: "Enterprise accounting system interface" },
  ];
};

export default function Dashboard() {
  const features = [
    {
      icon: Receipt,
      title: "Tax Rates",
      description: "Manage tax codes, rates, and configurations",
      href: "/tax-rates",
    },
    {
      icon: Building2,
      title: "Company",
      description: "View and edit company information",
      href: "/company",
    },
    {
      icon: Wrench,
      title: "Tools",
      description: "Evaluate MWScript expressions",
      href: "/tools/evaluate",
    },
    {
      icon: Settings,
      title: "Settings",
      description: "Configure application preferences",
      href: "/settings",
    },
  ];

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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.href} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <feature.icon className="h-8 w-8 text-primary mb-2" />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="ghost" className="w-full">
                  <Link to={feature.href}>
                    View <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
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