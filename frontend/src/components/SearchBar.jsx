import { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const params = {};
    if (make) params.make = make;
    if (model) params.model = model;
    if (category) params.category = category;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    onSearch(params);
  }

  function handleClear() {
    setMake(''); setModel(''); setCategory(''); setMinPrice(''); setMaxPrice('');
    onSearch({});
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 items-end mb-6 p-4 bg-paper border border-steel/20 rounded-lg">
      <input className="p-2 border border-steel/30 rounded text-sm flex-1 min-w-[120px]" placeholder="Make" value={make} onChange={e => setMake(e.target.value)} />
      <input className="p-2 border border-steel/30 rounded text-sm flex-1 min-w-[120px]" placeholder="Model" value={model} onChange={e => setModel(e.target.value)} />
      <input className="p-2 border border-steel/30 rounded text-sm flex-1 min-w-[120px]" placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />
      <input className="p-2 border border-steel/30 rounded text-sm w-24" placeholder="Min $"
        type="number" min="0" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
      <input className="p-2 border border-steel/30 rounded text-sm w-24" placeholder="Max $"
        type="number" min="0" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
      <button className="bg-brass text-white px-4 py-2 rounded text-sm font-semibold hover:brightness-110">Search</button>
      <button type="button" onClick={handleClear} className="text-steel px-3 py-2 text-sm hover:text-ink">Clear</button>
    </form>
  );
}
