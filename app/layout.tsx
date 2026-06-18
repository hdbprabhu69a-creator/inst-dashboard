import type { Metadata } from "next";
import "./globals.css";

import {
  SelectedStockProvider,
} from "@/src/context/SelectedStockContext";

export const metadata: Metadata = {
  title: "INST Dashboard",
  description: "Institutional Trading Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">

        <SelectedStockProvider>
          {children}
        </SelectedStockProvider>

      </body>
    </html>
  );
}