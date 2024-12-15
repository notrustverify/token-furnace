import React from 'react';
import { BurnsList } from '@/components/BurnsList';
import Link from 'next/link';
import { FurnacePage } from '@/components/FurnacePage';

const BurnsPage = () => {
  return (
    <div className="p-6 pl-12 space-y-6">
      <Link 
        href={'/'} 
        className="inline-block text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium"
      >
        ← Back to Burn Tokens
      </Link>
      <h1 className="text-3xl font-bold text-gray-900">
        Burn History
      </h1>
      <BurnsList />
    </div>
  );
};

export default BurnsPage; 