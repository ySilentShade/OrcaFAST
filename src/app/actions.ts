"use server";
import type { BudgetDemoData } from '@/types/budget';
// Assuming a flow is defined in src/ai/flows/budgetDemoFlow.ts
// For now, we'll mock this. In a real scenario, this would call a Genkit flow.
// import { getDemoBudgetDataFlow } from '@/ai/flows/budgetDemoFlow'; 

export async function fetchDemoBudgetData(): Promise<BudgetDemoData | null> {
  try {
    // const result = await runFlow(getDemoBudgetDataFlow, {});
    // For now, return mock data as the flow is not actually implemented
    // by this persona.
    console.log("AI Flow: fetchDemoBudgetData called (mocked)");
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    const mockData: BudgetDemoData = {
      clientName: "Cliente Exemplo IA",
      clientAddress: "Rua da Inteligência Artificial, 101\nTecnopolis, IA 90210",
      item: {
        description: "Consultoria em Estratégia de Vídeo Marketing",
        quantity: 1,
        unitPrice: 750.50,
      }
    };
    return mockData;

  } catch (error) {
    console.error("Error fetching demo budget data from AI flow:", error);
    return null;
  }
}
