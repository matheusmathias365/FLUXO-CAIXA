import React, { useState } from 'react';
import { Transaction, TransactionType, Category } from '../types';
import { Trash2, Search, Filter, Stethoscope, Activity, Scissors, Users, Building, Package, Zap, Megaphone, Wrench, HelpCircle, ArrowUp, ArrowDown } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

// Helper to map categories to icons
const getCategoryIcon = (categoryName: string) => {
  switch (categoryName as Category) {
    case Category.CONSULTATION: return <Stethoscope className="w-4 h-4" />;
    case Category.EXAM: return <Activity className="w-4 h-4" />;
    case Category.SURGERY: return <Scissors className="w-4 h-4" />;
    case Category.SALARY: return <Users className="w-4 h-4" />;
    case Category.RENT: return <Building className="w-4 h-4" />;
    case Category.SUPPLIES: return <Package className="w-4 h-4" />;
    case Category.UTILITIES: return <Zap className="w-4 h-4" />;
    case Category.MARKETING: return <Megaphone className="w-4 h-4" />;
    case Category.MAINTENANCE: return <Wrench className="w-4 h-4" />;
    default: return <HelpCircle className="w-4 h-4" />;
  }
};

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || t.type === filterType;
    return matchesSearch && matchesType;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(val);
  };

  return (
    <div>
      {/* Filters Header */}
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full md:w-auto flex-1 md:max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar por descrição, paciente..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-full bg-white shadow-sm"
          />
        </div>
        
        {/* Type Filter */}
        <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${filterType === 'ALL' ? 'bg-gray-100 text-gray-900 font-bold' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilterType('INCOME')}
            className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${filterType === 'INCOME' ? 'bg-green-50 text-green-700 font-bold' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Entradas
          </button>
          <button
            onClick={() => setFilterType('EXPENSE')}
            className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all ${filterType === 'EXPENSE' ? 'bg-red-50 text-red-700 font-bold' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Saídas
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
              <th className="px-6 py-4 font-semibold">Data</th>
              <th className="px-6 py-4 font-semibold">Descrição</th>
              <th className="px-6 py-4 font-semibold">Categoria</th>
              <th className="px-6 py-4 font-semibold text-right">Valor</th>
              <th className="px-6 py-4 font-semibold text-center w-16"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((t) => (
                <tr key={t.id} className="group hover:bg-blue-50/50 transition-colors text-sm">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500 tabular-nums">{formatDate(t.date)}</td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-800">{t.description}</div>
                    <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-2">
                       {t.patientName && <span>👤 {t.patientName}</span>}
                       <span className="bg-gray-100 px-1.5 rounded text-[10px]">{t.paymentMethod}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <div className="p-1.5 bg-gray-100 rounded-md">
                        {getCategoryIcon(t.category as string)}
                      </div>
                      <span>{t.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className={`font-bold inline-flex items-center ${t.type === TransactionType.INCOME ? 'text-green-600' : 'text-red-600'}`}>
                       {t.type === TransactionType.INCOME ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                       {formatCurrency(t.amount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => onDelete(t.id)}
                      className="p-2 rounded-full text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center text-gray-400">
                  <div className="flex flex-col items-center justify-center">
                    <div className="bg-gray-100 p-4 rounded-full mb-3">
                      <Filter className="w-6 h-6 text-gray-300" />
                    </div>
                    <p className="font-medium">Nenhum lançamento encontrado</p>
                    <p className="text-xs mt-1">Tente mudar os filtros ou adicione uma nova movimentação.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};