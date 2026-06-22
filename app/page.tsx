import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import Header from "@/components/Header";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <Header />

      <section className="max-w-6xl mx-auto px-4 py-6">
        <h2 className="text-xl font-semibold mb-6">Каталог</h2>

        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}