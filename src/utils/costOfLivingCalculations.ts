import costOfLivingData from '../data/costOfLiving.json';

export interface CostOfLivingComparison {
  currentState: string;
  targetState: string;
  currentSalary: number;
  equivalentSalary: number;
  purchasingPowerChange: number;
  costDifference: number;
  currentIndex: number;
  targetIndex: number;
}

export function calculateCostOfLivingAdjustment(
  currentStateCode: string,
  targetStateCode: string,
  currentSalary: number
): CostOfLivingComparison {
  const currentState = costOfLivingData.costOfLivingIndex.states[currentStateCode as keyof typeof costOfLivingData.costOfLivingIndex.states];
  const targetState = costOfLivingData.costOfLivingIndex.states[targetStateCode as keyof typeof costOfLivingData.costOfLivingIndex.states];

  if (!currentState || !targetState) {
    throw new Error('Invalid state code provided');
  }

  const currentIndex = currentState.index;
  const targetIndex = targetState.index;

  // Calculate equivalent salary needed to maintain same purchasing power
  const equivalentSalary = (currentSalary * targetIndex) / currentIndex;

  // Calculate purchasing power change
  const purchasingPowerChange = ((currentIndex - targetIndex) / targetIndex) * 100;

  // Calculate cost difference
  const costDifference = equivalentSalary - currentSalary;

  return {
    currentState: currentState.name,
    targetState: targetState.name,
    currentSalary,
    equivalentSalary,
    purchasingPowerChange,
    costDifference,
    currentIndex,
    targetIndex
  };
}

export function getCostOfLivingIndex(stateCode: string): number {
  const state = costOfLivingData.costOfLivingIndex.states[stateCode as keyof typeof costOfLivingData.costOfLivingIndex.states];
  return state ? state.index : 100; // Default to US average if state not found
}

export function getAllStates(): Array<{ code: string; name: string; index: number }> {
  return Object.entries(costOfLivingData.costOfLivingIndex.states).map(([code, data]) => ({
    code,
    name: data.name,
    index: data.index
  }));
}

export function getTop10MostExpensiveStates(): Array<{ code: string; name: string; index: number }> {
  return getAllStates()
    .sort((a, b) => b.index - a.index)
    .slice(0, 10);
}

export function getTop10LeastExpensiveStates(): Array<{ code: string; name: string; index: number }> {
  return getAllStates()
    .sort((a, b) => a.index - b.index)
    .slice(0, 10);
}
