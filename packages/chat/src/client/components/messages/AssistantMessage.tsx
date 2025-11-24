import { Bot, Check, Copy } from "lucide-react";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { MoneyWorksMessage } from "../../../shared/types";
import { cn } from "../../utils/cn";
import { ToolInvocation } from "./ToolInvocation";
import { ReportDisplay } from "./renderers/ReportDisplay";
import { TaxRateDisplay } from "./renderers/TaxRateDisplay";
import { TransactionDisplay } from "./renderers/TransactionDisplay";

export interface AssistantMessageProps {
	message: MoneyWorksMessage;
}

export function AssistantMessage({ message }: AssistantMessageProps) {
	const hasContent = message.content.trim().length > 0;
	const [copied, setCopied] = useState(false);
	const [hovering, setHovering] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(message.content);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy text:", err);
		}
	};

	return (
		<div
			className="flex items-start gap-3"
			onMouseEnter={() => setHovering(true)}
			onMouseLeave={() => setHovering(false)}
		>
			<div className="flex-shrink-0 w-8 h-8 bg-muted rounded-full flex items-center justify-center">
				<Bot className="w-4 h-4 text-muted-foreground" />
			</div>

			<div className="flex-1 max-w-[80%] space-y-2">
				{hasContent && (
					<div
						className={cn(
							"bg-muted px-4 py-4 rounded-2xl shadow-sm dark:shadow-none",
							message.streaming && "animate-pulse",
						)}
					>
						<div className="prose prose-sm max-w-none dark:prose-invert prose-pre:bg-zinc-900 prose-pre:text-zinc-100 dark:prose-pre:bg-zinc-800">
							<ReactMarkdown
								remarkPlugins={[remarkGfm]}
								components={{
									pre: ({ node, ...props }) => (
										<pre
											className="overflow-x-auto p-3 rounded-md bg-zinc-900 dark:bg-zinc-800 text-zinc-100"
											{...props}
										/>
									),
									code: ({ node, className, children, ...props }) => {
										const match = /language-(\w+)/.exec(className || "");
										const inline = !match;
										return inline ? (
											<code
												className="px-1 py-0.5 rounded bg-muted-foreground/20 text-sm"
												{...props}
											>
												{children}
											</code>
										) : (
											<code className={className} {...props}>
												{children}
											</code>
										);
									},
								}}
							>
								{message.content}
							</ReactMarkdown>
						</div>
					</div>
				)}

				{message.toolInvocations && message.toolInvocations.length > 0 && (
					<div className="space-y-2">
						{message.toolInvocations.map((invocation, index) => (
							<ToolInvocation key={index} invocation={invocation} />
						))}
					</div>
				)}

				{message.mwData && (
					<div className="mt-2">
						{message.mwData.type === "transaction" && (
							<TransactionDisplay
								data={message.mwData.data}
								metadata={message.mwData.metadata}
							/>
						)}
						{message.mwData.type === "report" && (
							<ReportDisplay
								data={message.mwData.data}
								metadata={message.mwData.metadata}
							/>
						)}
						{message.mwData.type === "taxRate" && (
							<TaxRateDisplay data={message.mwData.data} />
						)}
					</div>
				)}
			</div>

			<div className="w-4 flex flex-col items-center justify-center">
				{hovering && !message.streaming && hasContent && (
					<button
						onClick={handleCopy}
						className="flex-shrink-0 p-1.5 bg-background border border-border hover:bg-muted rounded shadow-sm hover:shadow-md transition-all self-start"
						title="Copy raw markdown"
					>
						{copied ? (
							<Check className="w-3 h-3 text-green-600 dark:text-green-400" />
						) : (
							<Copy className="w-3 h-3 text-muted-foreground" />
						)}
					</button>
				)}
			</div>
		</div>
	);
}
