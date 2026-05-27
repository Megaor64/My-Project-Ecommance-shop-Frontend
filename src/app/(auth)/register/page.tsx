"use client";

import { useEffect, useState } from "react";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { fetchAuthPublicConfig } from "@/lib/auth-config";

export default function RegisterPage() {
  const [showAdminRegister, setShowAdminRegister] = useState(false);

  useEffect(() => {
    void fetchAuthPublicConfig().then((config) => {
      setShowAdminRegister(config.adminRegisterEnabled);
    });
  }, []);

  return <RegisterForm showAdminRegister={showAdminRegister} />;
}
