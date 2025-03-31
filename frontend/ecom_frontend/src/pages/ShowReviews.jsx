import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ShowReviews() {
  const { product_id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/product/${product_id}/reviews`);
        setReviews(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch reviews");
      } finally {
        setLoading(false);
      }
    };

    if (product_id) fetchReviews();
  }, [product_id]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#ffe5dc]">
      <div className="p-8 rounded-lg shadow-lg w-[32rem]" style={{ backgroundColor: "#990011", color: "#FCF6F5" }}>
        <h2 className="text-2xl font-bold text-center mb-6">Product Reviews</h2>

        {reviews.length === 0 ? (
          <p className="text-center">No reviews found for this product.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.review_id} className="p-4 border-b border-[#FCF6F5]">
                <p className="font-semibold">User ID: {review.user_id}</p>
                <p className="text-yellow-400">⭐ {review.review_stars}/5</p>
                <p className="italic">"{review.review_text}"</p>
                <p className="text-sm opacity-80">{new Date(review.review_time).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}

        <button className="btn w-full mt-4 bg-gray-500 text-white hover:font-bold">Go Back</button>
      </div>
    </div>
  );
}
