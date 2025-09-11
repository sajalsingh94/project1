import React from 'react';
import { Link } from 'react-router-dom';

const SellerDashboard: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Seller Dashboard</h1>
      <ul className="space-y-2">
        <li><Link to="/dashboard/shop-details" className="text-blue-600 hover:underline">Shop Details</Link></li>
        <li><Link to="/dashboard/banking-details" className="text-blue-600 hover:underline">Banking Details</Link></li>
      </ul>
    </div>
  );
};

export default SellerDashboard;

