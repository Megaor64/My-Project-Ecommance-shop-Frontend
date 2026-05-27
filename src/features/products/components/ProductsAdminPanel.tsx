"use client";

import { useCallback, useEffect, useState } from "react";
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
import { productFormSchema } from "@/features/products/schemas/productSchema";
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
      toast.error(typeof err === "string" ? err : "Could not load products.");
    }
  }, [dispatch]);

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
      stock: "0",
      isActive: true,
    });
    setImageFile(null);
    setDialogOpen(true);
  }

  function buildFormData() {
    const parsed = productFormSchema.safeParse({
      name: form.name,
      description: combinedDescription(),
      price: form.price,
      category: form.category,
      stock: form.stock,
      isActive: form.isActive,
    });
    if (!parsed.success) {
      const first = parsed.error.issues[0]?.message ?? "Invalid form";
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
        const parsed = productFormSchema.safeParse({
          name: form.name,
          description: combinedDescription(),
          price: form.price,
          category: form.category,
          stock: form.stock,
          isActive: form.isActive,
        });
        if (!parsed.success) {
          throw new Error(parsed.error.issues[0]?.message ?? "Invalid form");
        }
        await dispatch(
          updateProduct({
            id: editing.id,
            body: {
              name: parsed.data.name,
              description: parsed.data.description,
              price: parsed.data.price,
              category: parsed.data.category,
              stock: parsed.data.stock,
              isActive: parsed.data.isActive,
            },
          })
        ).unwrap();
        toast.success("Product updated.");
      } else {
        if (!imageFile) {
          throw new Error("Cover image is required for new products.");
        }
        await dispatch(createProduct(buildFormData())).unwrap();
        toast.success("Product created.");
      }
      setDialogOpen(false);
    } catch (err) {
      toast.error(getErrorMessage(err, "Save failed"));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this product?")) return;
    try {
      await dispatch(deleteProduct(id)).unwrap();
      toast.success("Product deleted.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Delete failed"));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-playfair text-3xl font-semibold text-ink">Products</h1>
          <p className="mt-1 font-lora text-sm text-warm-gray">
            Create, edit, and remove catalog items.
          </p>
        </div>
        <Button type="button" className="rounded-md font-lora" onClick={openCreate}>
          Add product
        </Button>
      </div>

      {isLoading && products.length === 0 ? (
        <p className="font-lora text-sm text-warm-gray">Loading products…</p>
      ) : products.length === 0 ? (
        <p className="font-lora text-sm text-warm-gray">No products in the catalog yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-lora">Title</TableHead>
                <TableHead className="font-lora">Category</TableHead>
                <TableHead className="font-lora">Price</TableHead>
                <TableHead className="font-lora">Sold</TableHead>
                <TableHead className="font-lora text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((book) => (
                <TableRow key={book.id}>
                  <TableCell className="font-lora">{book.title}</TableCell>
                  <TableCell className="font-lora text-warm-gray">{book.genre}</TableCell>
                  <TableCell className="font-lora">${book.price.toFixed(2)}</TableCell>
                  <TableCell className="font-lora text-warm-gray">
                    {salesByProductId[book.id] ?? 0}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="font-lora"
                      onClick={() => openEdit(book)}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="font-lora text-destructive"
                      onClick={() => void handleDelete(book.id)}
                    >
                      Delete
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
              {editing ? "Edit product" : "New product"}
            </DialogTitle>
            <DialogDescription className="font-lora">
              {editing
                ? "Update fields below. Image upload applies only when creating."
                : "All fields match the catalog API. Upload a cover image (JPEG, PNG, WebP)."}
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="product-name">Name</FieldLabel>
              <Input
                id="product-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="font-lora"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="product-author">Author</FieldLabel>
              <Input
                id="product-author"
                value={form.author}
                onChange={(e) =>
                  setForm((f) => ({ ...f, author: e.target.value }))
                }
                className="font-lora"
                placeholder="e.g. Elena Marchetti"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="product-description">Description</FieldLabel>
              <Textarea
                id="product-description"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                className="font-lora min-h-24"
                placeholder="Synopsis or back-cover copy (without author line)"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="product-price">Price</FieldLabel>
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
              </Field>
              <Field>
                <FieldLabel htmlFor="product-stock">Stock</FieldLabel>
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
              <FieldLabel htmlFor="product-category">Category</FieldLabel>
              <Input
                id="product-category"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="font-lora"
              />
            </Field>
            {!editing && (
              <Field>
                <FieldLabel htmlFor="product-image">Cover image</FieldLabel>
                <Input
                  id="product-image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="font-lora"
                  onChange={(e) =>
                    setImageFile(e.target.files?.[0] ?? null)
                  }
                />
              </Field>
            )}
            <div className="flex items-center gap-3">
              <Checkbox
                id="product-active"
                checked={form.isActive}
                onCheckedChange={(checked) =>
                  setForm((f) => ({ ...f, isActive: checked === true }))
                }
              />
              <Label htmlFor="product-active" className="font-lora text-sm">
                Active in storefront
              </Label>
              {!form.isActive && (
                <Badge variant="outline" className="font-lora">
                  Hidden
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
              Cancel
            </Button>
            <Button
              type="button"
              className="font-lora"
              disabled={isSaving}
              onClick={() => void handleSave()}
            >
              {isSaving ? "Saving…" : editing ? "Save changes" : "Create product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
