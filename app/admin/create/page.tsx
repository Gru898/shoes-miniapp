"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";

type Size = {
  size: number;
  stock: number;
};

export default function AdminPage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [material, setMaterial] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [newSize, setNewSize] = useState("");
  const [newStock, setNewStock] = useState("");
  const [loading, setLoading] = useState(false);

  function addSize() {
    if (!newSize || !newStock) return;

    setSizes([
      ...sizes,
      { size: Number(newSize), stock: Number(newStock) },
    ]);

    setNewSize("");
    setNewStock("");
  }

  async function handleSubmit() {
    if (!image) {
      alert("Загрузите изображение");
      return;
    }

    setLoading(true);

    const fileExt = image.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(fileName, image);

    if (uploadError) {
      alert("Ошибка загрузки изображения");
      setLoading(false);
      return;
    }

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    const imageUrl = data.publicUrl;

    const { data: productData, error: insertError } = await supabase
      .from("products")
      .insert([
        {
          name,
          price: Number(price),
          brand,
          material,
          description,
          image_url: imageUrl,
        },
      ])
      .select()
      .single();

    if (insertError || !productData) {
      alert("Ошибка сохранения товара");
      setLoading(false);
      return;
    }

    // добавляем размеры
    if (sizes.length > 0) {
      const sizesToInsert = sizes.map((s) => ({
        product_id: productData.id,
        size: s.size,
        stock: s.stock,
      }));

      await supabase.from("product_sizes").insert(sizesToInsert);
    }

    alert("Товар создан ✅");

    setName("");
    setPrice("");
    setBrand("");
    setMaterial("");
    setDescription("");
    setImage(null);
    setSizes([]);

    setLoading(false);
  }

  return (
    <main className="min-h-screen">
      <Header />

      <section className="max-w-2xl mx-auto p-4">
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">

          <h1 className="text-xl font-semibold">
            Добавить товар
          </h1>

          <input
            type="text"
            placeholder="Название"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <input
            type="number"
            placeholder="Цена"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <input
            type="text"
            placeholder="Бренд"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <input
            type="text"
            placeholder="Материал"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <textarea
            placeholder="Описание"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <input
            type="file"
            onChange={(e) =>
              setImage(e.target.files ? e.target.files[0] : null)
            }
          />

          <div className="border-t pt-4">
            <h2 className="font-medium mb-2">
              Размеры
            </h2>

            <div className="flex gap-2 mb-2">
              <input
                type="number"
                placeholder="Размер"
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                className="border p-2 rounded w-1/2"
              />

              <input
                type="number"
                placeholder="Количество"
                value={newStock}
                onChange={(e) => setNewStock(e.target.value)}
                className="border p-2 rounded w-1/2"
              />

              <button
                onClick={addSize}
                className="bg-gray-200 px-3 rounded"
              >
                +
              </button>
            </div>

            {sizes.map((s, index) => (
              <div key={index} className="text-sm text-gray-600">
                Размер {s.size} — {s.stock} шт.
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl font-medium"
          >
            {loading ? "Загрузка..." : "Создать товар"}
          </button>

        </div>
      </section>
    </main>
  );
}