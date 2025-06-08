import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Upload, Link, FileText, Loader2, FileJson2 } from "lucide-react";
import type { OpenAPIDocument, OpenAPIData } from "../types";

export default function NewFile() {
  const [activeTab, setActiveTab] = useState<'url' | 'file' | 'paste'>('url');
  const [url, setUrl] = useState('');
  const [pasteContent, setPasteContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inferFileName = (document: OpenAPIDocument): string => {
    // Try to create a meaningful filename from the API title
    const title = document.info.title || 'openapi';
    // Convert to kebab-case and remove special characters
    const kebabCase = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    
    return kebabCase || 'openapi';
  };

  const createFile = async (document: OpenAPIDocument, source: { type: 'url' | 'file' | 'paste', url?: string, fileName?: string }) => {
    console.log('createFile called with document:', document);
    console.log('Source info:', source);
    
    // Infer filename from the document
    const inferredName = inferFileName(document);
    const fileName = source.fileName || inferredName;
    console.log('Using filename:', fileName);

    // First, save the OpenAPI spec to public resources
    console.log('Saving OpenAPI spec to /api/openapi/save');
    const saveResponse = await fetch('/api/openapi/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: fileName,
        content: JSON.stringify(document, null, 2),
      }),
    });

    console.log('Save response status:', saveResponse.status);
    if (!saveResponse.ok) {
      const errorText = await saveResponse.text();
      console.error('Save failed with response:', errorText);
      throw new Error('Failed to save OpenAPI specification');
    }

    const saveResult = await saveResponse.json();
    console.log('Save result:', saveResult);
    const { resourcePath } = saveResult;

    // Prepare the OpenAPI data
    const data: OpenAPIData = {
      source: {
        type: source.type,
        url: source.url,
        fileName: source.fileName,
        lastFetched: new Date().toISOString(),
      },
      resourcePath,
      document,
    };
    console.log('Prepared OpenAPI data:', data);

    // Create the IDE file
    console.log('Creating IDE file at /api/ide/new/openapi');
    const createResponse = await fetch('/api/ide/new/openapi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: fileName,
        data,
      }),
    });

    console.log('Create response status:', createResponse.status);
    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      console.error('Create failed with response:', errorText);
      throw new Error('Failed to create OpenAPI file');
    }

    const createResult = await createResponse.json();
    console.log('Create result:', createResult);
    const { id } = createResult;
    return { id };
  };

  const handleUrlImport = useCallback(async () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    console.log('Starting URL import for:', url);
    setLoading(true);
    setError(null);

    try {
      console.log('Fetching OpenAPI spec from /api/openapi/fetch');
      console.log('Request body:', JSON.stringify({ url }));
      
      const response = await fetch('/api/openapi/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      }).catch(err => {
        console.error('Fetch network error:', err);
        throw err;
      });

      console.log('Fetch response status:', response.status);
      console.log('Fetch response headers:', Object.fromEntries(response.headers.entries()));

      let result;
      try {
        const responseText = await response.text();
        console.log('Raw response text:', responseText);
        result = JSON.parse(responseText);
        console.log('Parsed response:', result);
      } catch (e) {
        console.error('Failed to parse response:', e);
        throw new Error('Failed to parse server response');
      }

      if (!response.ok) {
        console.error('Response not OK. Error:', result?.error);
        throw new Error(result?.error || 'Failed to fetch OpenAPI specification');
      }

      console.log('Creating file with document:', result.data || result);
      const { id } = await createFile(result.data || result, { type: 'url', url });
      
      console.log('File created with ID:', id);
      // Navigate to the created file using window.location
      window.location.href = `/ide/openapi/${id}`;
    } catch (err) {
      console.error('Import failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to import from URL');
    } finally {
      setLoading(false);
    }
  }, [url]);

  const handleFileImport = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const text = await file.text();
      let document: OpenAPIDocument;
      
      // Try to parse as JSON first
      try {
        document = JSON.parse(text);
      } catch {
        // If JSON parsing fails and it's a YAML file, inform the user
        if (file.name.endsWith('.yaml') || file.name.endsWith('.yml')) {
          throw new Error('YAML files are not yet supported. Please convert to JSON format.');
        }
        throw new Error('Invalid JSON format');
      }

      // Validate it's an OpenAPI document
      if (!document.openapi && !document.swagger) {
        throw new Error('Invalid OpenAPI document. Missing "openapi" or "swagger" field.');
      }

      const { id } = await createFile(document, { type: 'file', fileName: file.name });
      
      // Navigate to the created file using window.location
      window.location.href = `/ide/openapi/${id}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file');
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePasteImport = useCallback(async () => {
    if (!pasteContent.trim()) {
      setError('Please paste OpenAPI content');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const document = JSON.parse(pasteContent);

      // Validate it's an OpenAPI document
      if (!document.openapi && !document.swagger) {
        throw new Error('Invalid OpenAPI document. Missing "openapi" or "swagger" field.');
      }

      const { id } = await createFile(document, { type: 'paste' });
      
      // Navigate to the created file using window.location
      window.location.href = `/ide/openapi/${id}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse content');
    } finally {
      setLoading(false);
    }
  }, [pasteContent]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <FileJson2 className="h-12 w-12 text-primary" />
          </div>
          <CardTitle>Import OpenAPI Specification</CardTitle>
          <CardDescription>
            Import an OpenAPI/Swagger specification from a URL, file, or paste the content directly.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
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
              <Button 
                onClick={handleUrlImport} 
                disabled={loading || !url.trim()}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Fetching...
                  </>
                ) : (
                  'Import from URL'
                )}
              </Button>
            </TabsContent>

            <TabsContent value="file" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file">Upload OpenAPI File</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".json"
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
              <Button 
                onClick={handlePasteImport} 
                disabled={loading || !pasteContent.trim()}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Import'
                )}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}