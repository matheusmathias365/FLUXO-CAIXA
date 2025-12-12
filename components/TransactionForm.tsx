import React, { useState } from 'react';
import { Transaction, TransactionType, Category, PaymentMethod } from '../types';
import { Save, X, ArrowUpCircle, ArrowDownCircle, Calendar, User, FileText, DollarSign } from 'lucide-react';

interface TransactionFormProps {
  onSave: (transaction: Transaction) => void;
  onCancel: () => void;
  initialType?: TransactionType;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onSave, onCancel, initialType = TransactionType.INCOME }) => {
  const [type, setType] = useState<TransactionType>(initialType);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>(Category.CONSULTATION);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [patientName, setPatientName] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !date) return;

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      description,
      amount: parseFloat(amount),
      type,
      category,
      paymentMethod,
      date,
      patientName: patientName || undefined,
      notes: notes || undefined
    };

    onSave(newTransaction);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header with Type Toggle */}
      <div className="grid grid-cols-2 text-center border-b border-gray-100">
        <button
          type="button"
          onClick={() => setType(TransactionType.INCOME)}
          className={`py-4 font-bold flex items-center justify-center transition-colors ${
            type === TransactionType.INCOME
              ? 'bg-green-50 text-green-700 border-b-2 border-green-500'
              : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600'
          }`}
        >
          <ArrowUpCircle className="w-5 h-5 mr-2" />
          Entrada (Receita)
        </button>
        <button
          type="button"
          onClick={() => setType(TransactionType.EXPENSE)}
          className={`py-4 font-bold flex items-center justify-center transition-colors ${
            type === TransactionType.EXPENSE
              ? 'bg-red-50 text-red-700 border-b-2 border-red-500'
              : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600'
          }`}
        >
          <ArrowDownCircle className="w-5 h-5 mr-2" />
          Saída (Despesa)
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
        
        {/* Main Amount & Description */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Descrição do Lançamento</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FileText className="h-5 w-5" />
              </div>
              <input
                type="text"
                required
                autoFocus
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow text-gray-800 placeholder-gray-300"
                placeholder={type === TransactionType.INCOME ? "Ex: Consulta Particular" : "Ex: Conta de Luz"}
              />
            </div>
          </div>

          <div>
             <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Valor (R$)</label>
             <div className="relative">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                 <span className="font-bold text-lg">R$</span>
               </div>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:border-transparent outline-none transition-shadow text-2xl font-bold placeholder-gray-200 ${type === TransactionType.INCOME ? 'focus:ring-green-500 text-green-700' : 'focus:ring-red-500 text-red-700'}`}
                placeholder="0,00"
              />
            </div>
          </div>
        </div>

        <div className="h-px bg-gray-100 my-2"></div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Data</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Calendar className="h-5 w-5" />
              </div>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-700 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Categoria</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-700 bg-white"
            >
              {Object.values(Category).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
             <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Forma de Pagamento</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-700 bg-white"
            >
              {Object.values(PaymentMethod).map((method) => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
          </div>

          {type === TransactionType.INCOME && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Paciente (Opcional)</label>
               <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-700"
                  placeholder="Nome completo"
                />
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Observações</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-700 resize-none"
            placeholder="Detalhes adicionais..."
          />
        </div>

        <div className="flex justify-end pt-4 gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-xl text-gray-600 font-medium hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className={`px-8 py-3 rounded-xl text-white font-bold shadow-lg transform transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center ${type === TransactionType.INCOME ? 'bg-green-600 hover:bg-green-700 shadow-green-200' : 'bg-red-600 hover:bg-red-700 shadow-red-200'}`}
          >
            <Save className="w-5 h-5 mr-2" />
            Confirmar {type === TransactionType.INCOME ? 'Entrada' : 'Saída'}
          </button>
        </div>
      </form>
    </div>
  );
};