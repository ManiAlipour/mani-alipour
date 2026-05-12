import RootProvider from "../providers";
import Footer from "../sections/Footer";
import Header from "../sections/Header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RootProvider>
      <div>
        <Header />
        {children}
        <Footer />
      </div>
    </RootProvider>
  );
}
