export function formatCurrency(amount: number, minimumFractionDigits = 0): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits,
    maximumFractionDigits: 2
  }).format(amount);
}

export function formatPercentage(percentage: number, minimumFractionDigits = 1): string {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits,
    maximumFractionDigits: 2
  }).format(percentage / 100);
}

export function formatNumber(number: number, minimumFractionDigits = 0): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits,
    maximumFractionDigits: 2
  }).format(number);
}

export function formatCompactCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `${formatCurrency(amount / 1000000, 1)}M`;
  }
  if (amount >= 1000) {
    return `${formatCurrency(amount / 1000, 1)}K`;
  }
  return formatCurrency(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}
