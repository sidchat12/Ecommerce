import axios from "axios";
import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/home") // Replace with actual backend URL
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-4 bg-[#FCF6F5] min-h-screen">
      <h2 className="text-2xl font-bold text-[#990011] text-center mb-6">
        Featured Products
      </h2>

      {loading ? (
        <p className="text-[#990011] text-center text-lg font-semibold">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-[#990011] text-center text-lg font-semibold">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product, index) => (
            <ProductCard
              key={index}
              image={product.photo}
              name={product.product_title}
              price={product.price}
            />
          ))}
        </div>
      )}
    </div>
  );
}
