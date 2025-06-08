import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Textarea } from "~/components/ui/textarea";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Upload, Link, FileText, Loader2 } from "lucide-react";
import type { OpenAPIDocument } from "../types";

interface ImportDialogProps {
  open: boolean;
  onClose: () => void;
  onImport: (document: OpenAPIDocument, source: { type: 'url' | 'file' | 'paste', url?: string, fileName?: string }) => void;
}

export function ImportDialog({ open, onClose, onImport }: ImportDialogProps) {
  const [activeTab, setActiveTab] = useState<'url' | 'file' | 'paste'>('url');
  const [url, setUrl] = useState('');
  const [pasteContent, setPasteContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUrlImport = useCallback(async () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    console.log('[ImportDialog] Starting URL import for:', url);
    setLoading(true);
    setError(null);

    try {
      console.log('[ImportDialog] Fetching from /api/openapi/fetch');
      const response = await fetch('/api/openapi/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      console.log('[ImportDialog] Response status:', response.status);
      console.log('[ImportDialog] Response headers:', Object.fromEntries(response.headers.entries()));

      let result;
      const responseText = await response.text();
      console.log('[ImportDialog] Raw response:', responseText.substring(0, 200) + '...');
      
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.error('[ImportDialog] Failed to parse response:', e);
        throw new Error('Failed to parse server response');
      }

      if (!response.ok) {
        console.error('[ImportDialog] Response not OK. Error:', result.error);
        console.error('[ImportDialog] Error details:', result.details);
        throw new Error(result.error || 'Failed to fetch OpenAPI specification');
      }

      console.log('[ImportDialog] Successfully fetched OpenAPI spec');
      onImport(result.data, { type: 'url', url });
      onClose();
    } catch (err) {
      console.error('[ImportDialog] Import failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to import from URL');
    } finally {
      setLoading(false);
    }
  }, [url, onImport, onClose]);

  const handleFileImport = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const text = await file.text();
      const document = JSON.parse(text);

      // Validate it's an OpenAPI document
      if (!document.openapi && !document.swagger) {
        throw new Error('Invalid OpenAPI document. Missing "openapi" or "swagger" field.');
      }

      onImport(document, { type: 'file', fileName: file.name });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file');
    } finally {
      setLoading(false);
    }
  }, [onImport, onClose]);

  const handlePasteImport = useCallback(() => {
    if (!pasteContent.trim()) {
      setError('Please paste OpenAPI content');
      return;
    }

    setError(null);

    try {
      const document = JSON.parse(pasteContent);

      // Validate it's an OpenAPI document
      if (!document.openapi && !document.swagger) {
        throw new Error('Invalid OpenAPI document. Missing "openapi" or "swagger" field.');
      }

      onImport(document, { type: 'paste' });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse content');
    }
  }, [pasteContent, onImport, onClose]);

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Import OpenAPI Specification</DialogTitle>
          <DialogDescription>
            Import an OpenAPI/Swagger specification from a URL, file, or paste the content directly.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="url" className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              URL
            </TabsTrigger>
            <TabsTrigger value="file" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              File
            </TabsTrigger>
            <TabsTrigger value="paste" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Paste
            </TabsTrigger>
          </TabsList>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <TabsContent value="url" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">OpenAPI Specification URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://api.example.com/openapi.json"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUrlImport()}
              />
              <p className="text-sm text-muted-foreground">
                Enter the URL of an OpenAPI 3.0 specification (JSON format)
              </p>
            </div>
          </TabsContent>

          <TabsContent value="file" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file">Upload OpenAPI File</Label>
              <Input
                id="file"
                type="file"
                accept=".json,.yaml,.yml"
                onChange={handleFileImport}
                disabled={loading}
              />
              <p className="text-sm text-muted-foreground">
                Select a JSON OpenAPI specification file from your computer
              </p>
            </div>
          </TabsContent>

          <TabsContent value="paste" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="paste">Paste OpenAPI Content</Label>
              <Textarea
                id="paste"
                placeholder="Paste your OpenAPI specification here..."
                value={pasteContent}
                onChange={(e) => setPasteContent(e.target.value)}
                rows={10}
                className="font-mono text-sm"
              />
              <p className="text-sm text-muted-foreground">
                Paste a JSON OpenAPI specification directly
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          {activeTab === 'url' && (
            <Button onClick={handleUrlImport} disabled={loading || !url.trim()}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Fetching...
                </>
              ) : (
                'Import from URL'
              )}
            </Button>
          )}
          {activeTab === 'file' && (
            <Button disabled>
              Select a file above
            </Button>
          )}
          {activeTab === 'paste' && (
            <Button onClick={handlePasteImport} disabled={!pasteContent.trim()}>
              Import
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}