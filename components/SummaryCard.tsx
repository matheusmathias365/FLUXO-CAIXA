import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, DollarSign, Wallet } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  amount: number;
  type: 'balance' | 'income' | 'expense';
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ title, amount, type }) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(val);
  };

  let colorClass = '';
  let Icon = DollarSign;
  let bgClass = '';

  switch (type) {
    case 'income':
      colorClass = 'text-green-600';
      bgClass = 'bg-gradient-to-br from-green-50 to-green-100/50';
      Icon = ArrowUpCircle;
      break;
    case 'expense':
      colorClass = 'text-red-600';
      bgClass = 'bg-gradient-to-br from-red-50 to-red-100/50';
      Icon = ArrowDownCircle;
      break;
    default:
      colorClass = 'text-blue-600';
      bgClass = 'bg-gradient-to-br from-blue-50 to-blue-100/50';
      Icon = Wallet;
      break;
  }

  return (
    <div className={`rounded-2xl shadow-sm p-6 flex items-center justify-between border border-gray-100 bg-white hover:shadow-md transition-shadow`}>
      <div>
        <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">{title}</p>
        <h3 className={`text-2xl lg:text-3xl font-bold tracking-tight text-gray-800`}>
          {formatCurrency(amount)}
        </h3>
      </div>
      <div className={`p-4 rounded-xl ${bgClass} ${colorClass}`}>
        <Icon className="w-8 h-8" strokeWidth={1.5} />
      </div>
    </div>
  );
};