/**
 * New File Creation Route
 *
 * This route provides an interface for creating a new file of a specific type.
 * It can:
 * 1. Create an empty file with a specified path
 * 2. Upload and convert an existing file
 * 3. Use adapter-specific NewFile component if available
 *
 * The loader:
 * - Gets a default empty context for the specified file type
 * - Generates a unique ID for the new file
 * - Creates a default file manifest with empty mapping
 *
 * The route:
 * - Renders a dialog over the dashboard
 * - Provides file path input and drag-drop file upload
 * - Adapts to file type-specific requirements
 * - Submits to the server with POST to /api/ide/new/:type
 * - Navigates to the newly created file after successful creation
 */
import { useNavigate, Form, useLoaderData, useParams } from "react-router";
import { getAdapter } from "~/modules/ide/adapter/register";
import { useState, useEffect, useRef } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { Save, X, Upload, FileText } from "lucide-react";
import { loader } from "~/modules/ide/routes/ide.new.$type";
import type { Adapter } from "~/modules/ide/adapter/type";
import Dashboard from "~/routes/ide._index";
import { useDropzone } from "react-dropzone";
import type { FileContext, FileManifest } from "~/modules/ide/types";

export default function NewFile() {
  return <NewFileContent />;
}

function NewFileContent() {
  const loaderData = useLoaderData<typeof loader>();
  const [context, setContext] = useState<FileContext>(loaderData.context);
  const [manifest, setManifest] = useState<FileManifest>(loaderData.manifest);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const pathInputRef = useRef<HTMLInputElement>(null);
  const type = useParams().type;

  // Handle dialog close - navigate back
  const handleClose = () => {
    navigate(-1);
  };

  if (!type) {
    return (
      <>
        <Dashboard />
        <Dialog
          open
          onOpenChange={() => {
            navigate(-1);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Error</DialogTitle>
              <DialogDescription>Type parameter is missing</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={handleClose}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Try to get the adapter for the specified type
  let adapter: Adapter;
  try {
    adapter = getAdapter(type);
  } catch (error) {
    return (
      <>
        <Dashboard />
        <Dialog
          open
          onOpenChange={() => {
            navigate(-1);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Error</DialogTitle>
              <DialogDescription>
                Adapter for type '{type}' not found
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={handleClose}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Check if adapter has a custom NewFile component
  if (adapter.NewFile) {
    const CustomNewFile = adapter.NewFile;
    return <CustomNewFile />;
  }

  // Auto-focus path input when the dialog opens and context is loaded
  useEffect(() => {
    // Only try to focus after context is loaded and component is fully mounted
    if (pathInputRef.current && context) {
      // Use a slightly longer timeout to ensure the dialog is fully rendered
      const timer = setTimeout(() => {
        if (pathInputRef.current) {
          pathInputRef.current.focus();
          console.log("Focusing input field");
        }
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [context]);

  // Set up dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: adapter.metadata?.accept
      ? Object.fromEntries(adapter.metadata.accept.map((ext) => [ext, []]))
      : undefined,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setUploadedFile(file);

        // Use filename to enhance the path if possible
        if (file.name) {
          const fileName = file.name.split(".")[0];
          // If current path is empty or just a default, replace it
          // Otherwise, keep the current path but add the filename
          // Just use the filename without any folder structure
          setManifest({
            ...manifest,
            path: fileName,
          });
        }

        // If adapter has createFromFile, process the file
        if (adapter.createFromFile && context) {
          try {
            const updatedContext = await adapter.createFromFile({
              path: manifest.path || file.name,
              file,
              context,
            });
            setContext({
              data: updatedContext.data,
            });
          } catch (error) {
            console.error("Error processing file:", error);
          }
        }
      }
    },
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    console.log("Creating file...", context, manifest);

    if (!context) return;

    try {
      // Make a POST request to create the file
      const response = await fetch(`/api/ide/new/${type}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          context,
          manifest,
        }),
      });

      if (response.ok) {
        const manifest = await response.json();
        console.log("File created:", manifest);
        // Navigate to the new file
        navigate(`/ide/${type}/${manifest.id}`, {
          viewTransition: true,
          flushSync: true,
        });
      } else {
        console.error("Error creating file:", await response.text());
      }
    } catch (error) {
      console.error("Error creating file:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!context) {
    return (
      <>
        <Dashboard />
        <Dialog
          open
          onOpenChange={() => {
            navigate(-1);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Loading...</DialogTitle>
              <DialogDescription>
                Preparing new {adapter.metadata?.name || adapter.type} file
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <Dashboard />
      <Dialog
        open
        onOpenChange={() => {
          navigate(-1);
        }}
        defaultOpen={true}
      >
        <DialogContent
          className="sm:max-w-[600px]"
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            // Force focus to the input field
            setTimeout(() => pathInputRef.current?.focus(), 50);
          }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <adapter.Icon className="h-5 w-5" aria-hidden="true" />
              <span>New {adapter.metadata?.name || adapter.type}</span>
            </DialogTitle>
            <DialogDescription>
              {adapter.metadata?.description ||
                `Create a new ${adapter.type} file`}
            </DialogDescription>
          </DialogHeader>

          <Form method="post" onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              {/* Path input - autofocused */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="path" className="text-right">
                  File Path
                </Label>
                <div className="relative col-span-3">
                  <Input
                    required
                    id="path"
                    name="path"
                    ref={pathInputRef}
                    value={manifest.path}
                    onChange={(e) => {
                      setManifest({
                        ...manifest,
                        path: e.target.value,
                      });
                    }}
                    className="w-full"
                    placeholder="Enter a name for this file"
                    autoFocus
                    // biome-ignore lint/a11y/noPositiveTabindex: <explanation>
                    tabIndex={1}
                  />
                </div>
              </div>

              {/* File Dropzone */}
              <div
                {...getRootProps({
                  className: `
                  border-2 border-dashed rounded-md p-6 mt-2
                  ${isDragActive ? "border-primary bg-primary/10" : "border-border"}
                  cursor-pointer flex flex-col items-center justify-center
                  transition-colors
                `,
                })}
              >
                <input {...getInputProps()} />
                <Upload
                  className={`mb-2 h-8 w-8 ${isDragActive ? "text-primary" : "text-muted-foreground"}`}
                  aria-hidden="true"
                />
                <p className="text-sm text-center">
                  {isDragActive
                    ? "Drop the file here..."
                    : uploadedFile
                      ? `File ready: ${uploadedFile.name}`
                      : "Drag & drop a file here, or click to select"}
                </p>
                {adapter.metadata?.accept && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Accepted file types: {adapter.metadata.accept.join(", ")}
                  </p>
                )}
                {uploadedFile && (
                  <div className="flex items-center gap-2 mt-2 text-xs">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>{uploadedFile.name}</span>
                    <span className="text-muted-foreground">
                      ({Math.round(uploadedFile.size / 1024)} KB)
                    </span>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="gap-1"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="gap-1">
                <Save className="h-4 w-4" />
                Create File
              </Button>
            </DialogFooter>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Export the loader and action from the route module
export { loader };
