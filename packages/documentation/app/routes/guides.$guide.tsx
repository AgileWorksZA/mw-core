import { useParams, useLoaderData, type LoaderFunctionArgs } from "react-router";
import { data } from "react-router";
import { loadGuide } from "~/lib/content-loader";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { MDXContent, processMarkdownContent } from "~/components/mdx-components";
import { getPreferences } from "~/lib/theme.server";
import { TableOfContents, extractTableOfContents } from "~/components/table-of-contents";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const guideName = params.guide!;
  const guide = await loadGuide(guideName);
  
  if (!guide) {
    throw new Response("Guide not found", { status: 404 });
  }
  
  // Get current theme preference
  const preferences = await getPreferences(request);
  const theme = preferences.theme === 'light' ? 'light' : 'dark';
  
  // Process markdown with syntax highlighting on the server
  const processedHtml = await processMarkdownContent(guide.content, theme);
  
  // Extract table of contents
  const tableOfContents = extractTableOfContents(guide.content);
  
  return data({ guide, processedHtml, theme, tableOfContents });
}

export default function GuideDetail() {
  const { guide, processedHtml, tableOfContents } = useLoaderData<typeof loader>();
  
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          {/* Back link */}
          <Link
            to="/guides"
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to guides
          </Link>
          
          {/* Header */}
          <header className="mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
              {guide.meta.title}
            </h1>
            {guide.meta.description && (
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {guide.meta.description}
              </p>
            )}
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-500">
              {guide.readingTime.text}
            </div>
          </header>
          
          {/* Content with Table of Contents */}
          <div className="flex gap-8">
            <article className="prose prose-gray dark:prose-invert max-w-none flex-1 min-w-0">
              <MDXContent processedHtml={processedHtml} content={guide.content} />
            </article>
            
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
      </div>
    </div>
  );
}