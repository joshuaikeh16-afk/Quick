import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quick — Simple digital payments",
  description: "A fast, simple platform for airtime, data and bill payments.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}