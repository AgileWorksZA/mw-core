import * as React from "react";
import { cn } from "~/lib/utils";

interface CopyButtonProps {
	text: string;
	className?: string;
}

export function CopyButton({ text, className }: CopyButtonProps) {
	const [copied, setCopied] = React.useState(false);
	const timeoutRef = React.useRef<NodeJS.Timeout>();

	const handleCopy = React.useCallback(async () => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);

			// Clear any existing timeout
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}

			// Reset after 2 seconds
			timeoutRef.current = setTimeout(() => {
				setCopied(false);
			}, 2000);
		} catch (err) {
			console.error("Failed to copy text:", err);
		}
	}, [text]);

	React.useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	return (
		<button
			onClick={handleCopy}
			className={cn(
				"absolute top-2 right-2 p-2 rounded-md bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-muted transition-all duration-200",
				"focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
				copied && "text-green-600 dark:text-green-400",
				className,
			)}
			aria-label={copied ? "Copied to clipboard" : "Copy code to clipboard"}
			title={copied ? "Copied!" : "Copy code"}
		>
			{copied ? (
				<svg
					className="h-4 w-4"
					fill="none"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					viewBox="0 0 24 24"
					stroke="currentColor"
					aria-hidden="true"
				>
					<path d="M5 12l5 5L20 7" />
				</svg>
			) : (
				<svg
					className="h-4 w-4"
					fill="none"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					viewBox="0 0 24 24"
					stroke="currentColor"
					aria-hidden="true"
				>
					<path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
				</svg>
			)}
		</button>
	);
}
