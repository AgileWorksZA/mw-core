/**
 * Environment selector component
 */

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Globe, Layers, Plus, Settings } from "lucide-react";
import { useIde } from "~/modules/ide/hooks/use-ide";
import { useIdeTrigger } from "~/modules/ide/hooks/use-ide-trigger";
import { cn } from "~/lib/utils";
import { useNavigate } from "react-router";

interface EnvironmentSelectorProps {
  className?: string;
  showManageButton?: boolean;
  variant?: "default" | "compact";
}

export function EnvironmentSelector({ 
  className, 
  showManageButton = false,
  variant = "default"
}: EnvironmentSelectorProps) {
  const navigate = useNavigate();
  const ide = useIde();
  const trigger = useIdeTrigger();
  
  const config = ide.environmentConfig || {
    activeEnvironment: undefined,
    environments: {},
    globals: { variables: {}, secrets: {} }
  };
  const environments = Object.values(config.environments);
  
  const activeEnv = config.activeEnvironment 
    ? config.environments[config.activeEnvironment]
    : null;
  
  const handleManage = () => {
    navigate("/ide/environments");
  };
  
  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Badge 
          variant={activeEnv ? "default" : "secondary"}
          className="cursor-pointer"
          onClick={() => {
            // Cycle through environments
            const envIds = Object.keys(config.environments);
            if (envIds.length === 0) return;
            
            const currentIndex = config.activeEnvironment 
              ? envIds.indexOf(config.activeEnvironment)
              : -1;
            const nextIndex = (currentIndex + 1) % (envIds.length + 1);
            const nextEnvId = nextIndex === envIds.length ? undefined : envIds[nextIndex];
            
            trigger.setActiveEnvironment({ id: nextEnvId });
          }}
        >
          {activeEnv ? (
            <>
              <Layers className="h-3 w-3 mr-1" />
              {activeEnv.name}
            </>
          ) : (
            <>
              <Globe className="h-3 w-3 mr-1" />
              Global
            </>
          )}
        </Badge>
        {showManageButton && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleManage}
          >
            <Settings className="h-3 w-3" />
          </Button>
        )}
      </div>
    );
  }
  
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Select
        value={config.activeEnvironment || "global"}
        onValueChange={(value) => 
          trigger.setActiveEnvironment({ id: value === "global" ? undefined : value })
        }
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="global">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Global (No Environment)
            </div>
          </SelectItem>
          {environments.map((env) => (
            <SelectItem key={env.id} value={env.id}>
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                <span>{env.name}</span>
                {env.color && (
                  <div 
                    className="w-3 h-3 rounded-full ml-auto" 
                    style={{ backgroundColor: env.color }}
                  />
                )}
              </div>
            </SelectItem>
          ))}
          {showManageButton && (
            <>
              <div className="my-1 h-px bg-border" />
              <button
                className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                onClick={handleManage}
              >
                <Plus className="h-4 w-4 mr-2" />
                Manage Environments
              </button>
            </>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}