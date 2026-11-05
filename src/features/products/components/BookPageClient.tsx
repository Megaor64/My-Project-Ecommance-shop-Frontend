"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { BookDetailPageClient } from "@/features/products/components/BookDetailPageClient";
import { useT } from "@/lib/i18n";

export function BookPageClient() {
  const searchParams = useSearchParams();
  const t = useT();
  const id = searchParams.get("id");

  if (!id) {
    return (
      <div className="text-center">
        <p className="font-lora text-warm-gray">{t("book.missingId")}</p>
        <Link
          href="/books"
          className="mt-4 inline-flex items-center gap-2 font-lora text-sm text-gold hover:underline"
        >
          <ArrowLeft className="size-4 rtl:rotate-180" />
          {t("book.backToCollection")}
        </Link>
      </div>
    );
  }

  return <BookDetailPageClient id={id} />;
}

