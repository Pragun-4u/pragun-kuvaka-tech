"use client";

import { useEffect, useState } from "react";

function ChatTimestamp({ timestamp }: { timestamp: string }) {
  const [formatted, setFormatted] = useState("");

  useEffect(() => {
    setFormatted(new Date(timestamp).toLocaleString());

    return () => {};
  }, [timestamp]);

  return (
    <div className="flex items-center justify-center">
      <span className="text-sm text-muted-foreground">{formatted}</span>
    </div>
  );
}

export default ChatTimestamp;
