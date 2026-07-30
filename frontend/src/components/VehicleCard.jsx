export default function VehicleCard({ vehicle, onPurchase }) {
  const outOfStock = vehicle.quantity === 0;

  return (
    <div className="bg-paper border border-steel/20 rounded-lg p-4 shadow-sm">
      <h3 className="text-ink font-bold text-lg">{vehicle.make} {vehicle.model}</h3>
      <p className="text-steel text-sm">{vehicle.category}</p>
      <p className="font-mono text-ink text-xl my-2">
        ${Number(vehicle.price).toLocaleString()}
      </p>
      <p className="font-mono text-sm text-steel mb-3">
        Qty: {vehicle.quantity}
      </p>
      <button
        onClick={() => onPurchase(vehicle.id)}
        disabled={outOfStock}
        className={`w-full py-2 px-4 rounded font-semibold transition ${
          outOfStock
            ? 'bg-steel/20 text-steel cursor-not-allowed'
            : 'bg-brass text-white hover:brightness-110 cursor-pointer'
        }`}
      >
        Purchase
      </button>
    </div>
  );
}
