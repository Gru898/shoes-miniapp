"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import Link from "next/link";

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

type Product = {
  id: number;
  name: string;
  price: number;
  brand: string;
};

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    const savedAuth = localStorage.getItem("admin_auth");

    if (savedAuth === "true") {
      setAuthorized(true);
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, []);

  async function fetchProducts() {
    const { data } = await supabase
      .from("products")
      .select("id, name, price, brand")
      .order("id", { ascending: false });

    setProducts(data || []);
    setLoading(false);
  }

  function handleLogin() {
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem("admin_auth", "true");
      setAuthorized(true);
      fetchProducts();
    } else {
      alert("Неверный пароль");
    }
  }

  function handleLogout() {
    localStorage.removeItem("admin_auth");
    setAuthorized(false);
  }

  if (!authorized) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded-2xl shadow w-80 space-y-4">

          <h1 className="text-lg font-semibold text-center">
            Вход в админку
          </h1>

          <input
            type="password"
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <button
            onClick={handleLogin}
            className="w-full bg-black text-white py-2 rounded"
          >
            Войти
          </button>

        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="p-6">Загрузка...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Header />

      <section className="max-w-3xl mx-auto p-4 space-y-6">

        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">
            Админка
          </h1>

          <div className="flex gap-3">
            <Link
              href="/admin/create"
              className="bg-black text-white px-4 py-2 rounded-lg"
            >
              + Добавить товар
            </Link>

            <button
              onClick={handleLogout}
              className="text-sm text-gray-500"
            >
              Выйти
            </button>
          </div>
        </div>

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

      </section>
    </main>
  );
}