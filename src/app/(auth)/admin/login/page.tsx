"use client";

import { useEffect, useState } from "react";
import { AdminLoginForm } from "@/components/auth/AdminLoginForm";
import { fetchAuthPublicConfig } from "@/lib/auth-config";

export default function AdminLoginPage() {
  const [showAdminRegister, setShowAdminRegister] = useState(false);

  useEffect(() => {
    void fetchAuthPublicConfig().then((config) => {
      setShowAdminRegister(config.adminRegisterEnabled);
    });
  }, []);

  return <AdminLoginForm showAdminRegister={showAdminRegister} />;
}
