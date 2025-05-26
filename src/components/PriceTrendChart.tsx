
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { date: '1 Jan', price: 4200 },
  { date: '2 Jan', price: 4350 },
  { date: '3 Jan', price: 4100 },
  { date: '4 Jan', price: 4500 },
  { date: '5 Jan', price: 4650 },
  { date: '6 Jan', price: 4400 },
  { date: '7 Jan', price: 4600 },
];

interface PriceTrendChartProps {
  title: string;
  data?: typeof mockData;
}

const PriceTrendChart = ({ title, data = mockData }: PriceTrendChartProps) => {
  return (
    <div className="gradient-card p-6 rounded-lg bg-bazaar-card">
      <h3 className="text-lg font-semibold text-foreground mb-4 text-white">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={(value) => `KES ${value}`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
                color: 'hsl(var(--foreground))'
              }}
              formatter={(value) => [`KES ${value}`, 'Price']}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#ff5733" 
              strokeWidth={3}
              dot={{ fill: '#ff5733', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#ff5733', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceTrendChart;
