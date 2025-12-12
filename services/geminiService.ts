import { GoogleGenAI } from "@google/genai";
import { Transaction } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeFinances = async (transactions: Transaction[]): Promise<string> => {
  if (transactions.length === 0) {
    return "Não há transações suficientes para análise.";
  }

  const ai = getClient();
  
  // Prepare a summarized version of data to save tokens
  const dataSummary = transactions.map(t => ({
    date: t.date,
    type: t.type,
    amount: t.amount,
    category: t.category,
    desc: t.description
  }));

  const prompt = `
    Atue como um consultor financeiro sênior especializado em gestão de clínicas médicas.
    Analise os seguintes dados financeiros (formato JSON) desta clínica:
    
    ${JSON.stringify(dataSummary)}

    Por favor, forneça um relatório conciso em Markdown com:
    1. **Resumo da Saúde Financeira**: Uma visão geral do fluxo de caixa atual.
    2. **Principais Fontes de Receita**: Identifique o que traz mais dinheiro (ex: Consultas, Cirurgias).
    3. **Análise de Gastos**: Onde a clínica está gastando mais e se há algo alarmante.
    4. **Sugestões de Melhoria**: 2 a 3 ações práticas para aumentar o lucro ou reduzir custos.

    Use uma linguagem profissional, direta e em Português do Brasil.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for faster standard response
      }
    });

    return response.text || "Não foi possível gerar a análise no momento.";
  } catch (error) {
    console.error("Erro ao analisar finanças:", error);
    return "Ocorreu um erro ao conectar com a IA para análise financeira. Verifique sua chave de API.";
  }
};