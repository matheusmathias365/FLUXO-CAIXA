export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export enum PaymentMethod {
  CASH = 'Dinheiro',
  CREDIT_CARD = 'Cartão de Crédito',
  DEBIT_CARD = 'Cartão de Débito',
  PIX = 'PIX',
  TRANSFER = 'Transferência',
  BOLETO = 'Boleto',
  PLAN = 'Convênio'
}

export enum Category {
  CONSULTATION = 'Consulta',
  EXAM = 'Exame',
  SURGERY = 'Cirurgia',
  SALARY = 'Salários',
  RENT = 'Aluguel',
  SUPPLIES = 'Insumos',
  UTILITIES = 'Contas (Luz/Água/Net)',
  MARKETING = 'Marketing',
  MAINTENANCE = 'Manutenção',
  OTHER = 'Outros'
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: Category | string;
  date: string; // ISO Date string YYYY-MM-DD
  paymentMethod: PaymentMethod;
  notes?: string;
  patientName?: string;
}

export interface DashboardStats {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}
