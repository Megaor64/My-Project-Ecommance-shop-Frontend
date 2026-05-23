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
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export function UsersAdminPanel() {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectAdminUsers);
  const status = useAppSelector(selectAdminUsersStatus);

  const loadUsers = useCallback(async () => {
    try {
      await dispatch(fetchAllUsers()).unwrap();
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Could not load users.");
    }
  }, [dispatch]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  async function handleRoleChange(userId: string, role: "customer" | "admin") {
    try {
      await dispatch(updateUserRole({ userId, role })).unwrap();
      toast.success("Role updated.");
      void loadUsers();
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Could not update role.");
    }
  }

  async function handleCanSellChange(userId: string, canSell: boolean) {
    try {
      await dispatch(
        updatePermissions({ userId, permissions: { canSell } })
      ).unwrap();
      toast.success("Permissions updated.");
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Could not update permissions.");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-playfair text-2xl text-ink">Users</h1>
        <p className="mt-1 font-lora text-sm text-warm-gray">
          Manage roles and seller permissions.
        </p>
      </div>

      {status === "loading" ? (
        <p className="font-lora text-sm text-warm-gray">Loading users…</p>
      ) : users.length === 0 ? (
        <p className="font-lora text-sm text-warm-gray">No users found.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead>Can sell</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u._id}>
                <TableCell className="font-medium">{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-lora capitalize">
                    {u.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  {u.isVerified ? (
                    <span className="text-sage">Yes</span>
                  ) : (
                    <span className="text-warm-gray">No</span>
                  )}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={u.permissions?.canSell ?? u.role === "admin"}
                    disabled={u.role === "admin"}
                    onCheckedChange={(checked) =>
                      void handleCanSellChange(u._id, checked)
                    }
                    aria-label={`Can sell for ${u.name}`}
                  />
                </TableCell>
                <TableCell className="text-right">
                  {u.role === "admin" ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="font-lora"
                      onClick={() => void handleRoleChange(u._id, "customer")}
                    >
                      Make customer
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="font-lora"
                      onClick={() => void handleRoleChange(u._id, "admin")}
                    >
                      Make admin
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
