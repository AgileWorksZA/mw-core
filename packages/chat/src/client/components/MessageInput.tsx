import { Send, X } from "lucide-react";
import type React from "react";
import { cn } from "../utils/cn";

export interface MessageInputProps {
	value: string;
	onChange: (value: string) => void;
	onSubmit: (e: React.FormEvent) => void;
	placeholder?: string;
	disabled?: boolean;
	onCancel?: () => void;
}

export function MessageInput({
	value,
	onChange,
	onSubmit,
	placeholder,
	disabled,
	onCancel,
}: MessageInputProps) {
	return (
		<form onSubmit={onSubmit} className="flex gap-2">
			<input
				type="text"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				disabled={disabled}
				className={cn(
					"flex-1 px-4 py-2 border rounded-lg",
					"bg-background text-foreground",
					"border-input",
					"focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
					"disabled:opacity-50 disabled:cursor-not-allowed",
					"text-sm",
					"placeholder:text-muted-foreground",
				)}
			/>

			{disabled && onCancel ? (
				<button
					type="button"
					onClick={onCancel}
					className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
				>
					<X className="w-4 h-4" />
				</button>
			) : (
				<button
					type="submit"
					disabled={disabled || !value.trim()}
					className={cn(
						"px-4 py-2 bg-primary text-primary-foreground rounded-lg",
						"hover:bg-primary/90 transition-colors",
						"disabled:opacity-50 disabled:cursor-not-allowed",
						"flex items-center gap-2",
					)}
				>
					<Send className="w-4 h-4" />
					<span className="sr-only">Send message</span>
				</button>
			)}
		</form>
	);
}
