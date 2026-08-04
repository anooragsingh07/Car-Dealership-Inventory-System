export default function VehicleCard({ vehicle, onPurchase }) {
  const outOfStock = vehicle.quantity === 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-1">
        <h3 className="text-gray-900 font-bold text-lg">{vehicle.make} {vehicle.model}</h3>
        {vehicle.low_stock && !outOfStock && (
          <span className="text-xs font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded">Low stock</span>
        )}
      </div>
      <p className="text-gray-500 text-sm">{vehicle.category}</p>
      <p className="text-gray-900 text-xl my-2">
        ₹{Number(vehicle.price).toLocaleString('en-IN')}
      </p>
      <p className="text-sm text-gray-500 mb-3">
        Qty: {vehicle.quantity}
      </p>
      <button
        onClick={() => onPurchase(vehicle.id)}
        disabled={outOfStock}
        className={`w-full py-2 px-4 rounded font-semibold transition ${
          outOfStock
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : 'bg-gray-900 text-white hover:bg-gray-800 cursor-pointer'
        }`}
      >
        Purchase
      </button>
    </div>
  );
}
