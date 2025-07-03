import { useConnection } from "~/contexts/connection-context";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Skeleton } from "./ui/skeleton";
import { Link } from "react-router";
import { ChevronDown, Plus, Database, Check } from "lucide-react";

export function ConnectionSwitcher() {
  const { connections, currentConnection, isLoading, setCurrentConnection } = useConnection();
  
  if (isLoading) {
    return <Skeleton className="h-10 w-48" />;
  }
  
  if (connections.length === 0) {
    return (
      <Button asChild variant="outline" size="sm">
        <Link to="/connections/new">
          <Plus className="mr-2 h-4 w-4" />
          Add Connection
        </Link>
      </Button>
    );
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="min-w-[200px] justify-between">
          <span className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="truncate">
              {currentConnection?.connection_name || "Select Connection"}
            </span>
          </span>
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Your Connections</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {connections.map((connection) => (
          <DropdownMenuItem
            key={connection.id}
            onClick={() => setCurrentConnection(connection)}
            className="cursor-pointer"
          >
            <span className="flex items-center justify-between w-full">
              <span className="truncate">{connection.connection_name}</span>
              {currentConnection?.id === connection.id && (
                <Check className="h-4 w-4 ml-2" />
              )}
            </span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/connections" className="cursor-pointer">
            Manage Connections
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/connections/new" className="cursor-pointer">
            <Plus className="mr-2 h-4 w-4" />
            Add New
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}