export type InquiryStatus = "new" | "read" | "replied";

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  status: InquiryStatus;
  reply?: string;
};

export function mapInquiry(doc: Record<string, unknown>): Inquiry {
  return {
    id: String(doc._id ?? doc.id),
    name: String(doc.name ?? ""),
    email: String(doc.email ?? ""),
    subject: String(doc.subject ?? ""),
    message: String(doc.message ?? ""),
    createdAt: String(doc.createdAt ?? new Date().toISOString()),
    status: (doc.status as InquiryStatus) ?? "new",
    reply: doc.reply ? String(doc.reply) : undefined,
  };
}
