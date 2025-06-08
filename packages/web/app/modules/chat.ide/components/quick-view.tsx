import { useChatContext, useChatSessions } from "~/modules/chat/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export function QuickView() {
  const context = useChatContext();
  const sessions = useChatSessions();
  
  const totalMessages = sessions.reduce((acc, session) => acc + session.messages.length, 0);
  
  return (
    <div className="space-y-4 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Chat Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Sessions:</span>
              <span className="font-semibold">{sessions.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Messages:</span>
              <span className="font-semibold">{totalMessages}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Created:</span>
              <span className="font-semibold">
                {new Date(context.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sessions.slice(0, 5).map((session) => (
              <div key={session.id} className="border-b pb-2 last:border-0">
                <div className="font-medium truncate">{session.title}</div>
                <div className="text-sm text-gray-600">
                  {session.messages.length} messages
                </div>
              </div>
            ))}
            {sessions.length === 0 && (
              <div className="text-gray-500 text-center py-4">
                No sessions yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}