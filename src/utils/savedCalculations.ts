export interface SavedCalculation {
  id: string;
  name: string;
  createdAt: string;
  data: {
    hourlyRate?: number;
    annualSalary?: number;
    hoursPerWeek: number;
    weeksPerYear: number;
    state: string;
    filingStatus: string;
    grossIncome: number;
    netIncome: number;
    totalTax: number;
    effectiveTaxRate: number;
  };
}

const STORAGE_KEY = 'wagecrunch_saved_calculations';
const MAX_FREE_SAVES = 3;
const MAX_PREMIUM_SAVES = 25;

export function getSavedCalculations(): SavedCalculation[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading saved calculations:', error);
    return [];
  }
}

export function saveCalculation(
  calculation: Omit<SavedCalculation, 'id' | 'createdAt'>,
  isPremium = false
): { success: boolean; error?: string } {
  try {
    const existing = getSavedCalculations();
    const maxSaves = isPremium ? MAX_PREMIUM_SAVES : MAX_FREE_SAVES;

    if (existing.length >= maxSaves) {
      return {
        success: false,
        error: isPremium
          ? `Maximum ${MAX_PREMIUM_SAVES} calculations reached`
          : `Free users can save up to ${MAX_FREE_SAVES} calculations. Upgrade to Premium for ${MAX_PREMIUM_SAVES} saves.`
      };
    }

    const newCalculation: SavedCalculation = {
      ...calculation,
      id: generateId(),
      createdAt: new Date().toISOString()
    };

    const updated = [newCalculation, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    return { success: true };
  } catch (error) {
    console.error('Error saving calculation:', error);
    return { success: false, error: 'Failed to save calculation' };
  }
}

export function deleteCalculation(id: string): boolean {
  try {
    const existing = getSavedCalculations();
    const updated = existing.filter(calc => calc.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Error deleting calculation:', error);
    return false;
  }
}

export function updateCalculationName(id: string, name: string): boolean {
  try {
    const existing = getSavedCalculations();
    const updated = existing.map(calc =>
      calc.id === id ? { ...calc, name } : calc
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (error) {
    console.error('Error updating calculation name:', error);
    return false;
  }
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}
