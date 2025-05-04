import "./globals.css";
import Footer from "@/components/Footer";
import NavbarSwitcher from "@/components/NavbarSwitcher";
import BackToTopButton from "@/components/BackToTopButton";

export const metadata = {
  title: "CosEvents",
  description: "Bring it to life",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.history.scrollRestoration = 'manual';
            window.onload = function() {
              window.scrollTo(0, 0);
            };
          `,
        }} />
      </head>
      <body className="bg-[var(--cosevent-bg)] text-white font-sans m-0 p-0">
        <NavbarSwitcher />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <BackToTopButton />
      </body>
    </html>
  );
}
