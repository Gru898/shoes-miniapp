"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  price: number;
  brand: string;
  image_url: string | null;
  displayImage?: string | null;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("Все");
  const [sortOption, setSortOption] = useState("default");

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [search, selectedBrand, sortOption, products]);

  async function fetchProducts() {
    const { data: productData } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    const { data: imageData } = await supabase
      .from("product_images")
      .select("*");

    const productsWithImages = productData?.map((product) => {
      const images = imageData?.filter(
        (img) => img.product_id === product.id
      );

      return {
        ...product,
        displayImage:
          images && images.length > 0
            ? images[0].image_url
            : product.image_url,
      };
    });

    setProducts(productsWithImages || []);
    setLoading(false);
  }

  function applyFilters() {
    let updated = [...products];

    // Поиск
    if (search) {
      updated = updated.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Фильтр по бренду
    if (selectedBrand !== "Все") {
      updated = updated.filter(
        (p) => p.brand === selectedBrand
      );
    }

    // Сортировка
    if (sortOption === "price-asc") {
      updated.sort((a, b) => a.price - b.price);
    }

    if (sortOption === "price-desc") {
      updated.sort((a, b) => b.price - a.price);
    }

    setFiltered(updated);
  }

  const brands = [
    "Все",
    ...Array.from(new Set(products.map((p) => p.brand))),
  ];

  return (
    <main className="min-h-screen">
      <Header />

      <section className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        <h2 className="text-xl font-semibold">
          Каталог
        </h2>

        {/* Поиск */}
        <input
          type="text"
          placeholder="Поиск..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border p-3 rounded-xl"
        />

        {/* Фильтр + сортировка */}
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
            <option value="default">Сортировка</option>
            <option value="price-asc">Цена ↑</option>
            <option value="price-desc">Цена ↓</option>
          </select>

        </div>

        {loading ? (
          <p>Загрузка...</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filtered.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transition cursor-pointer">

                  {product.displayImage && (
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={product.displayImage}
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
        )}

      </section>
    </main>
  );
}