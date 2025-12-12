import React, { useState, useEffect } from 'react';
import { Activity, Plus, LayoutDashboard, List, Stethoscope, Menu, X, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { Transaction, TransactionType } from './types';
import { SummaryCard } from './components/SummaryCard';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { ChartsSection } from './components/ChartsSection';
import { AIInsights } from './components/AIInsights';

const STORAGE_KEY = 'medicaixa_transactions';

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [view, setView] = useState<'dashboard' | 'history' | 'insights'>('dashboard');
  const [showForm, setShowForm] = useState(false);
  const [formInitialType, setFormInitialType] = useState<TransactionType>(TransactionType.INCOME);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Load data on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setTransactions(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse transactions", e);
      }
    }
  }, []);

  // Save data on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  // Handle screen resize to close mobile menu
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions(prev => [...prev, transaction]);
    setShowForm(false);
  };

  const handleDeleteTransaction = (id: string) => {
    if(window.confirm("Tem certeza que deseja excluir este registro?")) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  const openForm = (type: TransactionType = TransactionType.INCOME) => {
    setFormInitialType(type);
    setShowForm(true);
    setIsMobileMenuOpen(false); // Close mobile menu if open
  };

  const navigateTo = (newView: 'dashboard' | 'history' | 'insights') => {
    setView(newView);
    setShowForm(false);
    setIsMobileMenuOpen(false);
  };

  // Calculate totals
  const totals = transactions.reduce((acc, t) => {
    if (t.type === TransactionType.INCOME) {
      acc.income += t.amount;
      acc.balance += t.amount;
    } else {
      acc.expense += t.amount;
      acc.balance -= t.amount;
    }
    return acc;
  }, { income: 0, expense: 0, balance: 0 });

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 font-sans text-gray-900">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white">
            <Stethoscope size={20} />
          </div>
          <span className="text-lg font-bold text-gray-800">MediCaixa</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600 hover:text-blue-600 transition-colors">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:relative md:translate-x-0 transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1)
        w-64 bg-white border-r border-gray-200 flex flex-col z-30 shadow-2xl md:shadow-none
      `}>
        <div className="hidden md:flex p-6 border-b border-gray-100 items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-blue-200 shadow-md">
            <Stethoscope size={24} />
          </div>
          <span className="text-xl font-bold text-gray-800 tracking-tight">MediCaixa</span>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4 md:mt-0">
          <button
            onClick={() => navigateTo('dashboard')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${view === 'dashboard' && !showForm ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm translate-x-1' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
          >
            <LayoutDashboard size={20} />
            <span>Painel Geral</span>
          </button>
          
          <button
            onClick={() => navigateTo('history')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${view === 'history' && !showForm ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm translate-x-1' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
          >
            <List size={20} />
            <span>Histórico</span>
          </button>

          <button
             onClick={() => navigateTo('insights')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${view === 'insights' && !showForm ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm translate-x-1' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}`}
          >
            <Activity size={20} />
            <span>Análise IA</span>
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => openForm(TransactionType.INCOME)}
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium py-3 px-4 rounded-xl shadow-lg shadow-blue-200 flex items-center justify-center space-x-2 transition-all transform hover:scale-[1.02] active:scale-95"
          >
            <Plus size={20} />
            <span>Novo Lançamento</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100vh-64px)] md:h-screen">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
            {showForm ? 'Novo Lançamento' : view === 'dashboard' ? 'Visão Geral' : view === 'history' ? 'Transações' : 'Consultor Inteligente'}
          </h1>
          <p className="text-gray-400 text-sm mt-1 font-medium">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </header>

        {showForm ? (
          <div className="max-w-2xl mx-auto animate-fade-in-up">
            <TransactionForm 
              initialType={formInitialType} 
              onSave={handleAddTransaction} 
              onCancel={() => setShowForm(false)} 
            />
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            {/* Quick Actions for Dashboard */}
            {view === 'dashboard' && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button 
                  onClick={() => openForm(TransactionType.INCOME)}
                  className="flex items-center justify-center space-x-2 p-4 bg-white border border-green-100 rounded-xl hover:bg-green-50 hover:border-green-200 transition-all group cursor-pointer shadow-sm hover:shadow-md"
                >
                  <div className="bg-green-100 rounded-full p-2 text-green-600 group-hover:scale-110 transition-transform">
                    <Plus size={18} />
                  </div>
                  <span className="font-semibold text-green-700">Adicionar Receita</span>
                </button>
                <button 
                  onClick={() => openForm(TransactionType.EXPENSE)}
                  className="flex items-center justify-center space-x-2 p-4 bg-white border border-red-100 rounded-xl hover:bg-red-50 hover:border-red-200 transition-all group cursor-pointer shadow-sm hover:shadow-md"
                >
                  <div className="bg-red-100 rounded-full p-2 text-red-600 group-hover:scale-110 transition-transform">
                    <Plus size={18} />
                  </div>
                  <span className="font-semibold text-red-700">Adicionar Despesa</span>
                </button>
              </div>
            )}

            {/* Summary Cards */}
            {(view === 'dashboard' || view === 'history') && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SummaryCard title="Entradas" amount={totals.income} type="income" />
                <SummaryCard title="Saídas" amount={totals.expense} type="expense" />
                <SummaryCard title="Saldo em Caixa" amount={totals.balance} type="balance" />
              </div>
            )}

            {view === 'dashboard' && (
              <div className="space-y-6">
                <ChartsSection transactions={transactions} />
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-gray-800">Últimas Movimentações</h2>
                    <button 
                      onClick={() => navigateTo('history')} 
                      className="text-blue-600 text-sm font-semibold hover:text-blue-700 hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors"
                    >
                      Ver todas
                    </button>
                  </div>
                  <TransactionList transactions={transactions.slice(-5)} onDelete={handleDeleteTransaction} />
                </div>
              </div>
            )}

            {view === 'history' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                 <TransactionList transactions={transactions} onDelete={handleDeleteTransaction} />
              </div>
            )}

            {view === 'insights' && (
              <AIInsights transactions={transactions} />
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;