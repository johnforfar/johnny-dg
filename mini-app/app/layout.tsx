import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/context/providers";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { title, description } from "@/lib/metadata";

export const metadata: Metadata = {
  title,
  description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Providers>
          <div className="font-sans min-h-screen flex flex-col place-content-between">
            <Header />
            {children}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
