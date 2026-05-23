import { SettingsNav } from "@/features/settings/components/SettingsNav";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-8 md:grid-cols-[12rem_1fr]">
      <aside>
        <p className="mb-3 font-playfair text-xl text-ink">הגדרות</p>
        <SettingsNav />
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
