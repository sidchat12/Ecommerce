import ProductCard from "./ProductCard";

export default function ProductHolder({ title, products }) {
  return (
    <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-4">
      <h2 className="text-lg font-bold text-gray-900 mb-3">{title}</h2>
      <div className="grid grid-cols-2 gap-3">
        {products.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div>
    </div>
  );
}
