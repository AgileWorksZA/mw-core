import type { MetaFunction } from "react-router";
import { Link } from "react-router";

export const meta: MetaFunction = () => {
  return [
    { title: "MoneyWorks Dashboard" },
    { name: "description", content: "Enterprise accounting system interface" },
  ];
};

export default function Dashboard() {

  const features = [
    {
      title: "Tax Rates",
      description: "Manage tax rates, codes, and accounting configurations",
      href: "/tax-rates",
      color: "text-blue-600 dark:text-blue-400",
    },
  ];

  const stats = [
    { label: "Active Tax Rates", value: "12", icon: Receipt },
    { label: "Data Sync Status", value: "Live", icon: Database },
    { label: "API Version", value: "1.0", icon: Shield },
    { label: "Languages", value: "3", icon: Globe },
  ];

  return (
    <>
      <Navigation />
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            MoneyWorks Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Enterprise accounting system management interface
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border bg-card p-6 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <stat.icon className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md"
            >
              <div className="mb-4">
                <feature.icon className={`h-10 w-10 ${feature.color}`} />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                {feature.description}
              </p>
              <Link to={feature.href}>
                <Button variant="ghost" className="gap-2">
                  Open
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 rounded-lg border bg-muted/50 p-6">
          <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" asChild>
              <Link to="/tax-rates?action=new">Create Tax Rate</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/tools/evaluate">Test Expression</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/settings">Configure Settings</Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}