"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  price: number;
  brand: string;
  previewImage?: string | null;
};

export default function ProductsClient({
  products,
}: {
  products: Product[];
}) {
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("Все");
  const [sortOption, setSortOption] = useState("");

  const brands = useMemo(() => {
    return ["Все", ...Array.from(new Set(products.map(p => p.brand)))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let updated = [...products];

    if (search) {
      updated = updated.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedBrand !== "Все") {
      updated = updated.filter(p => p.brand === selectedBrand);
    }

    if (sortOption === "price-asc") {
      updated.sort((a, b) => a.price - b.price);
    }

    if (sortOption === "price-desc") {
      updated.sort((a, b) => b.price - a.price);
    }

    return updated;
  }, [products, search, selectedBrand, sortOption]);

  return (
    <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

      <h2 className="text-xl font-semibold">
        Каталог
      </h2>

      <input
        type="text"
        placeholder="Поиск..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border p-3 rounded-xl"
      />

      <div className="flex gap-3">

        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="flex-1 border p-2 rounded-xl"
        >
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="flex-1 border p-2 rounded-xl"
        >
          <option value="">Сортировка</option>
          <option value="price-asc">Цена ↑</option>
          <option value="price-desc">Цена ↓</option>
        </select>

      </div>

      <div className="grid grid-cols-2 gap-4">
        {filteredProducts.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
          >
            <div className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transition cursor-pointer">

              {product.previewImage && (
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.previewImage}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-4">
                <p className="text-xs text-gray-500 uppercase">
                  {product.brand}
                </p>

                <h3 className="font-medium text-sm mb-2">
                  {product.name}
                </h3>

                <p className="font-semibold">
                  {product.price.toLocaleString()} ₽
                </p>
              </div>

            </div>
          </Link>
        ))}
      </div>

    </section>
  );
}