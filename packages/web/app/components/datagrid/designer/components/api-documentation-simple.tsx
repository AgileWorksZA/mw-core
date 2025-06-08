import type { OpenAPIV3 } from "openapi-types";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useDesigner } from "../types";

interface ApiDocumentationSimpleProps {
  method?: any;
  apiDoc?: OpenAPIV3.Document;
}

export function ApiDocumentationSimple({ method, apiDoc }: ApiDocumentationSimpleProps) {
  const documentation = useDesigner((state) => state.context.documentation);
  const apiDocument = apiDoc || documentation;
  const [showRedoc, setShowRedoc] = useState(false);

  React.useEffect(() => {
    if (showRedoc && apiDocument) {
      console.log('[ApiDocumentationSimple] Loading Redoc for document:', apiDocument);
      
      // Load Redoc from CDN
      const script = document.createElement('script');
      script.src = 'https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js';
      script.async = true;
      
      script.onload = () => {
        // @ts-ignore
        if (window.Redoc) {
          const container = document.getElementById('redoc-container-simple');
          if (container) {
            try {
              // @ts-ignore
              window.Redoc.init(apiDocument, {
                scrollYOffset: 0,
                hideDownloadButton: false,
                disableSearch: false,
              }, container);
              console.log('[ApiDocumentationSimple] Redoc initialized');
            } catch (err) {
              console.error('[ApiDocumentationSimple] Redoc init error:', err);
            }
          }
        }
      };

      document.head.appendChild(script);
    }
  }, [showRedoc, apiDocument]);

  if (!apiDocument) return null;

  return (
    <div className="w-full">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setShowRedoc(false)}
          className={`px-4 py-2 rounded ${!showRedoc ? 'bg-primary text-white' : 'bg-gray-200'}`}
        >
          Overview
        </button>
        <button
          onClick={() => setShowRedoc(true)}
          className={`px-4 py-2 rounded ${showRedoc ? 'bg-primary text-white' : 'bg-gray-200'}`}
        >
          Redoc View
        </button>
      </div>

      {!showRedoc ? (
        <Card>
          <CardHeader>
            <CardTitle>{apiDocument.info.title || "API Documentation"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{apiDocument.info.description || "No description available"}</p>
            <p className="mt-2">Version: {apiDocument.info.version}</p>
          </CardContent>
        </Card>
      ) : (
        <div id="redoc-container-simple" style={{ minHeight: '600px' }} />
      )}
    </div>
  );
}