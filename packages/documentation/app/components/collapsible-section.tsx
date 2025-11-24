import * as React from "react";
import { cn } from "~/lib/utils";

interface CollapsibleSectionProps {
	title: string;
	children: React.ReactNode;
	defaultOpen?: boolean;
	className?: string;
}

export function CollapsibleSection({
	title,
	children,
	defaultOpen = false,
	className,
}: CollapsibleSectionProps) {
	const [isOpen, setIsOpen] = React.useState(defaultOpen);
	const contentRef = React.useRef<HTMLDivElement>(null);
	const [height, setHeight] = React.useState<number | undefined>(
		defaultOpen ? undefined : 0,
	);

	React.useEffect(() => {
		if (!contentRef.current) return;

		const resizeObserver = new ResizeObserver((entries) => {
			const entry = entries[0];
			if (entry) {
				setHeight(entry.contentRect.height);
			}
		});

		resizeObserver.observe(contentRef.current);
		return () => resizeObserver.disconnect();
	}, []);

	return (
		<div className={cn("border rounded-lg", className)}>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className={cn(
					"w-full flex items-center justify-between px-4 py-3",
					"text-left font-medium hover:bg-muted/50 transition-colors",
					"focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset",
					isOpen && "border-b",
				)}
				aria-expanded={isOpen}
				aria-controls={`content-${title.replace(/\s+/g, "-").toLowerCase()}`}
			>
				<span>{title}</span>
				<svg
					className={cn(
						"h-5 w-5 text-muted-foreground transition-transform duration-200",
						isOpen && "rotate-180",
					)}
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</button>

			<div
				className="overflow-hidden transition-all duration-200 ease-in-out"
				style={{
					height: isOpen ? height : 0,
				}}
				id={`content-${title.replace(/\s+/g, "-").toLowerCase()}`}
			>
				<div ref={contentRef} className="p-4">
					{children}
				</div>
			</div>
		</div>
	);
}
