"use client";

import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const router = useRouter();

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price,
    0
  );

  const handleContactManager = () => {
    if (cart.length === 0) return;

    const managerUsername = "P1ngwinl"; // ← замени на свой

    const orderText = `
Новый заказ:

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

    // ✅ Открываем чат
    window.open(telegramUrl, "_blank");

    // ✅ Очищаем корзину
    clearCart();
  };

  return (
    <main className="min-h-screen">
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
                        className="text-sm text-red-500 hover:underline"
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
            className="mt-6 text-sm text-gray-500 hover:underline"
          >
            ← Вернуться в каталог
          </button>

        </div>
      </section>
    </main>
  );
}