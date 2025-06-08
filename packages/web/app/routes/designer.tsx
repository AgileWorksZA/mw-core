import React from "react";
import { type LoaderFunctionArgs, useLoaderData } from "react-router";
import { logger } from "~/components/datagrid/data-grid/logger";
import { Designer } from "~/components/datagrid/designer/designer";
import { DesignerContext } from "~/components/datagrid/designer/types";

// Loader function for server-side data fetching
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  console.log(url);
  const apiUri = url.searchParams.get("uri");
  let apiData = null;
  let apiUrl = null;
  let error = null;

  // If API URI is provided, fetch the data
  if (apiUri) {
    try {
      // Use the API URI directly - it should already contain the full URL with protocol
      apiUrl = apiUri;
      logger.info(`Fetching data from: ${apiUrl}`);

      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      apiData = await response.json();
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
      logger.error("Error loading data:", error);
    }
  }

  console.log({
    apiData,
    apiUrl,
    error,
  });
  return {
    apiData,
    apiUrl,
    error,
  };
}

export default function TableDesignerRoute() {
  return <TableDesignerContent />;
}

function TableDesignerContent() {
  const loaderData = useLoaderData<typeof loader>();
  console.log(loaderData);

  // Pre-populate the designer context with the API data if loaded
  React.useEffect(() => {
    if (loaderData.apiUrl) {
      DesignerContext.trigger.update({
        update: {
          apiData: loaderData.apiData,
          apiUrl: loaderData.apiUrl || undefined,
          error: loaderData.error || null,
        },
      });
    }
  }, [loaderData]);

  return (
    <div className="w-full h-full overflow-hidden">
      <Designer />
    </div>
  );
}
