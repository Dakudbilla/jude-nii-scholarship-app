"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

interface CopyLinkButtonProps {
  token: string;
}

/**
 * Copies the endorsement link for a given token to the clipboard.
 * Shows transient "Link Copied!" feedback.
 */
export function CopyLinkButton({ token }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const link = `${window.location.origin}/endorse/${token}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="secondary"
      onClick={handleCopy}
      className={`gap-2 ${
        copied
          ? "text-green-600 border-green-200 bg-green-50 hover:bg-green-100"
          : "bg-white hover:bg-slate-50"
      }`}
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      {copied ? "Link Copied!" : "Copy Endorsement Link"}
    </Button>
  );
}
