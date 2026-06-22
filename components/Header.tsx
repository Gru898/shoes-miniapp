"use client";

import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const router = useRouter();
  const { cart } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-black text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* Название магазина */}
        <h1
          onClick={() => router.push("/")}
          className="text-lg font-semibold tracking-wide cursor-pointer"
        >
          НАЗВАНИЕ МАГАЗИНА
        </h1>

        {/* Корзина */}
        <div
          onClick={() => router.push("/cart")}
          className="relative cursor-pointer"
        >
          <ShoppingCart size={24} />

          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-white text-black text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {cart.length}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}