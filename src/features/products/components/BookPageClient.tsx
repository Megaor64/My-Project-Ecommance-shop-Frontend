"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { BookDetailPageClient } from "@/features/products/components/BookDetailPageClient";

export function BookPageClient() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  if (!id) {
    return (
      <div className="text-center">
        <p className="font-lora text-warm-gray">Missing book id.</p>
        <Link
          href="/books"
          className="mt-4 inline-flex items-center gap-2 font-lora text-sm text-gold hover:underline"
        >
          <ArrowLeft className="size-4" />
          Back to collection
        </Link>
      </div>
    );
  }

  return <BookDetailPageClient id={id} />;
}

