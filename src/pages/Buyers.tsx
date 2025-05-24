import { User, LocateIcon } from "lucide-react";

const buyers = [
  {
    name: "Mary Atieno",
    location: "Eldoret",
    interest: "Buying 200kg of onions",
  },
  {
    name: "Daniel Kariuki",
    location: "Nakuru",
    interest: "Looking for fresh tomatoes",
  },
  {
    name: "Fatuma Abdalla",
    location: "Mombasa",
    interest: "Needs a supplier for bananas",
  },
];

const Buyers = () => (
  <div className="p-6 max-w-4xl mx-auto">
    <h1 className="text-3xl font-bold text-white mb-6">🧑🏽‍🌾 Active Buyers</h1>
    <div className="space-y-4">
      {buyers.map((buyer, idx) => (
        <div
          key={idx}
          className="bg-bazaar-card border border-gray-700 rounded-xl p-4 shadow hover:shadow-lg transition"
        >
          <h2 className="text-lg font-semibold text-primary flex items-center">
            <User className="w-4 h-4 mr-2" />
            {buyer.name}
          </h2>
          <p className="text-gray-400 flex items-center text-sm mt-1">
            <LocateIcon className="w-4 h-4 mr-1" />
            {buyer.location}
          </p>
          <p className="text-gray-300 mt-2">{buyer.interest}</p>
        </div>
      ))}
    </div>
  </div>
);

export default Buyers;
