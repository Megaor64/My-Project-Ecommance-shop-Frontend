import { AdminLoginForm } from "@/components/auth/AdminLoginForm";
import { fetchAuthPublicConfig } from "@/lib/auth-config";

export default async function AdminLoginPage() {
  const { adminRegisterEnabled } = await fetchAuthPublicConfig();

  return <AdminLoginForm showAdminRegister={adminRegisterEnabled} />;
}
