import type * as React from "react";
import type { ReactNode } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { cn } from "~/lib/utils";

export function PanelCard({
  header,
  body,
  footer,
  ...props
}: React.ComponentProps<"div"> & {
  header?: ReactNode;
  body?: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <Card {...props} className={cn(props.className)}>
      {header && (
        <CardHeader>
          <CardTitle className="text-sm text-nowrap bg-card px-1">
            {header}
          </CardTitle>
        </CardHeader>
      )}
      {body && <CardContent>{body}</CardContent>}
      {footer && (
        <CardFooter className="flex justify-end gap-2">{footer}</CardFooter>
      )}
    </Card>
  );
}
