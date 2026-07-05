import type { Metadata } from "next";
import "./globals.css";
import LiveBootstrapClient from "@/components/live/LiveBootstrapClient";

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
          <LiveBootstrapClient />
          {children}
        </SelectedStockProvider>

      </body>
    </html>
  );
}
