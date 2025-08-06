"use client"; // This is required for Error components

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <div className="flex flex-col items-center gap-4">
        <AlertTriangle className="h-16 w-16 text-destructive" />
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Something went wrong!
        </h1>
        <p className="max-w-md text-muted-foreground">
          We've encountered an unexpected error. Please try to refresh the page
          or click the button below to try again.
        </p>
        <Button onClick={() => reset()} className="mt-4">
          <RefreshCw className="mr-2 h-4 w-4" />
          Try again
        </Button>
      </div>
    </main>
  );
}
