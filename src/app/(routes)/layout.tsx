import Header from "@/widgets/header/ui/header";
import Footer from "@/widgets/footer/ui/footer";

export default function RoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
