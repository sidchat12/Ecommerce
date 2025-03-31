import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
const ProductPage = () => {
  const { product_id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/product/${product_id}`);
        setProduct(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch product data");
      }
    };

    fetchProduct();
  }, [product_id]);

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!product) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img className="h-96 w-full object-cover md:w-96" src={product.photo} alt={product.product_title} />
          </div>
          <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-900">{product.product_title}</h1>
            <p className="mt-4 text-gray-600">{product.description}</p>
            <div className="mt-4">
              <span className="text-xl font-semibold text-gray-900">₹{product.price}</span>
            </div>
            <div className="mt-6">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                defaultValue="1"
                min="1"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mt-6 flex space-x-4">
              <button
                type="button"
                className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add to cart
              </button>
              <button
                type="button"
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md shadow-sm text-sm font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Buy now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;