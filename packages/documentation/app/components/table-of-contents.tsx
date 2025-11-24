import * as React from "react";
import { cn } from "~/lib/utils";

interface TocItem {
	id: string;
	text: string;
	level: number;
}

interface TableOfContentsProps {
	items: TocItem[];
	className?: string;
}

export function TableOfContents({ items, className }: TableOfContentsProps) {
	const [activeId, setActiveId] = React.useState<string>("");
	const [focusedIndex, setFocusedIndex] = React.useState<number>(-1);
	const navRef = React.useRef<HTMLElement>(null);
	const itemRefs = React.useRef<(HTMLAnchorElement | null)[]>([]);

	// Debounced intersection observer for performance
	React.useEffect(() => {
		const observerOptions = {
			rootMargin: "-20% 0px -35% 0px",
			threshold: [0, 0.5, 1],
		};

		let ticking = false;
		const updateActiveId = (entries: IntersectionObserverEntry[]) => {
			if (!ticking) {
				window.requestAnimationFrame(() => {
					const intersectingEntries = entries.filter(
						(entry) => entry.isIntersecting,
					);
					if (intersectingEntries.length > 0) {
						// Get the first intersecting entry
						const firstEntry = intersectingEntries.reduce((prev, current) => {
							return current.boundingClientRect.top <
								prev.boundingClientRect.top
								? current
								: prev;
						});
						setActiveId(firstEntry.target.id);
					}
					ticking = false;
				});
				ticking = true;
			}
		};

		const observer = new IntersectionObserver(updateActiveId, observerOptions);

		// Observe all section elements
		items.forEach(({ id }) => {
			const element = document.getElementById(id);
			if (element) {
				observer.observe(element);
			}
		});

		return () => {
			items.forEach(({ id }) => {
				const element = document.getElementById(id);
				if (element) {
					observer.unobserve(element);
				}
			});
		};
	}, [items]);

	// Keyboard navigation
	React.useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!navRef.current?.contains(document.activeElement)) return;

			let newIndex = focusedIndex;

			switch (e.key) {
				case "ArrowDown":
					e.preventDefault();
					newIndex = Math.min(focusedIndex + 1, items.length - 1);
					break;
				case "ArrowUp":
					e.preventDefault();
					newIndex = Math.max(focusedIndex - 1, 0);
					break;
				case "Home":
					e.preventDefault();
					newIndex = 0;
					break;
				case "End":
					e.preventDefault();
					newIndex = items.length - 1;
					break;
				case "Enter":
				case " ":
					e.preventDefault();
					if (focusedIndex >= 0 && itemRefs.current[focusedIndex]) {
						itemRefs.current[focusedIndex]?.click();
					}
					break;
				default:
					return;
			}

			if (newIndex !== focusedIndex) {
				setFocusedIndex(newIndex);
				itemRefs.current[newIndex]?.focus();
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [focusedIndex, items.length]);

	const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
		e.preventDefault();
		const element = document.getElementById(id);
		if (element) {
			const offset = 80; // Account for fixed header
			const elementPosition = element.getBoundingClientRect().top;
			const offsetPosition = elementPosition + window.pageYOffset - offset;

			window.scrollTo({
				top: offsetPosition,
				behavior: "smooth",
			});

			// Set focus to the heading for accessibility
			element.setAttribute("tabindex", "-1");
			element.focus();
			element.addEventListener(
				"blur",
				() => {
					element.removeAttribute("tabindex");
				},
				{ once: true },
			);
		}
	};

	const handleFocus = (index: number) => {
		setFocusedIndex(index);
	};

	return (
		<nav
			ref={navRef}
			className={cn("space-y-1 pr-4", className)}
			aria-label="Table of contents"
		>
			<p className="font-medium mb-4 text-sm uppercase tracking-wide text-muted-foreground">
				On this page
			</p>
			<ul className="space-y-1 text-sm">
				{items.map((item, index) => (
					<li
						key={item.id}
						style={{ paddingLeft: `${(item.level - 2) * 12}px` }}
					>
						<a
							ref={(el) => (itemRefs.current[index] = el)}
							href={`#${item.id}`}
							onClick={(e) => handleClick(e, item.id)}
							onFocus={() => handleFocus(index)}
							className={cn(
								"block py-1 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded-sm px-2 -ml-2",
								activeId === item.id && "text-foreground font-medium",
								focusedIndex === index &&
									"ring-2 ring-primary ring-offset-2 ring-offset-background",
							)}
							aria-current={activeId === item.id ? "location" : undefined}
						>
							{item.text}
						</a>
					</li>
				))}
			</ul>
		</nav>
	);
}

export function extractTableOfContents(content: string): TocItem[] {
	const items: TocItem[] = [];
	const headingRegex = /^(#{2,4})\s+(.+)$/gm;

	let match;
	while ((match = headingRegex.exec(content)) !== null) {
		const level = match[1].length;
		const text = match[2].trim();
		const id = text
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/(^-|-$)/g, "");

		items.push({ id, text, level });
	}

	return items;
}
