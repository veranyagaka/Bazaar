
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MarketPriceCardProps {
  cropName: string;
  currentPrice: number;
  previousPrice: number;
  unit: string;
  location: string;
}

const MarketPriceCard = ({ 
  cropName, 
  currentPrice, 
  previousPrice, 
  unit, 
  location 
}: MarketPriceCardProps) => {
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = ((priceChange / previousPrice) * 100).toFixed(1);
  const isPositive = priceChange >= 0;

  return (
    <div className="gradient-card p-6 rounded-lg hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1 text-white">{cropName}</h3>
          <p className="text-sm text-muted-foreground">{location}</p>
        </div>
        <div className={`flex items-center space-x-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span className="text-sm font-medium">
            {isPositive ? '+' : ''}{priceChangePercent}%
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-foreground text-white">
            KES {currentPrice.toLocaleString()}
          </span>
          <span className="text-sm text-muted-foreground">per {unit}</span>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Previous: KES {previousPrice.toLocaleString()}</span>
          <span className={`font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? '+' : ''}KES {Math.abs(priceChange).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MarketPriceCard;
