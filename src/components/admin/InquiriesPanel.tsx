"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { mapInquiry, type Inquiry, type InquiryStatus } from "@/lib/inquiries";
import httpClient from "@/lib/httpClient";
import { cn } from "@/lib/utils";

type FilterTab = "all" | InquiryStatus;

function statusBadge(status: InquiryStatus) {
  const classes: Record<InquiryStatus, string> = {
    new: "bg-gold/20 text-ink border-gold/40",
    read: "bg-sage/15 text-sage border-sage/30",
    replied: "bg-muted text-muted-foreground",
  };
  return (
    <Badge variant="outline" className={cn("font-lora capitalize", classes[status])}>
      {status}
    </Badge>
  );
}

export function InquiriesPanel() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [replyOpen, setReplyOpen] = useState(false);
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const loadInquiries = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await httpClient.get<Record<string, unknown>[]>("/inquiries");
      setInquiries(
        Array.isArray(data) ? data.map((item) => mapInquiry(item)) : []
      );
    } catch {
      toast.error("Could not load inquiries.");
      setInquiries([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadInquiries();
  }, [loadInquiries]);

  const filtered = useMemo(() => {
    if (filter === "all") return inquiries;
    return inquiries.filter((i) => i.status === filter);
  }, [inquiries, filter]);

  async function patchInquiry(
    id: string,
    updates: Partial<Pick<Inquiry, "status" | "reply">>
  ) {
    const { data } = await httpClient.patch<Record<string, unknown>>(
      `/inquiries/${id}`,
      updates
    );
    if (!data || typeof data !== "object") {
      throw new Error("Update failed");
    }
    return {
      inquiry: mapInquiry(data),
      message: "Inquiry updated",
    };
  }

  async function openReply(inquiry: Inquiry) {
    setSelected(inquiry);
    setReplyText(inquiry.reply ?? "");
    if (inquiry.status === "new") {
      try {
        await patchInquiry(inquiry.id, { status: "read" });
        await loadInquiries();
      } catch {
        toast.error("Could not mark as read.");
      }
    }
    setReplyOpen(true);
  }

  async function handleSaveReply() {
    if (!selected) return;
    const trimmed = replyText.trim();
    if (!trimmed) {
      toast.error("Please enter a reply.");
      return;
    }
    setIsSaving(true);
    try {
      const { message } = await patchInquiry(selected.id, {
        status: "replied",
        reply: trimmed,
      });
      await loadInquiries();
      setReplyOpen(false);
      setSelected(null);
      toast.success(
        message ?? "Reply saved and emailed to the customer."
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save reply.");
    } finally {
      setIsSaving(false);
    }
  }

  async function markRead(id: string) {
    try {
      await patchInquiry(id, { status: "read" });
      await loadInquiries();
    } catch {
      toast.error("Could not update inquiry.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this inquiry permanently?")) return;
    try {
      await httpClient.delete(`/inquiries/${id}`);
      await loadInquiries();
      toast.success("Inquiry deleted.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete inquiry.");
    }
  }

  if (isLoading) {
    return (
      <p className="font-lora text-sm text-warm-gray">Loading inquiries…</p>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs
        value={filter}
        onValueChange={(v) => setFilter(v as FilterTab)}
      >
        <TabsList className="font-lora">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="read">Read</TabsTrigger>
          <TabsTrigger value="replied">Replied</TabsTrigger>
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <p className="font-lora text-sm text-warm-gray">
          No inquiries in this view. Messages from the contact form appear here.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-gold/20 bg-card">
          <Table>
            <TableHeader>
              <TableRow className="font-lora">
                <TableHead>From</TableHead>
                <TableHead className="hidden sm:table-cell">Subject</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((inquiry) => (
                <TableRow key={inquiry.id} className="font-lora">
                  <TableCell>
                    <div>
                      <p className="font-medium text-ink">{inquiry.name}</p>
                      <p className="text-xs text-warm-gray">{inquiry.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden max-w-[200px] truncate sm:table-cell">
                    {inquiry.subject}
                  </TableCell>
                  <TableCell className="hidden text-warm-gray md:table-cell">
                    {new Date(inquiry.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{statusBadge(inquiry.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {inquiry.status === "new" && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-8 font-lora"
                          onClick={() => void markRead(inquiry.id)}
                        >
                          Mark read
                        </Button>
                      )}
                      <Button
                        type="button"
                        size="sm"
                        className="h-8 rounded-md font-lora"
                        onClick={() => void openReply(inquiry)}
                      >
                        {inquiry.reply ? "View reply" : "Reply"}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 font-lora text-destructive hover:text-destructive"
                        onClick={() => void handleDelete(inquiry.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={replyOpen} onOpenChange={setReplyOpen}>
        <DialogContent className="max-w-lg font-lora">
          <DialogHeader>
            <DialogTitle className="font-playfair text-ink">
              Reply to {selected?.name}
            </DialogTitle>
            <DialogDescription>
              {selected?.subject} — {selected?.email}
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <blockquote className="border-l-2 border-gold/40 pl-3 text-sm text-warm-gray">
              {selected.message}
            </blockquote>
          )}
          <div className="space-y-2">
            <Label htmlFor="reply-text">Your reply</Label>
            <Textarea
              id="reply-text"
              rows={5}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="font-lora"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="rounded-md"
              onClick={() => setReplyOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="rounded-md"
              disabled={isSaving}
              onClick={() => void handleSaveReply()}
            >
              {isSaving ? "Saving…" : "Save reply"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
