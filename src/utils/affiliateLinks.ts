export interface AffiliateLink {
  name: string;
  description: string;
  url: string;
  displayCondition?: (income: number, taxAmount: number, state: string) => boolean;
  category: 'tax-prep' | 'relocation' | 'financial' | 'career';
}

export const affiliateLinks: AffiliateLink[] = [
  {
    name: 'TurboTax',
    description: 'Maximize your tax refund with expert guidance',
    url: 'https://sovrn.co/e2mnr96',
    category: 'tax-prep',
    displayCondition: (income, taxAmount) => income > 30000 || taxAmount > 3000
  },
  {
    name: 'H&R Block',
    description: 'Professional tax preparation services',
    url: 'https://sovrn.co/13sowbx',
    category: 'tax-prep',
    displayCondition: (income, taxAmount) => income > 50000 || taxAmount > 5000
  },
  {
    name: 'Credit Karma Tax',
    description: 'Free tax filing with expert help',
    url: 'https://sovrn.co/6h9aeb3',
    category: 'tax-prep',
    displayCondition: (income, taxAmount) => income < 75000
  },
  {
    name: 'FreeTaxUSA',
    description: 'Affordable federal & state tax filing',
    url: 'https://sovrn.co/2qdtdcy',
    category: 'tax-prep',
    displayCondition: (income, taxAmount) => income < 100000
  }
];

export function getRelevantAffiliateLinks(
  income: number,
  taxAmount: number,
  state: string,
  category?: 'tax-prep' | 'relocation' | 'financial' | 'career'
): AffiliateLink[] {
  return affiliateLinks.filter(link => {
    if (category && link.category !== category) return false;
    if (link.displayCondition) {
      return link.displayCondition(income, taxAmount, state);
    }
    return true;
  });
}

export function formatAffiliateUrl(url: string, source = 'wagecrunch'): string {
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.set('utm_source', source);
    urlObj.searchParams.set('utm_medium', 'referral');
    urlObj.searchParams.set('utm_campaign', 'calculator');
    return urlObj.toString();
  } catch {
    // If URL parsing fails, return original URL
    return url;
  }
}
