import type { MoneyWorksNOWFile } from "@moneyworks/data";
import {
	AlertCircle,
	Building2,
	CheckCircle2,
	Loader2,
	Server,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { useAuth } from "~/hooks/use-auth";

export default function SelectNowFilesPage() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const { userId } = useAuth();
	const accountId = searchParams.get("accountId");

	const [isLoading, setIsLoading] = useState(true);
	const [isCreating, setIsCreating] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [files, setFiles] = useState<MoneyWorksNOWFile[]>([]);
	const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());

	useEffect(() => {
		if (!accountId) {
			navigate("/connections");
			return;
		}

		loadFiles();
	}, [accountId]);

	async function loadFiles() {
		try {
			const formData = new FormData();
			formData.append("clerk_user_id", userId!);
			formData.append("id", accountId!);
			formData.append("_action", "authenticate");

			const response = await fetch("/api/now-accounts", {
				method: "POST",
				body: formData,
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to load files");
			}

			setFiles(data.files);
			// Select all files by default
			setSelectedFiles(new Set(data.files.map((f: MoneyWorksNOWFile) => f.id)));
		} catch (err) {
			console.error("Failed to load files:", err);
			setError(err instanceof Error ? err.message : "Failed to load files");
		} finally {
			setIsLoading(false);
		}
	}

	function toggleFile(fileId: string) {
		const newSelection = new Set(selectedFiles);
		if (newSelection.has(fileId)) {
			newSelection.delete(fileId);
		} else {
			newSelection.add(fileId);
		}
		setSelectedFiles(newSelection);
	}

	function toggleAll() {
		if (selectedFiles.size === files.length) {
			setSelectedFiles(new Set());
		} else {
			setSelectedFiles(new Set(files.map((f) => f.id)));
		}
	}

	async function handleCreateConnections() {
		if (selectedFiles.size === 0) {
			setError("Please select at least one file");
			return;
		}

		setIsCreating(true);
		setError(null);

		try {
			const selectedFileData = files.filter((f) => selectedFiles.has(f.id));

			const formData = new FormData();
			formData.append("clerk_user_id", userId!);
			formData.append("accountId", accountId!);
			formData.append("selectedFiles", JSON.stringify(selectedFileData));
			formData.append("_action", "create-connections");

			const response = await fetch("/api/now-accounts", {
				method: "POST",
				body: formData,
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to create connections");
			}

			// Success! Navigate to connections page
			navigate("/connections?created=now");
		} catch (err) {
			console.error("Failed to create connections:", err);
			setError(
				err instanceof Error ? err.message : "Failed to create connections",
			);
			setIsCreating(false);
		}
	}

	if (isLoading) {
		return (
			<div className="container max-w-4xl mx-auto py-8">
				<Card>
					<CardContent className="flex items-center justify-center py-12">
						<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="container max-w-4xl mx-auto py-8">
			<Card>
				<CardHeader>
					<CardTitle>Select MoneyWorks Files</CardTitle>
					<CardDescription>
						Choose which files you want to connect to from your MoneyWorks NOW
						account
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{error && (
						<Alert variant="destructive">
							<AlertCircle className="h-4 w-4" />
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					)}

					{files.length === 0 ? (
						<Alert>
							<AlertCircle className="h-4 w-4" />
							<AlertDescription>
								No files found in your MoneyWorks NOW account
							</AlertDescription>
						</Alert>
					) : (
						<>
							<div className="flex items-center justify-between mb-4">
								<p className="text-sm text-muted-foreground">
									{selectedFiles.size} of {files.length} files selected
								</p>
								<Button variant="outline" size="sm" onClick={toggleAll}>
									{selectedFiles.size === files.length
										? "Deselect All"
										: "Select All"}
								</Button>
							</div>

							<div className="space-y-2 max-h-96 overflow-y-auto">
								{files.map((file) => (
									<div
										key={file.id}
										className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent cursor-pointer"
										onClick={() => toggleFile(file.id)}
									>
										<Checkbox
											checked={selectedFiles.has(file.id)}
											onCheckedChange={() => toggleFile(file.id)}
											onClick={(e) => e.stopPropagation()}
										/>
										<div className="flex-1 space-y-1">
											<div className="flex items-center gap-2">
												<Building2 className="h-4 w-4 text-muted-foreground" />
												<span className="font-medium">{file.companyName}</span>
											</div>
											<div className="flex items-center gap-4 text-sm text-muted-foreground">
												<span className="flex items-center gap-1">
													<Server className="h-3 w-3" />
													{file.host}:{file.port}
												</span>
												<span>{file.dataFile}</span>
											</div>
											{file.lastModified && (
												<p className="text-xs text-muted-foreground">
													Last modified:{" "}
													{new Date(file.lastModified).toLocaleDateString()}
												</p>
											)}
										</div>
										{selectedFiles.has(file.id) && (
											<CheckCircle2 className="h-5 w-5 text-primary" />
										)}
									</div>
								))}
							</div>

							<div className="flex gap-4 pt-4">
								<Button
									onClick={handleCreateConnections}
									disabled={isCreating || selectedFiles.size === 0}
								>
									{isCreating ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Creating Connections...
										</>
									) : (
										<>
											Create {selectedFiles.size} Connection
											{selectedFiles.size !== 1 ? "s" : ""}
										</>
									)}
								</Button>
								<Button
									variant="outline"
									onClick={() => navigate("/connections")}
									disabled={isCreating}
								>
									Cancel
								</Button>
							</div>
						</>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
