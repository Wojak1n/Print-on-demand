// Currency utility functions

export type CurrencyType = 'USD ($)' | 'EUR (€)' | 'MAD (DH)';

export interface CurrencyConfig {
  symbol: string;
  code: string;
  position: 'before' | 'after';
}

const CURRENCY_MAP: Record<string, CurrencyConfig> = {
  'USD ($)': { symbol: '$', code: 'USD', position: 'before' },
  'EUR (€)': { symbol: '€', code: 'EUR', position: 'after' },
  'MAD (DH)': { symbol: 'DH', code: 'MAD', position: 'after' },
};

/**
 * Get the current currency setting from localStorage
 */
export const getCurrentCurrency = (): CurrencyType => {
  const saved = localStorage.getItem('currency');
  return (saved as CurrencyType) || 'USD ($)';
};

/**
 * Get currency configuration
 */
export const getCurrencyConfig = (): CurrencyConfig => {
  const currency = getCurrentCurrency();
  return CURRENCY_MAP[currency] || CURRENCY_MAP['USD ($)'];
};

/**
 * Format a price with the current currency
 * @param amount - The numeric amount to format
 * @param decimals - Number of decimal places (default: 2)
 */
export const formatPrice = (amount: number, decimals: number = 2): string => {
  const config = getCurrencyConfig();
  const formattedAmount = amount.toFixed(decimals);
  
  if (config.position === 'before') {
    return `${config.symbol}${formattedAmount}`;
  } else {
    return `${formattedAmount} ${config.symbol}`;
  }
};

/**
 * Get just the currency symbol
 */
export const getCurrencySymbol = (): string => {
  return getCurrencyConfig().symbol;
};

