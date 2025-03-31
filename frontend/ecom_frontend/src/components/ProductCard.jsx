export default function ProductCard({ image, name, price }) {
    return (
      <button className="w-40 bg-white shadow-md rounded-lg overflow-hidden">
        <img className="w-full h-28 object-cover" src={image} alt={name} />
        <div className="p-2 text-center">
          <h3 className="text-sm font-semibold text-gray-900">{name}</h3>
          <p className="text-xs text-gray-700 mt-1">${price}</p>
        </div>
      </button>
    );
  }
  

