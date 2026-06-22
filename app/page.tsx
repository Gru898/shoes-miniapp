"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { supabase } from "@/lib/supabase";

type Product = {
  id: number;
  name: string;
  price: number;
  brand: string;
  image_url: string;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data, error } = await supabase
      .from("products")
      .select("*");

    if (error) {
      console.error(error);
    } else {
      setProducts(data || []);
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen">
      <Header />

      <section className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="text-xl font-semibold mb-6">
          Каталог
        </h2>

        <div className="grid grid-cols-2 gap-4">

          {loading
            ? Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl overflow-hidden shadow animate-pulse"
                >
                  <div className="aspect-square bg-gray-300"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-3 bg-gray-300 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                  </div>
                </div>
              ))
            : products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl overflow-hidden shadow"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

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
              ))}
        </div>
      </section>
    </main>
  );
}