"use client";

import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { ThemeToggle } from "@/components/navigation/ThemeToggle";
import httpClient from "@/lib/httpClient";
import { selectUser } from "@/features/auth/store/selectors";
import { fetchMe, logout } from "@/features/auth/store/thunks";
import { formatOrderDate, type OrderStatus } from "@/features/orders/types";
import {
  selectOrders,
  selectOrdersLoading,
} from "@/features/orders/store/selectors";
import { cancelOrder, deleteOrder, fetchMyOrders } from "@/features/orders/store/thunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useFormatPrice } from "@/hooks/useFormatPrice";
import { useLocale, useT, type TranslationKey } from "@/lib/i18n";
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
  const formatPrice = useFormatPrice();
  const t = useT();
  const { locale } = useLocale();
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
      .catch(() => toast.error(t("orders.loadFailed")));
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
        toast.message(t("account.noChanges"));
        return;
      }

      await httpClient.patch(`/users/${user.id}`, body);

      await dispatch(fetchMe()).unwrap();
      toast.success(t("account.profileUpdated"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("account.updateFailed"));
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function handleCancelOrder(orderId: string) {
    try {
      await dispatch(cancelOrder(orderId)).unwrap();
      toast.success(t("orders.cancelled"));
    } catch (err) {
      toast.error(typeof err === "string" ? err : t("orders.cancelFailed"));
    }
  }

  async function handleDeleteOrder(orderId: string) {
    if (!confirm(t("orders.confirmRemove"))) return;
    try {
      await dispatch(deleteOrder(orderId)).unwrap();
      toast.success(t("orders.removed"));
    } catch (err) {
      toast.error(typeof err === "string" ? err : t("orders.removeFailed"));
    }
  }

  if (!user) return null;

  return (
    <Sheet open={open} onOpenChange={handleSheetOpenChange}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto border-s border-gold/20 bg-parchment p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-gold/20 px-6 py-5 text-start">
          <SheetTitle className="font-playfair text-xl text-ink">
            {t("account.panelTitle")}
          </SheetTitle>
          <SheetDescription className="font-lora text-warm-gray">
            {t("account.panelDescription")}
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="profile" className="px-6 py-4">
          <TabsList className="grid w-full grid-cols-3 font-lora">
            <TabsTrigger value="profile">{t("account.tab.profile")}</TabsTrigger>
            <TabsTrigger value="settings">{t("account.tab.settings")}</TabsTrigger>
            <TabsTrigger value="orders" onPointerDown={loadOrders}>
              {t("account.tab.orders")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <form onSubmit={handleProfileSave}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="profile-name">{t("common.name")}</FieldLabel>
                  <Input
                    id="profile-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="font-lora"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="profile-email">{t("common.email")}</FieldLabel>
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
                  {isSavingProfile ? t("common.saving") : t("account.saveProfile")}
                </Button>
              </FieldGroup>
            </form>
          </TabsContent>

          <TabsContent value="settings" className="mt-6 space-y-4">
            <p className="font-lora text-sm text-warm-gray">
              {t("account.prefsSaved")}
            </p>
            <div className="flex items-center justify-between gap-4 rounded-md border border-border px-3 py-3">
              <div>
                <p className="font-lora text-sm text-ink">{t("account.quickTheme")}</p>
                <p className="font-lora text-xs text-warm-gray">
                  {t("account.quickThemeHint")}
                </p>
              </div>
              <ThemeToggle />
            </div>
            <Button variant="outline" className="w-full rounded-md font-lora" asChild>
              <Link href="/account/settings/appearance" onClick={() => onOpenChange(false)}>
                {t("account.appearanceLink")}
              </Link>
            </Button>
            <Button variant="outline" className="w-full rounded-md font-lora" asChild>
              <Link href="/account/settings/notifications" onClick={() => onOpenChange(false)}>
                {t("account.notificationsLink")}
              </Link>
            </Button>
            <Button variant="outline" className="w-full rounded-md font-lora" asChild>
              <Link href="/account/settings/security" onClick={() => onOpenChange(false)}>
                {t("account.securityLink")}
              </Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full rounded-md font-lora"
              onClick={() => void dispatch(logout())}
            >
              {t("account.signOut")}
            </Button>
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            {ordersLoading ? (
              <p className="font-lora text-sm text-warm-gray">{t("orders.loading")}</p>
            ) : orders.length === 0 ? (
              <p className="font-lora text-sm text-warm-gray">
                {t("orders.empty")}
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
                          {t("orders.orderNumber", {
                            id: order._id.slice(-6).toUpperCase(),
                          })}
                        </p>
                        <p className="font-lora text-xs text-warm-gray">
                          {formatOrderDate(order.createdAt, locale)}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-lora capitalize",
                          statusBadgeClass(order.orderStatus)
                        )}
                      >
                        {t(`orders.status.${order.orderStatus}` as TranslationKey)}
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
                      {formatPrice(order.totalAmount)}
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
                          {t("orders.cancel")}
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
                          {t("common.delete")}
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
