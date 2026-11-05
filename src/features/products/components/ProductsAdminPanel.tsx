"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import httpClient from "@/lib/httpClient";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import type { Book } from "@/features/products/types";
import { createProductFormSchema } from "@/features/products/schemas/productSchema";
import { formatAuthorDescription } from "@/features/products/utils/mapProductToBook";
import {
  selectAdminProducts,
  selectProductsLoading,
} from "@/features/products/store/selectors";
import { hydrateAdminProducts } from "@/features/products/store/slice";
import {
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
} from "@/features/products/store/thunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useFormatPrice } from "@/hooks/useFormatPrice";
import { useT } from "@/lib/i18n";

const emptyForm = {
  name: "",
  author: "",
  description: "",
  price: "",
  category: "",
  stock: "0",
  isActive: true,
};

type AdminStats = {
  userCount: number;
  salesByProduct: { productId: string; totalSold: number }[];
};

function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return fallback;
}

export function ProductsAdminPanel() {
  const dispatch = useAppDispatch();
  const formatPrice = useFormatPrice();
  const t = useT();
  const products = useAppSelector(selectAdminProducts);
  const isLoading = useAppSelector(selectProductsLoading);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Book | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [salesByProductId, setSalesByProductId] = useState<
    Record<string, number>
  >({});

  const loadStats = useCallback(async () => {
    try {
      const { data } = await httpClient.get<AdminStats>("/stats/admin");
      const map: Record<string, number> = {};
      for (const row of data.salesByProduct ?? []) {
        map[String(row.productId)] = row.totalSold;
      }
      setSalesByProductId(map);
    } catch {
      /* stats are supplementary */
    }
  }, []);

  const loadProducts = useCallback(async () => {
    try {
      const books = await dispatch(fetchProducts()).unwrap();
      dispatch(hydrateAdminProducts(books));
    } catch (err) {
      toast.error(typeof err === "string" ? err : t("admin.products.loadFailed"));
    }
  }, [dispatch, t]);

  useEffect(() => {
    void loadProducts();
    void loadStats();
  }, [loadProducts, loadStats]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setImageFile(null);
    setDialogOpen(true);
  }

  function combinedDescription() {
    return formatAuthorDescription(form.author, form.description);
  }

  function openEdit(book: Book) {
    setEditing(book);
    setForm({
      name: book.title,
      author: book.author,
      description: book.description,
      price: String(book.price),
      category: book.genre,
      stock: String(book.stock),
      isActive: true,
    });
    setImageFile(null);
    setDialogOpen(true);
  }

  function buildFormData() {
    const parsed = createProductFormSchema(t).safeParse({
      name: form.name,
      description: combinedDescription(),
      price: form.price,
      category: form.category,
      stock: form.stock,
      isActive: form.isActive,
    });
    if (!parsed.success) {
      const first = parsed.error.issues[0]?.message ?? t("common.generalError");
      throw new Error(first);
    }
    const values = parsed.data;
    const data = new FormData();
    data.append("name", values.name);
    data.append("description", values.description ?? "");
    data.append("price", String(values.price));
    data.append("category", values.category ?? "");
    data.append("stock", String(values.stock ?? 0));
    data.append("isActive", String(values.isActive));
    if (imageFile) data.append("image", imageFile);
    return data;
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      if (editing) {
        await dispatch(
          updateProduct({
            id: editing.id,
            formData: buildFormData(),
          })
        ).unwrap();
        toast.success(t("admin.products.updated"));
      } else {
        if (!imageFile) {
          throw new Error(t("admin.products.coverRequired"));
        }
        await dispatch(createProduct(buildFormData())).unwrap();
        toast.success(t("admin.products.created"));
      }
      setDialogOpen(false);
    } catch (err) {
      toast.error(getErrorMessage(err, t("admin.products.saveFailed")));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm(t("admin.products.confirmDelete"))) return;
    try {
      await dispatch(deleteProduct(id)).unwrap();
      toast.success(t("admin.products.deleted"));
    } catch (err) {
      toast.error(getErrorMessage(err, t("admin.products.deleteFailed")));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair text-3xl font-semibold text-ink">
            {t("admin.products.title")}
          </h1>
          <p className="mt-1 font-lora text-sm text-warm-gray">
            {t("admin.products.subtitle")}
          </p>
        </div>
        <Button type="button" className="rounded-md font-lora" onClick={openCreate}>
          {t("admin.products.add")}
        </Button>
      </div>

      {isLoading && products.length === 0 ? (
        <p className="font-lora text-sm text-warm-gray">{t("admin.products.loading")}</p>
      ) : products.length === 0 ? (
        <p className="font-lora text-sm text-warm-gray">{t("admin.products.empty")}</p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-lora">{t("common.title")}</TableHead>
                <TableHead className="font-lora">{t("common.category")}</TableHead>
                <TableHead className="font-lora">{t("common.price")}</TableHead>
                <TableHead className="font-lora">{t("admin.products.sold")}</TableHead>
                <TableHead className="font-lora text-end">{t("common.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((book) => (
                <TableRow key={book.id}>
                  <TableCell className="font-lora">{book.title}</TableCell>
                  <TableCell className="font-lora text-warm-gray">{book.genre}</TableCell>
                  <TableCell className="font-lora">{formatPrice(book.price)}</TableCell>
                  <TableCell className="font-lora text-warm-gray">
                    {salesByProductId[book.id] ?? 0}
                  </TableCell>
                  <TableCell className="text-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="font-lora"
                      onClick={() => openEdit(book)}
                    >
                      {t("common.edit")}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="font-lora text-destructive"
                      onClick={() => void handleDelete(book.id)}
                    >
                      {t("common.delete")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-playfair">
              {editing
                ? t("admin.products.dialogEdit")
                : t("admin.products.dialogNew")}
            </DialogTitle>
            <DialogDescription className="font-lora">
              {editing
                ? t("admin.products.dialogEditHint")
                : t("admin.products.dialogCreateHint")}
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="product-name">{t("common.name")}</FieldLabel>
              <Input
                id="product-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="font-lora"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="product-author">{t("common.author")}</FieldLabel>
              <Input
                id="product-author"
                value={form.author}
                onChange={(e) =>
                  setForm((f) => ({ ...f, author: e.target.value }))
                }
                className="font-lora"
                placeholder={t("admin.products.authorPlaceholder")}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="product-description">{t("common.description")}</FieldLabel>
              <Textarea
                id="product-description"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                className="font-lora min-h-24"
                placeholder={t("admin.products.descriptionPlaceholder")}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="product-price">{t("common.price")}</FieldLabel>
                <Input
                  id="product-price"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  className="font-lora"
                  required
                />
                <p className="mt-1 font-lora text-xs text-warm-gray">
                  {t("admin.products.priceHint")}
                </p>
              </Field>
              <Field>
                <FieldLabel htmlFor="product-stock">{t("common.stock")}</FieldLabel>
                <Input
                  id="product-stock"
                  type="number"
                  min={0}
                  value={form.stock}
                  onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                  className="font-lora"
                />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="product-category">{t("common.category")}</FieldLabel>
              <Input
                id="product-category"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="font-lora"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="product-image">{t("admin.products.coverImage")}</FieldLabel>
              {editing?.coverImage && !imageFile ? (
                <div className="relative mb-2 h-32 w-24 overflow-hidden rounded-sm border border-border">
                  <Image
                    src={editing.coverImage}
                    alt={t("book.currentCoverAlt", { title: editing.title })}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
              ) : null}
              <Input
                id="product-image"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="font-lora"
                onChange={(e) =>
                  setImageFile(e.target.files?.[0] ?? null)
                }
              />
              {editing ? (
                <p className="mt-1 font-lora text-xs text-warm-gray">
                  {t("admin.products.keepCover")}
                </p>
              ) : null}
            </Field>
            <div className="flex items-center gap-3">
              <Checkbox
                id="product-active"
                checked={form.isActive}
                onCheckedChange={(checked) =>
                  setForm((f) => ({ ...f, isActive: checked === true }))
                }
              />
              <Label htmlFor="product-active" className="font-lora text-sm">
                {t("admin.products.active")}
              </Label>
              {!form.isActive && (
                <Badge variant="outline" className="font-lora">
                  {t("admin.products.hidden")}
                </Badge>
              )}
            </div>
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="font-lora"
              onClick={() => setDialogOpen(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="button"
              className="font-lora"
              disabled={isSaving}
              onClick={() => void handleSave()}
            >
              {isSaving
                ? t("common.saving")
                : editing
                  ? t("admin.products.saveChanges")
                  : t("admin.products.create")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
