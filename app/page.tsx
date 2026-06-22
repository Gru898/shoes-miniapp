import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      {/* Верхняя плашка */}
      <header className="sticky top-0 z-50 bg-black text-white py-4 shadow-md">
        <div className="max-w-6xl mx-auto px-4 text-center text-xl font-semibold tracking-wide">
          НАЗВАНИЕ МАГАЗИНА
        </div>
      </header>

      {/* Контент */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6">Каталог</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}