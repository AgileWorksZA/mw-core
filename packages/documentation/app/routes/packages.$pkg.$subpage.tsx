import * as React from "react";
import { useLoaderData, Link, type LoaderFunctionArgs } from "react-router";
import { data } from "react-router";
import { loadPackageSubpageContent } from "~/lib/content-loader";
import { MDXContent, processMarkdownContent } from "~/components/mdx-components";
import { getPreferences } from "~/lib/theme.server";
import { TableOfContents, extractTableOfContents } from "~/components/table-of-contents";
import { DocSearch } from "~/components/doc-search";
import { Breadcrumb } from "~/components/breadcrumb";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const packageName = params.pkg;
  const subpage = params.subpage;
  
  if (!packageName || !subpage) {
    throw new Response("Page not found", { status: 404 });
  }
  
  const content = await loadPackageSubpageContent(packageName, subpage);
  
  if (!content) {
    throw new Response("Page not found", { status: 404 });
  }
  
  // Get current theme preference
  const preferences = await getPreferences(request);
  const theme = preferences.theme === 'light' ? 'light' : 'dark';
  
  // Process markdown with syntax highlighting on the server
  const processedHtml = await processMarkdownContent(content.content, theme);
  
  // Extract table of contents
  const tableOfContents = extractTableOfContents(content.content);
  
  return data({
    packageName,
    subpage,
    content,
    processedHtml,
    theme,
    tableOfContents,
  });
}

export default function PackageSubpage() {
  const { packageName, subpage, content, processedHtml, tableOfContents } = useLoaderData<typeof loader>();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb 
        items={[
          { label: "Packages", href: "/packages" },
          { label: packageName, href: `/packages/${packageName}` },
          { label: content.meta.title || subpage }
        ]} 
        className="mb-4"
      />
      <div className="flex gap-8">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-6">
            <h1 className="text-4xl font-bold">
              {content.meta.title}
            </h1>
            <DocSearch 
              content={content.content} 
              packageName={packageName} 
            />
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            {content.meta.description}
          </p>
          
          <div className="mt-8 prose prose-gray dark:prose-invert max-w-none">
            <MDXContent processedHtml={processedHtml} content={content.content} />
          </div>
        </div>
        
        {/* Table of Contents - Sticky Sidebar */}
        {tableOfContents.length > 0 && (
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
              <TableOfContents items={tableOfContents} />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}