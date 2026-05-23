import { redirect } from "next/navigation";
import { AdminRegisterForm } from "@/components/auth/AdminRegisterForm";
import { fetchAuthPublicConfig } from "@/lib/auth-config";

export default async function AdminRegisterPage() {
  const { adminRegisterEnabled } = await fetchAuthPublicConfig();

  if (!adminRegisterEnabled) {
    redirect("/login");
  }

  return <AdminRegisterForm />;
}
