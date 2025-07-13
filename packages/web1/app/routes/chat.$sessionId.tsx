import type {
	MoneyWorksChatContext,
	MoneyWorksMessage,
} from "@moneyworks/chat";
import { MWChatContextProvider, MoneyWorksChat } from "@moneyworks/chat/client";
import { Check, Copy, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import {
	type LoaderFunctionArgs,
	data as json,
	useLoaderData,
	useNavigate,
} from "react-router";
import { Navigation } from "~/components/navigation";
import { Button } from "~/components/ui/button";
import { formatConversationForCopy } from "~/lib/chat-utils";
import { requireAuthAndConnection } from "~/lib/server-utils";
import { cn } from "~/lib/utils";
import { ChatService } from "~/services/chat";

export async function loader({ request, params }: LoaderFunctionArgs) {
	const { userId, connection } = await requireAuthAndConnection(request);
	const sessionId = params.sessionId!;

	// Get the specific session
	const session = await ChatService.getSession(sessionId);
	if (!session || session.clerk_user_id !== userId) {
		throw new Response("Session not found", { status: 404 });
	}

	// Load messages for this session
	const messages = await ChatService.getSessionMessages(sessionId);

	// Get all sessions for the sidebar
	const sessions = await ChatService.getSessionsByConnection(
		connection.id,
		userId,
	);

	// Create chat context
	const chatContext: MoneyWorksChatContext = {
		connectionId: connection.id,
		companyName: connection.connection_name || "MoneyWorks",
		userId: userId,
		userEmail: "",
		permissions: [],
		dateFormat: "DD/MM/YYYY",
		currencySymbol: "$",
		decimalPlaces: 2,
	};

	return json({
		chatContext,
		sessionId,
		session,
		initialMessages: messages,
		sessions,
	});
}

export default function ChatSessionPage() {
	const { chatContext, sessionId, session, initialMessages, sessions } =
		useLoaderData<typeof loader>();
	const navigate = useNavigate();
	const [currentMessages, setCurrentMessages] =
		useState<MoneyWorksMessage[]>(initialMessages);
	const [copiedConversation, setCopiedConversation] = useState(false);

	const handleNewChat = async () => {
		navigate("/chat?new=true");
	};

	const handleSessionClick = (selectedSessionId: string) => {
		navigate(`/chat/${selectedSessionId}`);
	};

	const handleClearHistory = async () => {
		if (
			!confirm(
				`Clear all ${sessions.length} chat sessions? This action cannot be undone.`,
			)
		) {
			return;
		}

		// Clear all sessions
		try {
			// We need to make an API call to delete sessions since we can't do it client-side
			const response = await fetch("/api/chat/clear", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (response.ok) {
				navigate("/chat?new=true");
			}
		} catch (error) {
			console.error("Failed to clear history:", error);
		}
	};

	const handleCopyConversation = async () => {
		try {
			const conversationText = formatConversationForCopy(currentMessages);
			await navigator.clipboard.writeText(conversationText);
			setCopiedConversation(true);
			setTimeout(() => setCopiedConversation(false), 2000);
		} catch (err) {
			console.error("Failed to copy conversation:", err);
		}
	};

	const handleClearSession = async () => {
		if (!confirm("Clear this chat session? This action cannot be undone.")) {
			return;
		}

		try {
			const response = await fetch(`/api/chat/clear?sessionId=${sessionId}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (response.ok) {
				// Reload the page to show empty chat
				window.location.reload();
			}
		} catch (error) {
			console.error("Failed to clear session:", error);
		}
	};

	const welcomeMessage = `Welcome to MoneyWorks Assistant! 

I can help you with:
• Searching transactions and invoices
• Looking up tax rates and account codes  
• Creating financial reports
• Answering accounting questions

How can I help you today?`;

	return (
		<>
			<Navigation />
			<div className="flex h-[calc(100vh-3.5rem)]">
				{/* Chat History Sidebar */}
				<div className="w-64 border-r bg-muted/50 dark:bg-muted/20 overflow-y-auto">
					<div className="p-4">
						<div className="flex items-center justify-between mb-4">
							<h2 className="font-semibold text-foreground">Chat History</h2>
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8"
								onClick={handleClearHistory}
								title="Clear all chat history"
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</div>

						<Button className="w-full mb-4" onClick={handleNewChat}>
							<Plus className="mr-2 h-4 w-4" />
							New Chat
						</Button>

						<div className="space-y-2">
							{sessions.map((s) => (
								<button
									key={s.id}
									className={cn(
										"w-full text-left p-3 rounded-lg transition-colors",
										"hover:bg-muted",
										s.id === sessionId && "bg-muted ring-2 ring-primary",
									)}
									onClick={() => handleSessionClick(s.id)}
								>
									<div className="font-medium text-sm truncate text-foreground">
										{s.title}
									</div>
									<div className="text-xs text-muted-foreground mt-1">
										{s.message_count} messages •{" "}
										{s.last_message_at
											? new Date(s.last_message_at).toLocaleDateString()
											: "New chat"}
									</div>
								</button>
							))}
						</div>
					</div>
				</div>

				{/* Main Chat Area */}
				<div className="flex-1 flex flex-col">
					<div className="border-b p-6 bg-background">
						<div className="flex items-start justify-between">
							<div>
								<h1 className="text-2xl font-bold text-foreground">
									MoneyWorks Assistant
								</h1>
								<p className="text-sm text-muted-foreground mt-1">
									{chatContext.companyName} • {session.title}
								</p>
							</div>

							{currentMessages.length > 1 && (
								<div className="flex items-center gap-2">
									<Button
										variant="outline"
										size="sm"
										onClick={handleCopyConversation}
										className="flex items-center gap-1.5"
									>
										{copiedConversation ? (
											<Check className="w-4 h-4" />
										) : (
											<Copy className="w-4 h-4" />
										)}
										Copy Chat
									</Button>
									<Button
										variant="outline"
										size="sm"
										onClick={handleClearSession}
										className="flex items-center gap-1.5 text-destructive hover:text-destructive/90 hover:bg-destructive/10"
									>
										<Trash2 className="w-4 h-4" />
										Clear Session
									</Button>
								</div>
							)}
						</div>
					</div>

					<div className="flex-1 overflow-hidden">
						<MWChatContextProvider value={chatContext}>
							<MoneyWorksChat
								key={sessionId} // Force remount on session change
								apiEndpoint={`/api/chat?sessionId=${sessionId}`}
								initialMessages={initialMessages}
								welcomeMessage={welcomeMessage}
								className="h-full"
								showHeader={false}
								onMessagesChange={setCurrentMessages}
							/>
						</MWChatContextProvider>
					</div>
				</div>
			</div>
		</>
	);
}
