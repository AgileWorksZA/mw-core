import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import type { CompanyGroup } from "~/db/schema";

interface CreateGroupDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	organizationId: string;
	parentGroup?: CompanyGroup;
	onSuccess?: (group: CompanyGroup) => void;
}

export function CreateGroupDialog({
	open,
	onOpenChange,
	organizationId,
	parentGroup,
	onSuccess,
}: CreateGroupDialogProps) {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		type: "standard" as CompanyGroup["type"],
		description: "",
		color_code: "#3B82F6",
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			const response = await fetch("/api/groups", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...formData,
					organization_id: organizationId,
					parent_group_id: parentGroup?.id,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to create group");
			}

			const newGroup = await response.json();

			// Reset form
			setFormData({
				name: "",
				type: "standard",
				description: "",
				color_code: "#3B82F6",
			});

			onOpenChange(false);
			onSuccess?.(newGroup);

			// Refresh the page to show new group
			navigate(0);
		} catch (error) {
			console.error("Failed to create group:", error);
			alert("Failed to create group. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[425px]">
				<form onSubmit={handleSubmit}>
					<DialogHeader>
						<DialogTitle>
							{parentGroup
								? `Create Subgroup of ${parentGroup.name}`
								: "Create New Group"}
						</DialogTitle>
						<DialogDescription>
							Organize your companies into logical groups for easier management.
						</DialogDescription>
					</DialogHeader>

					<div className="grid gap-4 py-4">
						<div className="grid gap-2">
							<Label htmlFor="name">Group Name</Label>
							<Input
								id="name"
								required
								placeholder="e.g., Retail Clients, Tech Startups"
								value={formData.name}
								onChange={(e) =>
									setFormData({ ...formData, name: e.target.value })
								}
							/>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="type">Group Type</Label>
							<Select
								value={formData.type}
								onValueChange={(value) =>
									setFormData({ ...formData, type: value as any })
								}
							>
								<SelectTrigger id="type">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="standard">Standard Group</SelectItem>
									<SelectItem value="holding">Holding Company</SelectItem>
									<SelectItem value="division">Division</SelectItem>
									<SelectItem value="client">Client Group</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="description">Description (Optional)</Label>
							<Textarea
								id="description"
								placeholder="What types of companies will be in this group?"
								rows={3}
								value={formData.description}
								onChange={(e) =>
									setFormData({ ...formData, description: e.target.value })
								}
							/>
						</div>

						<div className="grid gap-2">
							<Label htmlFor="color">Color</Label>
							<div className="flex gap-2">
								<Input
									id="color"
									type="color"
									className="w-20"
									value={formData.color_code}
									onChange={(e) =>
										setFormData({ ...formData, color_code: e.target.value })
									}
								/>
								<Input
									type="text"
									value={formData.color_code}
									onChange={(e) =>
										setFormData({ ...formData, color_code: e.target.value })
									}
									placeholder="#3B82F6"
									pattern="^#[0-9A-Fa-f]{6}$"
								/>
							</div>
						</div>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							disabled={loading}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={loading}>
							{loading ? "Creating..." : "Create Group"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
