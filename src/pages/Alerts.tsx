import React from 'react';
import { Bell } from 'lucide-react';

const alerts = [
  "📨 New message from Client One",
  "📉 Maize market price dropped by 8%",
  "🚨 Buyer looking for tomatoes near you"
];

const Alerts = () => {
  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Bell className="w-6 h-6" />
        Alerts
      </h1>
      <div className="mt-4 space-y-4">
        {alerts.map((alert, index) => (
          <div key={index} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <p className="text-base">{alert}</p>
            <p className="text-sm text-gray-400">Just now</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alerts;
