import { useState } from "react";
import { ChevronRight, ChevronDown, Building2, Folder, FolderOpen } from "lucide-react";
import { cn } from "~/lib/utils";
import type { CompanyGroup } from "~/db/schema";

interface GroupTreeNode extends CompanyGroup {
  children?: GroupTreeNode[];
}

interface GroupTreeProps {
  groups: GroupTreeNode[];
  selectedGroupId?: string;
  onSelectGroup?: (group: GroupTreeNode) => void;
  onCreateSubgroup?: (parentGroup: GroupTreeNode) => void;
  onEditGroup?: (group: GroupTreeNode) => void;
  onDeleteGroup?: (group: GroupTreeNode) => void;
}

export function GroupTree({
  groups,
  selectedGroupId,
  onSelectGroup,
  onCreateSubgroup,
  onEditGroup,
  onDeleteGroup,
}: GroupTreeProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const toggleExpanded = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const renderGroup = (group: GroupTreeNode, level: number = 0) => {
    const hasChildren = group.children && group.children.length > 0;
    const isExpanded = expandedGroups.has(group.id);
    const isSelected = selectedGroupId === group.id;

    const getGroupIcon = () => {
      if (group.type === 'holding') return Building2;
      if (hasChildren) return isExpanded ? FolderOpen : Folder;
      return Building2;
    };

    const Icon = getGroupIcon();

    return (
      <div key={group.id}>
        <div
          className={cn(
            "flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-muted transition-colors",
            isSelected && "bg-muted",
            level > 0 && "ml-6"
          )}
          onClick={() => onSelectGroup?.(group)}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(group.id);
              }}
              className="p-0.5 hover:bg-muted-foreground/20 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-5" />}
          
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: group.color_code }}
          />
          
          <Icon className="h-4 w-4 text-muted-foreground" />
          
          <span className="flex-1 text-sm font-medium">{group.name}</span>
          
          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
            {onCreateSubgroup && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCreateSubgroup(group);
                }}
                className="p-1 hover:bg-muted-foreground/20 rounded text-xs"
                title="Add subgroup"
              >
                +
              </button>
            )}
            {onEditGroup && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditGroup(group);
                }}
                className="p-1 hover:bg-muted-foreground/20 rounded text-xs"
                title="Edit group"
              >
                ✎
              </button>
            )}
            {onDeleteGroup && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteGroup(group);
                }}
                className="p-1 hover:bg-muted-foreground/20 rounded text-xs text-destructive"
                title="Delete group"
              >
                ×
              </button>
            )}
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div>
            {group.children!.map((child) => renderGroup(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (groups.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <p className="text-sm">No groups created yet</p>
      </div>
    );
  }

  return (
    <div className="py-2">
      {groups.map((group) => renderGroup(group))}
    </div>
  );
}