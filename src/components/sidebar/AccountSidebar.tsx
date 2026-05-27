"use client";

import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { ThemeToggle } from "@/components/navigation/ThemeToggle";
import httpClient from "@/lib/httpClient";
import { selectUser } from "@/features/auth/store/selectors";
import { fetchMe, logout } from "@/features/auth/store/thunks";
import {
  formatOrderDate,
  orderStatusLabel,
  type OrderStatus,
} from "@/features/orders/types";
import {
  selectOrders,
  selectOrdersLoading,
} from "@/features/orders/store/selectors";
import { cancelOrder, deleteOrder, fetchMyOrders } from "@/features/orders/store/thunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type AccountSidebarProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function statusBadgeClass(status: OrderStatus): string {
  switch (status) {
    case "processing":
      return "bg-gold/20 text-ink border-gold/40";
    case "shipped":
      return "bg-sage/20 text-sage border-sage/40";
    case "delivered":
      return "bg-muted text-muted-foreground";
    case "cancelled":
      return "bg-destructive/10 text-destructive border-destructive/30";
    default:
      return "";
  }
}

export function AccountSidebar({ open, onOpenChange }: AccountSidebarProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const orders = useAppSelector(selectOrders);
  const ordersLoading = useAppSelector(selectOrdersLoading);

  function handleSheetOpenChange(next: boolean) {
    if (next && user) {
      setName(user.name);
      setEmail(user.email);
    }
    onOpenChange(next);
  }

  function loadOrders() {
    void dispatch(fetchMyOrders())
      .unwrap()
      .catch(() => toast.error("Could not load your orders."));
  }

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setIsSavingProfile(true);
    try {
      const body: { name?: string; email?: string } = {};
      if (name.trim() !== user.name) body.name = name.trim();
      if (email.trim() !== user.email) body.email = email.trim();

      if (Object.keys(body).length === 0) {
        toast.message("No changes to save.");
        return;
      }

      await httpClient.patch(`/users/${user.id}`, body);

      await dispatch(fetchMe()).unwrap();
      toast.success("Profile updated.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function handleCancelOrder(orderId: string) {
    try {
      await dispatch(cancelOrder(orderId)).unwrap();
      toast.success("Order cancelled.");
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Could not cancel order");
    }
  }

  async function handleDeleteOrder(orderId: string) {
    if (!confirm("Remove this order from your history?")) return;
    try {
      await dispatch(deleteOrder(orderId)).unwrap();
      toast.success("Order removed.");
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Could not delete order");
    }
  }

  if (!user) return null;

  return (
    <Sheet open={open} onOpenChange={handleSheetOpenChange}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto border-l border-gold/20 bg-parchment p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-gold/20 px-6 py-5 text-left">
          <SheetTitle className="font-playfair text-xl text-ink">
            Your account
          </SheetTitle>
          <SheetDescription className="font-lora text-warm-gray">
            Profile, preferences, and order history.
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="profile" className="px-6 py-4">
          <TabsList className="grid w-full grid-cols-3 font-lora">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="orders" onPointerDown={loadOrders}>
              Orders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <form onSubmit={handleProfileSave}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="profile-name">Name</FieldLabel>
                  <Input
                    id="profile-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="font-lora"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="profile-email">Email</FieldLabel>
                  <Input
                    id="profile-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="font-lora"
                    required
                  />
                </Field>
                <Button
                  type="submit"
                  className="rounded-md"
                  disabled={isSavingProfile}
                >
                  {isSavingProfile ? "Saving…" : "Save profile"}
                </Button>
              </FieldGroup>
            </form>
          </TabsContent>

          <TabsContent value="settings" className="mt-6 space-y-4">
            <p className="font-lora text-sm text-warm-gray">
              Full preferences are saved to your account.
            </p>
            <div className="flex items-center justify-between gap-4 rounded-md border border-border px-3 py-3">
              <div>
                <p className="font-lora text-sm text-ink">Quick theme</p>
                <p className="font-lora text-xs text-warm-gray">
                  Syncs when you save in Settings
                </p>
              </div>
              <ThemeToggle />
            </div>
            <Button variant="outline" className="w-full rounded-md font-lora" asChild>
              <Link href="/account/settings/appearance" onClick={() => onOpenChange(false)}>
                Appearance & language
              </Link>
            </Button>
            <Button variant="outline" className="w-full rounded-md font-lora" asChild>
              <Link href="/account/settings/notifications" onClick={() => onOpenChange(false)}>
                Notifications
              </Link>
            </Button>
            <Button variant="outline" className="w-full rounded-md font-lora" asChild>
              <Link href="/account/settings/security" onClick={() => onOpenChange(false)}>
                Password & security
              </Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-md font-lora"
              onClick={() => void dispatch(logout())}
            >
              Sign out
            </Button>
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            {ordersLoading ? (
              <p className="font-lora text-sm text-warm-gray">Loading orders…</p>
            ) : orders.length === 0 ? (
              <p className="font-lora text-sm text-warm-gray">
                No orders yet. When you place one, it will appear here.
              </p>
            ) : (
              <ul className="space-y-4">
                {orders.map((order) => (
                  <li
                    key={order._id}
                    className="rounded-md border border-gold/20 bg-card p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-playfair text-sm font-medium text-ink">
                          Order #{order._id.slice(-6).toUpperCase()}
                        </p>
                        <p className="font-lora text-xs text-warm-gray">
                          {formatOrderDate(order.createdAt)}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-lora capitalize",
                          statusBadgeClass(order.orderStatus)
                        )}
                      >
                        {orderStatusLabel(order.orderStatus)}
                      </Badge>
                    </div>
                    <ul className="mt-3 space-y-1 font-lora text-sm text-warm-gray">
                      {order.items.map((item, i) => (
                        <li key={`${order._id}-${i}`}>
                          {item.name} × {item.quantity}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-2 font-lora text-sm font-medium text-ink">
                      ${order.totalAmount.toFixed(2)}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {order.orderStatus === "processing" && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 font-lora text-destructive"
                          onClick={() => void handleCancelOrder(order._id)}
                        >
                          Cancel order
                        </Button>
                      )}
                      {order.orderStatus !== "processing" && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 font-lora text-destructive"
                          onClick={() => void handleDeleteOrder(order._id)}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
