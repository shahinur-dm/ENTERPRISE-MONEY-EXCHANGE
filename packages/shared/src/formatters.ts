import { DecimalMath } from './decimal-math';
import { SUPPORTED_CURRENCIES } from './currency-constants';
import * as crypto from 'crypto';

/**
 * Format currency amount with symbol and thousands separators
 * Example: formatMoney("1250000.5", "BDT") -> "৳ 1,250,000.50"
 */
export function formatMoney(amount: string | number, currencyCode: string): string {
  const meta = SUPPORTED_CURRENCIES[currencyCode] || {
    symbol: currencyCode,
    decimalPlaces: 2,
  };

  const fixed = DecimalMath.format(amount, meta.decimalPlaces);
  const parts = fixed.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return `${meta.symbol} ${parts.join('.')}`;
}

/**
 * Mask sensitive account number or national ID
 * Example: maskSensitive("1234567890") -> "******7890"
 */
export function maskSensitive(val: string, visibleEndChars = 4): string {
  if (!val || val.length <= visibleEndChars) return val;
  const maskedLength = val.length - visibleEndChars;
  return '*'.repeat(maskedLength) + val.slice(-visibleEndChars);
}

/**
 * Generate cryptographic tamper-evident audit hash
 */
export function generateAuditHash(
  payload: Record<string, unknown>,
  secretKey = 'erp-audit-secret-key'
): string {
  const serialized = JSON.stringify(payload, Object.keys(payload).sort());
  return crypto.createHmac('sha256', secretKey).update(serialized).digest('hex');
}
