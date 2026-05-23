import { RegisterForm } from "@/components/auth/RegisterForm";
import { fetchAuthPublicConfig } from "@/lib/auth-config";

export default async function RegisterPage() {
  const { adminRegisterEnabled } = await fetchAuthPublicConfig();

  return <RegisterForm showAdminRegister={adminRegisterEnabled} />;
}
