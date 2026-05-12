import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenSEPA Bridge",
  description: "Conversión de Excel a XML ISO 20022 para Bankinter",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
