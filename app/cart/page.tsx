"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { supabase } from "@/lib/supabase";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const router = useRouter();
  const [toast, setToast] = useState("");

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price,
    0
  );

  function generateOrderNumber() {
    return "ORD-" + Math.floor(100000 + Math.random() * 900000);
  }

  async function handleContactManager() {
    if (cart.length === 0) return;

    const confirmed = confirm(
      "Подтвердить отправку заказа менеджеру?"
    );

    if (!confirmed) return;

    const orderNumber = generateOrderNumber();

    // ✅ Сохраняем заказ в базу
    const { error } = await supabase.from("orders").insert([
      {
        order_number: orderNumber,
        items: cart,
        total_price: totalPrice,
      },
    ]);

    if (error) {
      alert("Ошибка сохранения заказа");
      return;
    }

    const managerUsername = "P1ngwinl"; // ← замени

    const orderText = `
Заказ №${orderNumber}

${cart
  .map(
    (item, index) =>
      `${index + 1}. ${item.name}
Размер: ${item.size}
Цена: ${item.price.toLocaleString()} ₽`
  )
  .join("\n\n")}

Итого: ${totalPrice.toLocaleString()} ₽
`;

    const encodedText = encodeURIComponent(orderText);
    const telegramUrl = `https://t.me/${managerUsername}?text=${encodedText}`;

    window.open(telegramUrl, "_blank");

    clearCart();

    setToast(`✅ Заказ №${orderNumber} отправлен`);

    setTimeout(() => {
      setToast("");
      router.push("/");
    }, 2500);
  }

  return (
    <main className="min-h-screen relative">
      <Header />

      <section className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-2xl shadow p-6">

          <h1 className="text-2xl font-bold mb-6">
            Мой заказ
          </h1>

          {cart.length === 0 ? (
            <p className="text-gray-500">
              Корзина пуста
            </p>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {cart.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border-b pb-3"
                  >
                    <div>
                      <p className="font-medium">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Размер: {item.size}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold">
                        {item.price.toLocaleString()} ₽
                      </p>
                      <button
                      onClick={() => removeFromCart(index)}
                      className="mt-1 inline-block bg-red-100 text-red-600 text-xs px-3 py-1 rounded-lg hover:bg-red-200 active:scale-95 transition"
                      >
                        Удалить
                        </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-medium">
                  Итого:
                </span>
                <span className="text-lg font-bold">
                  {totalPrice.toLocaleString()} ₽
                </span>
              </div>

              <button
                onClick={handleContactManager}
                className="w-full bg-black text-white py-3 rounded-xl font-medium hover:opacity-90 transition"
              >
                Связаться с менеджером
              </button>
            </>
          )}
          
          <button
          onClick={() => router.push("/")}
          className="mt-6 w-full bg-gray-100 hover:bg-gray-200 py-3 rounded-xl transition"
          >
            ← Вернуться в каталог
        </button>

        </div>
      </section>

      {/* ✅ Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3 rounded-xl shadow-lg">
          {toast}
        </div>
      )}
    </main>
  );
}