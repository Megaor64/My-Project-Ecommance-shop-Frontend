import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/footer/Footer";
import { SearchProvider } from "@/components/providers/SearchProvider";
import { StoreSearchChrome } from "@/components/home/StoreSearchChrome";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SearchProvider>
      <Navbar />
      <StoreSearchChrome />
      <main className="min-w-0 flex-1 overflow-x-clip">{children}</main>
      <Footer />
    </SearchProvider>
  );
}
