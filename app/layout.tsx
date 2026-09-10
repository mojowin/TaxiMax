import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "MeterOn Taxi Software",
  description: "MeterOn subscription and payment service",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="topbar">
          <Link className="brand" href="/" aria-label="MeterOn home">
            <span className="brand-mark">M</span><span>MeterOn</span>
          </Link>
          <nav className="nav" aria-label="Primary navigation">
            <Link href="/#payment">Plans & payment</Link>
            <Link href="/#account">Account & vehicle</Link>
            <Link href="/#contact">Contact</Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
