import { useParams, useLoaderData, type LoaderFunctionArgs } from "react-router";
import { data } from "react-router";
import { loadGuide } from "~/lib/content-loader";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

export async function loader({ params }: LoaderFunctionArgs) {
  const guideName = params.guide!;
  const guide = await loadGuide(guideName);
  
  if (!guide) {
    throw new Response("Guide not found", { status: 404 });
  }
  
  return data({ guide });
}

export default function GuideDetail() {
  const { guide } = useLoaderData<typeof loader>();
  
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
          
          {/* Content */}
          <article className="prose prose-gray dark:prose-invert max-w-none">
            {/* In a real implementation, we'd render MDX here */}
            <div dangerouslySetInnerHTML={{ __html: guide.content }} />
          </article>
        </div>
      </div>
    </div>
  );
}