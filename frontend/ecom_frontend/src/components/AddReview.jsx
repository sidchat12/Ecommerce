import axios from "axios";
import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { useParams } from "react-router-dom";

export default function AddReview() {
  const { user_id, product_id } = useParams();
  const [formData, setFormData] = useState({
    rating: 0,
    review: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};
    if (formData.rating === 0) newErrors.rating = "Please select a rating";
    if (!formData.review.trim()) newErrors.review = "Review is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const url = `http://localhost:5000/user/${user_id}/${product_id}/addreview`;
      const payload = {
        review_stars: formData.rating,
        review_text: formData.review,
      };
      await axios.post(url, payload);
      alert("Review submitted successfully!");
    } catch (error) {
      alert("Submission failed!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#ffe5dc]">
      <div className="p-8 rounded-lg shadow-lg w-96" style={{ backgroundColor: "#990011", color: "#FCF6F5" }}>
        <h2 className="text-2xl font-bold text-center mb-6">Add a Review</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="font-semibold mb-2">Rating:</p>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`cursor-pointer ${formData.rating >= star ? "text-yellow-400" : "text-gray-400"}`}
                  onClick={() => setFormData({ ...formData, rating: star })}
                  size={24}
                />
              ))}
            </div>
            {errors.rating && <p className="text-sm text-[#FCF6F5]">{errors.rating}</p>}
          </div>
          <div>
            <textarea
              name="review"
              placeholder="Write your review here..."
              value={formData.review}
              onChange={(e) => setFormData({ ...formData, review: e.target.value })}
              className="textarea textarea-bordered w-full"
            />
            {errors.review && <p className="text-sm text-[#FCF6F5]">{errors.review}</p>}
          </div>
          <button type="submit" className="btn w-full hover:font-bold bg-[#FCF6F5] text-[#990011]">
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
}
