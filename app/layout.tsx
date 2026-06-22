import "./globals.css";
import { CartProvider } from "@/context/CartContext";

export const metadata = {
  title: "Shoes Store",
  description: "Telegram Mini App Store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}