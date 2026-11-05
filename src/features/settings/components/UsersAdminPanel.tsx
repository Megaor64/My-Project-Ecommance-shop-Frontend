"use client";

import { useCallback, useEffect } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  selectAdminUsers,
  selectAdminUsersStatus,
} from "@/features/settings/store/selectors";
import {
  fetchAllUsers,
  updatePermissions,
  updateUserRole,
} from "@/features/settings/store/thunks";
import { useT, type TranslationKey } from "@/lib/i18n";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export function UsersAdminPanel() {
  const dispatch = useAppDispatch();
  const t = useT();
  const users = useAppSelector(selectAdminUsers);
  const status = useAppSelector(selectAdminUsersStatus);

  const loadUsers = useCallback(async () => {
    try {
      await dispatch(fetchAllUsers()).unwrap();
    } catch (err) {
      toast.error(typeof err === "string" ? err : t("admin.users.loadFailed"));
    }
  }, [dispatch, t]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  async function handleRoleChange(userId: string, role: "customer" | "admin") {
    try {
      await dispatch(updateUserRole({ userId, role })).unwrap();
      toast.success(t("admin.users.roleUpdated"));
      void loadUsers();
    } catch (err) {
      toast.error(typeof err === "string" ? err : t("admin.users.roleFailed"));
    }
  }

  async function handleCanSellChange(userId: string, canSell: boolean) {
    try {
      await dispatch(
        updatePermissions({ userId, permissions: { canSell } })
      ).unwrap();
      toast.success(t("admin.users.permissionsUpdated"));
    } catch (err) {
      toast.error(
        typeof err === "string" ? err : t("admin.users.permissionsFailed")
      );
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-playfair text-2xl text-ink">
          {t("admin.users.title")}
        </h1>
        <p className="mt-1 font-lora text-sm text-warm-gray">
          {t("admin.users.subtitle")}
        </p>
      </div>

      {status === "loading" ? (
        <p className="font-lora text-sm text-warm-gray">
          {t("admin.users.loading")}
        </p>
      ) : users.length === 0 ? (
        <p className="font-lora text-sm text-warm-gray">
          {t("admin.users.empty")}
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("common.name")}</TableHead>
              <TableHead>{t("common.email")}</TableHead>
              <TableHead>{t("common.role")}</TableHead>
              <TableHead>{t("common.verified")}</TableHead>
              <TableHead>{t("admin.users.canSell")}</TableHead>
              <TableHead className="text-end">{t("common.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u._id}>
                <TableCell className="font-medium">{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-lora capitalize">
                    {t(`admin.users.role.${u.role}` as TranslationKey)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {u.isVerified ? (
                    <span className="text-sage">{t("common.yes")}</span>
                  ) : (
                    <span className="text-warm-gray">{t("common.no")}</span>
                  )}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={u.permissions?.canSell ?? u.role === "admin"}
                    disabled={u.role === "admin"}
                    onCheckedChange={(checked) =>
                      void handleCanSellChange(u._id, checked)
                    }
                    aria-label={t("admin.users.canSellFor", { name: u.name })}
                  />
                </TableCell>
                <TableCell className="text-end">
                  {u.role === "admin" ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="font-lora"
                      onClick={() => void handleRoleChange(u._id, "customer")}
                    >
                      {t("admin.users.makeCustomer")}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="font-lora"
                      onClick={() => void handleRoleChange(u._id, "admin")}
                    >
                      {t("admin.users.makeAdmin")}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
