"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  price: number;
  brand: string;
};

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data } = await supabase
      .from("products")
      .select("id, name, price, brand")
      .order("id", { ascending: false });

    setProducts(data || []);
    setLoading(false);
  }

  return (
    <main className="min-h-screen">
      <Header />

      <section className="max-w-3xl mx-auto p-4 space-y-6">

        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">
            Админка
          </h1>

          <Link
            href="/admin/create"
            className="bg-black text-white px-4 py-2 rounded-lg"
          >
            + Добавить товар
          </Link>
        </div>

        {loading ? (
          <p>Загрузка...</p>
        ) : products.length === 0 ? (
          <p>Товаров нет</p>
        ) : (
          <div className="bg-white rounded-2xl shadow divide-y">
            {products.map((product) => (
              <div
                key={product.id}
                className="p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">
                    {product.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {product.brand} — {product.price.toLocaleString()} ₽
                  </p>
                </div>

                <Link
                  href={`/admin/edit/${product.id}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Редактировать
                </Link>
              </div>
            ))}
          </div>
        )}

      </section>
    </main>
  );
}