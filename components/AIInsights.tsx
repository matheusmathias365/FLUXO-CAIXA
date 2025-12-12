import React, { useState } from 'react';
import { Transaction } from '../types';
import { analyzeFinances } from '../services/geminiService';
import { Sparkles, BrainCircuit, RefreshCcw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AIInsightsProps {
  transactions: Transaction[];
}

export const AIInsights: React.FC<AIInsightsProps> = ({ transactions }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    const result = await analyzeFinances(transactions);
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl shadow-sm border border-indigo-100 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="bg-indigo-600 p-2 rounded-lg text-white mr-3 shadow-lg shadow-indigo-200">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-indigo-900">Consultor IA MediCaixa</h3>
            <p className="text-sm text-indigo-600">Análise inteligente dos dados financeiros da sua clínica.</p>
          </div>
        </div>
        
        <button
          onClick={handleAnalyze}
          disabled={loading || transactions.length === 0}
          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
            loading || transactions.length === 0
              ? 'bg-indigo-200 text-white cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
          }`}
        >
          {loading ? (
            <RefreshCcw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <BrainCircuit className="w-4 h-4 mr-2" />
          )}
          {loading ? 'Analisando...' : 'Gerar Relatório IA'}
        </button>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-12 text-indigo-400">
          <RefreshCcw className="w-8 h-8 animate-spin mb-3" />
          <p>Processando dados da clínica...</p>
        </div>
      )}

      {!loading && analysis && (
        <div className="bg-white rounded-lg p-6 shadow-inner border border-indigo-50 prose prose-indigo max-w-none">
          <ReactMarkdown>{analysis}</ReactMarkdown>
        </div>
      )}

      {!loading && !analysis && (
        <div className="text-center py-8 text-indigo-400">
          <p>Clique no botão acima para receber insights sobre entradas, saídas e saúde financeira.</p>
        </div>
      )}
    </div>
  );
};