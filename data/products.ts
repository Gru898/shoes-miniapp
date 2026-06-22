export type Product = {
  id: number;
  name: string;
  price: number;
  brand: string;
  material: string;
  description: string;
  image: string;
  sizes: {
    size: number;
    stock: number;
  }[];
};

export const products: Product[] = [
  {
    id: 1,
    name: "Nike Air Max 97",
    price: 12990,
    brand: "Nike",
    material: "Текстиль",
    description:
      "Легендарная модель Nike Air Max 97 с современным силуэтом и отличной амортизацией.",
    image: "/images/nike.jpg",
    sizes: [
      { size: 40, stock: 2 },
      { size: 41, stock: 0 },
      { size: 42, stock: 5 },
      { size: 43, stock: 1 },
    ],
  },
  {
    id: 2,
    name: "Adidas Campus",
    price: 9490,
    brand: "Adidas",
    material: "Замша",
    description:
      "Классическая модель Adidas Campus в минималистичном стиле для повседневной носки.",
    image: "/images/adidas.jpg",
    sizes: [
      { size: 40, stock: 3 },
      { size: 41, stock: 2 },
      { size: 42, stock: 0 },
      { size: 43, stock: 4 },
    ],
  },
];