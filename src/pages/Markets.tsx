import { Leaf, MapPin } from "lucide-react";

const markets = [
  {
    name: "Wakulima Market",
    location: "Nairobi CBD",
    products: ["Tomatoes", "Onions", "Carrots"],
  },
  {
    name: "Karatina Market",
    location: "Nyeri",
    products: ["Cabbages", "Bananas", "Maize"],
  },
  {
    name: "Kibuye Market",
    location: "Kisumu",
    products: ["Fish", "Mangoes", "Rice"],
  },
];

const Markets = () => (
  <div className="p-6 max-w-5xl mx-auto">
    <h1 className="text-3xl font-bold text-white mb-6">🌾 Popular Markets</h1>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {markets.map((market, idx) => (
        <div
          key={idx}
          className="bg-bazaar-card p-4 rounded-2xl border border-gray-700 shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold text-primary mb-1">{market.name}</h2>
          <p className="flex items-center text-gray-400 text-sm mb-2">
            <MapPin className="w-4 h-4 mr-1" /> {market.location}
          </p>
          <p className="text-gray-300">Common produce:</p>
          <ul className="list-disc list-inside text-gray-200">
            {market.products.map((product, i) => (
              <li key={i} className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-green-400" /> {product}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
);

export default Markets;
