import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard1 from "../components/ProductCard1";

export default function ProductListByCategory() {
  const { category } = useParams(); // Extract category and user_id from URL
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get(`http://localhost:5000/category/${category}`);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [category]);

  const handleProductClick = (productId) => {
    window.location.href = `/product/${productId}`;
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-[#990011] mb-4">Category: {category}</h2>
      {loading ? (
        <p className="text-center text-gray-500">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500">No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard1 key={product.product_id} product={product} onClick={handleProductClick} />
          ))}
        </div>
      )}
    </div>
  );
}
