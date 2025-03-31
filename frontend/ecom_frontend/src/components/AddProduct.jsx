import axios from "axios";
import { useState } from "react";
import { useParams } from "react-router-dom";

export default function AddProduct() {
  const { seller_id } = useParams();
  const [formData, setFormData] = useState({
    product_title: "",
    price: "",
    description: "",
    category: "",
    photo: null,
  });

  const [errors, setErrors] = useState({});

  const categories = ["Mens", "Womens", "Kids", "Books", "Electronics", "Sports", "Stationary"];

  const validate = () => {
    let newErrors = {};

    if (!formData.product_title.trim()) newErrors.product_title = "Product title is required";
    if (!formData.price.trim() || isNaN(formData.price) || formData.price <= 0)
      newErrors.price = "Valid price is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.photo) newErrors.photo = "Photo is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));

    try {
      const url = `http://localhost:5000/seller/${seller_id}/addproduct`;
      await axios.post(url, data);
      alert("Product added successfully!");
      setFormData({ product_title: "", price: "", description: "", category: "", photo: null });
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FCF6F5]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-[#990011] text-white p-6 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Add Product</h2>
        
        <input
          type="text"
          name="product_title"
          placeholder="Product Title"
          value={formData.product_title}
          onChange={handleChange}
          className="input input-bordered w-full mb-2"
        />
        {errors.product_title && <p className="text-red-300">{errors.product_title}</p>}

        <input
          type="text"
          name="price"
          placeholder="Price in ₹"
          value={formData.price}
          onChange={handleChange}
          className="input input-bordered w-full mb-2"
        />
        {errors.price && <p className="text-red-300">{errors.price}</p>}

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="textarea textarea-bordered w-full mb-2"
        />
        {errors.description && <p className="text-red-300">{errors.description}</p>}

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="select select-bordered w-full mb-2"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {errors.category && <p className="text-red-300">{errors.category}</p>}

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="file-input w-full mb-2"
        />
        {errors.photo && <p className="text-red-300">{errors.photo}</p>}

        <div className="flex justify-between mt-4">
          <button type="submit" className="btn btn-primary">Submit</button>
          <button
            type="button"
            onClick={() => setFormData({ product_title: "", price: "", description: "", category: "", photo: null })}
            className="btn btn-secondary"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}