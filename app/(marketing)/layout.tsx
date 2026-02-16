import { Toaster } from "sonner";

export const metadata = {
  title: "PLR Library - Produits digitaux prêts à revendre",
  description:
    "Accédez à 30+ produits digitaux avec licence PLR complète. Ebooks, templates, formations — téléchargez, personnalisez, vendez.",
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
      <Toaster richColors position="top-right" />
    </div>
  );
}
