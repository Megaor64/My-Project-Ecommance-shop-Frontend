import { Suspense } from "react";
import { VerifyEmailPageClient } from "@/components/auth/VerifyEmailPageClient";

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailPageClient />
    </Suspense>
  );
}
