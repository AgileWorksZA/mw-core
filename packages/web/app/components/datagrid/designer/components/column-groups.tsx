import React from "react";
import { PanelCard } from "~/components/datagrid/designer/components/panel-card";
import {
  type ColumnGroup,
  DesignerContext,
  useDesigner,
} from "~/components/datagrid/designer/types";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";

export function ColumnGroups() {
  const columnGroups = useDesigner((state) => state.context.columnGroups);
  const [groups, setGroups] = React.useState<ColumnGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = React.useState<ColumnGroup | null>(
    null,
  );
  const [newGroup, setNewGroup] = React.useState<{
    name: string;
    description: string;
  }>({
    name: "",
    description: "",
  });
  const [showAddForm, setShowAddForm] = React.useState(false);

  // Initialize the local state from context
  React.useEffect(() => {
    setGroups(columnGroups || []);
  }, [columnGroups]);

  // Create a new group
  const handleAddGroup = () => {
    if (!newGroup.name) return;

    const newGroupObj: ColumnGroup = {
      id: newGroup.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      name: newGroup.name,
      description: newGroup.description || undefined,
    };

    const updatedGroups = [...groups, newGroupObj];
    setGroups(updatedGroups);

    // Update context
    DesignerContext.trigger.update({
      update: { columnGroups: updatedGroups },
    });

    // Reset form
    setNewGroup({
      name: "",
      description: "",
    });
    setShowAddForm(false);
  };

  // Edit a group
  const handleUpdateGroup = () => {
    if (!selectedGroup) return;

    const updatedGroups = groups.map((group) =>
      group.id === selectedGroup.id ? selectedGroup : group,
    );

    setGroups(updatedGroups);

    // Update context
    DesignerContext.trigger.update({
      update: { columnGroups: updatedGroups },
    });

    setSelectedGroup(null);
  };

  // Delete a group
  const handleDeleteGroup = (groupId: string) => {
    const updatedGroups = groups.filter((group) => group.id !== groupId);
    setGroups(updatedGroups);

    // Update context
    DesignerContext.trigger.update({
      update: { columnGroups: updatedGroups },
    });

    if (selectedGroup?.id === groupId) {
      setSelectedGroup(null);
    }
  };

  return (
    <div className="space-y-4">
      <PanelCard
        header="Column Groups"
        body={
          <>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium">Defined Groups</h3>
              {!showAddForm && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddForm(true)}
                >
                  Add Group
                </Button>
              )}
            </div>

            {showAddForm && (
              <div className="mb-4 p-4 border rounded-md">
                <h3 className="text-sm font-medium mb-3">New Group</h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="group-name">Group Name</Label>
                    <Input
                      id="group-name"
                      value={newGroup.name}
                      onChange={(e) =>
                        setNewGroup({ ...newGroup, name: e.target.value })
                      }
                      placeholder="e.g., Basic Info, Contact Details"
                    />
                  </div>
                  <div>
                    <Label htmlFor="group-description">
                      Description (optional)
                    </Label>
                    <Textarea
                      id="group-description"
                      value={newGroup.description}
                      onChange={(e) =>
                        setNewGroup({
                          ...newGroup,
                          description: e.target.value,
                        })
                      }
                      placeholder="Describe the purpose of this group"
                      className="h-20"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowAddForm(false);
                        setNewGroup({ name: "", description: "" });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddGroup} disabled={!newGroup.name}>
                      Add Group
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {groups.length > 0 ? (
              <ScrollArea className="h-[200px] rounded-md border">
                <div className="p-4">
                  {groups.map((group) => (
                    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
                    <div
                      key={group.id}
                      className={cn(
                        "flex items-center justify-between p-2 rounded-md border mb-2 hover:bg-muted cursor-pointer",
                        selectedGroup?.id === group.id
                          ? "border-primary bg-primary/5"
                          : "",
                      )}
                      onClick={() => setSelectedGroup(group)}
                    >
                      <div>
                        <div className="font-medium">{group.name}</div>
                        {group.description && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {group.description}
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-50 hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteGroup(group.id);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center h-[200px] border rounded-md bg-muted/10 mb-4">
                <p className="text-muted-foreground mb-2">
                  No column groups defined yet
                </p>
                <p className="text-xs text-muted-foreground">
                  Groups help organize columns into logical categories
                </p>
              </div>
            )}
          </>
        }
      />

      {selectedGroup && (
        <PanelCard
          header={`Edit Group: ${selectedGroup.name}`}
          body={
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-group-name">Group Name</Label>
                <Input
                  id="edit-group-name"
                  value={selectedGroup.name}
                  onChange={(e) =>
                    setSelectedGroup({
                      ...selectedGroup,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-group-description">Description</Label>
                <Textarea
                  id="edit-group-description"
                  value={selectedGroup.description || ""}
                  onChange={(e) =>
                    setSelectedGroup({
                      ...selectedGroup,
                      description: e.target.value || undefined,
                    })
                  }
                  className="h-20"
                />
              </div>
            </div>
          }
          footer={
            <>
              <Button variant="outline" onClick={() => setSelectedGroup(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateGroup}>Update Group</Button>
            </>
          }
        />
      )}
    </div>
  );
}
