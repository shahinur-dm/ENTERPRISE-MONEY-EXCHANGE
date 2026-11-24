export interface CurrencyMeta {
  code: string;
  name: string;
  symbol: string;
  decimalPlaces: number;
  country: string;
}

export const SUPPORTED_CURRENCIES: Record<string, CurrencyMeta> = {
  BDT: {
    code: 'BDT',
    name: 'Bangladeshi Taka',
    symbol: '৳',
    decimalPlaces: 2,
    country: 'Bangladesh',
  },
  MYR: {
    code: 'MYR',
    name: 'Malaysian Ringgit',
    symbol: 'RM',
    decimalPlaces: 2,
    country: 'Malaysia',
  },
  USD: {
    code: 'USD',
    name: 'United States Dollar',
    symbol: '$',
    decimalPlaces: 2,
    country: 'United States',
  },
  EUR: {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    decimalPlaces: 2,
    country: 'European Union',
  },
  GBP: {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    decimalPlaces: 2,
    country: 'United Kingdom',
  },
  AED: {
    code: 'AED',
    name: 'United Arab Emirates Dirham',
    symbol: 'د.إ',
    decimalPlaces: 2,
    country: 'United Arab Emirates',
  },
  SAR: {
    code: 'SAR',
    name: 'Saudi Riyal',
    symbol: '﷼',
    decimalPlaces: 2,
    country: 'Saudi Arabia',
  },
  SGD: {
    code: 'SGD',
    name: 'Singapore Dollar',
    symbol: 'S$',
    decimalPlaces: 2,
    country: 'Singapore',
  },
};

export const INITIAL_CORRIDOR = {
  sourceCountry: 'MYS',
  sourceCurrency: 'MYR',
  destinationCountry: 'BGD',
  destinationCurrency: 'BDT',
  pairSymbol: 'MYR/BDT',
};
