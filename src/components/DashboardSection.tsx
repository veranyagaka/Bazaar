
import MarketPriceCard from './MarketPriceCard';
import PriceTrendChart from './PriceTrendChart';

const DashboardSection = () => {
  const marketPrices = [
    {
      cropName: "Maize",
      currentPrice: 4500,
      previousPrice: 4200,
      unit: "90kg bag",
      location: "Nairobi Market"
    },
    {
      cropName: "Beans",
      currentPrice: 8500,
      previousPrice: 9200,
      unit: "90kg bag",
      location: "Mombasa APMC"
    },
    {
      cropName: "Irish Potatoes",
      currentPrice: 3200,
      previousPrice: 2800,
      unit: "50kg bag",
      location: "Nakuru Market"
    },
    {
      cropName: "Kales (Sukuma Wiki)",
      currentPrice: 25,
      previousPrice: 30,
      unit: "bunch",
      location: "Kisumu Market"
    }
  ];

  return (
    <section id="dashboard" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Kenya Market Dashboard
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Live market prices across Kenya to help you make informed selling decisions
          </p>
        </div>

        {/* Market Prices Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {marketPrices.map((price, index) => (
            <MarketPriceCard key={index} {...price} />
          ))}
        </div>

        {/* Trend Charts */}
        <div className="grid lg:grid-cols-2 gap-8">
          <PriceTrendChart title="Maize Price Trend (Last 7 Days)" />
          <PriceTrendChart title="Beans Price Trend (Last 7 Days)" />
        </div>
      </div>
    </section>
  );
};

export default DashboardSection;
