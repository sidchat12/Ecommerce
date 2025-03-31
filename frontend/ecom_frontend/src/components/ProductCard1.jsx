import React from "react";

export default function ProductCard1({ product, onClick }) {
  return (
    <div
      className="max-w-xs bg-[#FCF6F5] shadow-lg rounded-lg overflow-hidden cursor-pointer border-2 border-[#990011]"
      onClick={() => onClick(product.id)}
    >
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-bold text-[#990011]">{product.title}</h3>
        <p className="text-gray-700 text-sm">₹{product.price}</p>
        <button
          className="mt-2 w-full bg-[#990011] text-[#FCF6F5] py-2 rounded hover:bg-[#77000E] transition"
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click from triggering
            console.log("Add to Cart clicked for", product.id);
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
