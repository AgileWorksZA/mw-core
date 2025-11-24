import {
	Calendar,
	Check,
	Cloud,
	Database,
	Edit,
	MoreVertical,
	Plus,
	RefreshCw,
	Server,
	Trash2,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { AuthGuard } from "~/components/auth-guard";
import { Navigation } from "~/components/navigation";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Skeleton } from "~/components/ui/skeleton";
import { useConnection } from "~/contexts/connection-context";
import { useAuth } from "~/hooks/use-auth";

export default function Connections() {
	return (
		<AuthGuard>
			<ConnectionsContent />
		</AuthGuard>
	);
}

function ConnectionsContent() {
	const { userId } = useAuth();
	const {
		connections,
		currentConnection,
		isLoading,
		error,
		refreshConnections,
		setCurrentConnection,
	} = useConnection();
	const [isDeleting, setIsDeleting] = useState<string | null>(null);

	const handleSetDefault = async (connectionId: string) => {
		try {
			const formData = new FormData();
			formData.append("_action", "update");
			formData.append("clerk_user_id", userId || "");
			formData.append("id", connectionId);
			formData.append("is_default", "true");

			const response = await fetch("/api/connections", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				throw new Error("Failed to update");
			}

			await refreshConnections();
			toast.success("Default connection updated");
		} catch (err) {
			toast.error("Failed to update default connection");
		}
	};

	const handleDelete = async (connectionId: string) => {
		if (!confirm("Are you sure you want to delete this connection?")) return;

		setIsDeleting(connectionId);
		try {
			const formData = new FormData();
			formData.append("_action", "delete");
			formData.append("clerk_user_id", userId || "");
			formData.append("id", connectionId);

			const response = await fetch("/api/connections", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				throw new Error("Failed to delete");
			}

			await refreshConnections();
			toast.success("Connection deleted");
		} catch (err) {
			toast.error("Failed to delete connection");
		} finally {
			setIsDeleting(null);
		}
	};

	return (
		<>
			<Navigation />
			<main className="container py-8">
				<div className="mb-8 flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">
							MoneyWorks Connections
						</h1>
						<p className="text-muted-foreground mt-2">
							Manage your MoneyWorks server connections
						</p>
					</div>
					<div className="flex gap-2">
						<Button asChild variant="outline">
							<Link to="/connections/now/new">
								<Cloud className="mr-2 h-4 w-4" />
								Connect to NOW
							</Link>
						</Button>
						<Button asChild>
							<Link to="/connections/new">
								<Plus className="mr-2 h-4 w-4" />
								Add Data Centre
							</Link>
						</Button>
					</div>
				</div>

				{error && (
					<Alert variant="destructive" className="mb-6">
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}

				{isLoading ? (
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{[...Array(3)].map((_, i) => (
							<Skeleton key={i} className="h-48" />
						))}
					</div>
				) : connections.length === 0 ? (
					<Card className="text-center py-12">
						<CardContent>
							<Database className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
							<h3 className="text-lg font-semibold mb-2">No connections yet</h3>
							<p className="text-muted-foreground mb-4">
								Add your first MoneyWorks connection to get started
							</p>
							<Button asChild>
								<Link to="/connections/new">
									<Plus className="mr-2 h-4 w-4" />
									Add Connection
								</Link>
							</Button>
						</CardContent>
					</Card>
				) : (
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{connections.map((connection) => (
							<Card
								key={connection.id}
								className={cn(
									"relative transition-all",
									currentConnection?.id === connection.id &&
										"ring-2 ring-primary",
								)}
							>
								{connection.is_default && (
									<div className="absolute top-2 right-2">
										<span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
											Default
										</span>
									</div>
								)}

								<CardHeader className="pb-3">
									<CardTitle className="flex items-center gap-2">
										{connection.connection_type === "now" ? (
											<Cloud className="h-5 w-5" />
										) : (
											<Database className="h-5 w-5" />
										)}
										{connection.connection_name}
									</CardTitle>
									<CardDescription className="flex items-center gap-2 text-xs">
										<Server className="h-3 w-3" />
										{connection.mw_host}:{connection.mw_port}
										{connection.connection_type === "now" && (
											<span className="ml-2 text-primary">(NOW)</span>
										)}
									</CardDescription>
								</CardHeader>

								<CardContent>
									<dl className="space-y-2 text-sm">
										<div className="flex justify-between">
											<dt className="text-muted-foreground">Data File:</dt>
											<dd
												className="font-medium truncate max-w-[150px]"
												title={connection.mw_data_file}
											>
												{connection.mw_data_file}
											</dd>
										</div>
										<div className="flex justify-between">
											<dt className="text-muted-foreground">Username:</dt>
											<dd className="font-medium">{connection.mw_username}</dd>
										</div>
										{connection.last_used_at && (
											<div className="flex justify-between">
												<dt className="text-muted-foreground">Last Used:</dt>
												<dd className="font-medium flex items-center gap-1">
													<Calendar className="h-3 w-3" />
													{new Date(
														connection.last_used_at,
													).toLocaleDateString()}
												</dd>
											</div>
										)}
									</dl>

									<div className="mt-4 flex gap-2">
										{currentConnection?.id === connection.id ? (
											<Button
												size="sm"
												variant="secondary"
												disabled
												className="flex-1"
											>
												<Check className="mr-2 h-4 w-4" />
												Active
											</Button>
										) : (
											<Button
												size="sm"
												variant="outline"
												className="flex-1"
												onClick={() => setCurrentConnection(connection)}
											>
												Use This
											</Button>
										)}

										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													size="sm"
													variant="ghost"
													className="h-8 w-8 p-0"
												>
													<MoreVertical className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem asChild>
													<Link to={`/connections/${connection.id}/edit`}>
														<Edit className="mr-2 h-4 w-4" />
														Edit
													</Link>
												</DropdownMenuItem>
												{!connection.is_default && (
													<DropdownMenuItem
														onClick={() => handleSetDefault(connection.id)}
													>
														<Check className="mr-2 h-4 w-4" />
														Set as Default
													</DropdownMenuItem>
												)}
												<DropdownMenuSeparator />
												<DropdownMenuItem
													onClick={() => handleDelete(connection.id)}
													className="text-destructive"
													disabled={isDeleting === connection.id}
												>
													<Trash2 className="mr-2 h-4 w-4" />
													Delete
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				)}

				<div className="mt-8 flex justify-center gap-4">
					<Button variant="outline" onClick={refreshConnections}>
						<RefreshCw className="mr-2 h-4 w-4" />
						Refresh Connections
					</Button>
					<Button variant="outline" asChild>
						<Link to="/connections/now">
							<Cloud className="mr-2 h-4 w-4" />
							Manage NOW Accounts
						</Link>
					</Button>
				</div>
			</main>
		</>
	);
}

function cn(...classes: (string | undefined | null | false)[]) {
	return classes.filter(Boolean).join(" ");
}
