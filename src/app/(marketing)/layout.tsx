import Header from "@/widgets/header/ui/header";
import Footer from "@/widgets/footer/ui/footer";
import { NextIntlClientProvider } from "next-intl";

export default async function RoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = (await import("../../../messages/en.json")).default;

  return (
    <NextIntlClientProvider locale="en" messages={messages}>
      <Header />
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      <Footer />
    </NextIntlClientProvider>
  );
}
