"use client";

import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import Header from "@/components/Header";
import { Search } from "lucide-react";

export default function Home() {
  const [search, setSearch] = useState("");

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen">
      <Header />

      <section className="max-w-6xl mx-auto px-4 py-6">

        {/* Поиск */}
        <div className="relative mb-6">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Поиск по моделям..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black transition"
          />
        </div>

        {/* Заголовок */}
        <h2 className="text-xl font-semibold mb-6">
          Каталог
        </h2>

        {/* Товары */}
        {filteredProducts.length === 0 ? (
          <p className="text-gray-500">Ничего не найдено</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}