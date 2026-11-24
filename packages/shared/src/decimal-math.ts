import Decimal from 'decimal.js';

// Configure Decimal.js for institutional financial standards
Decimal.set({
  precision: 28,
  rounding: Decimal.ROUND_HALF_UP,
  toExpNeg: -12,
  toExpPos: 28,
});

export class DecimalMath {
  /**
   * Safe initialization of Decimal instance
   */
  static from(val: string | number | Decimal): Decimal {
    try {
      return new Decimal(val || 0);
    } catch {
      throw new Error(`Invalid decimal value: ${val}`);
    }
  }

  /**
   * Addition: a + b
   */
  static add(a: string | number | Decimal, b: string | number | Decimal): Decimal {
    return DecimalMath.from(a).plus(DecimalMath.from(b));
  }

  /**
   * Subtraction: a - b
   */
  static sub(a: string | number | Decimal, b: string | number | Decimal): Decimal {
    return DecimalMath.from(a).minus(DecimalMath.from(b));
  }

  static subtract(a: string | number | Decimal, b: string | number | Decimal): Decimal {
    return DecimalMath.sub(a, b);
  }

  /**
   * Multiplication: a * b
   */
  static mul(a: string | number | Decimal, b: string | number | Decimal): Decimal {
    return DecimalMath.from(a).times(DecimalMath.from(b));
  }

  static multiply(a: string | number | Decimal, b: string | number | Decimal): Decimal {
    return DecimalMath.mul(a, b);
  }

  /**
   * Division: a / b
   */
  static div(a: string | number | Decimal, b: string | number | Decimal): Decimal {
    const divisor = DecimalMath.from(b);
    if (divisor.isZero()) {
      throw new Error('ZeroDivisionError: Division by zero is prohibited in financial operations.');
    }
    return DecimalMath.from(a).dividedBy(divisor);
  }

  static divide(a: string | number | Decimal, b: string | number | Decimal): Decimal {
    return DecimalMath.div(a, b);
  }

  /**
   * Comparison helpers
   */
  static equals(a: string | number | Decimal, b: string | number | Decimal): boolean {
    return DecimalMath.from(a).equals(DecimalMath.from(b));
  }

  static lessThan(a: string | number | Decimal, b: string | number | Decimal): boolean {
    return DecimalMath.from(a).lessThan(DecimalMath.from(b));
  }

  static greaterThan(a: string | number | Decimal, b: string | number | Decimal): boolean {
    return DecimalMath.from(a).greaterThan(DecimalMath.from(b));
  }

  static lessThanOrEqualTo(a: string | number | Decimal, b: string | number | Decimal): boolean {
    return DecimalMath.from(a).lessThanOrEqualTo(DecimalMath.from(b));
  }

  static greaterThanOrEqualTo(a: string | number | Decimal, b: string | number | Decimal): boolean {
    return DecimalMath.from(a).greaterThanOrEqualTo(DecimalMath.from(b));
  }

  /**
   * Available Balance Invariant:
   * Available = Current - (Reserved + Blocked)
   */
  static calculateAvailableBalance(
    current: string | number | Decimal,
    reserved: string | number | Decimal,
    blocked: string | number | Decimal
  ): Decimal {
    const currentDec = DecimalMath.from(current);
    const reservedDec = DecimalMath.from(reserved);
    const blockedDec = DecimalMath.from(blocked);

    const deductions = reservedDec.plus(blockedDec);
    const available = currentDec.minus(deductions);
    return available;
  }

  /**
   * Verify Double-Entry Balance:
   * Sum(Debit) == Sum(Credit) within epsilon tolerance (1e-8)
   */
  static isBalanced(
    totalDebit: string | number | Decimal,
    totalCredit: string | number | Decimal,
    tolerance = '0.00000001'
  ): boolean {
    const diff = DecimalMath.from(totalDebit).minus(DecimalMath.from(totalCredit)).abs();
    return diff.lessThanOrEqualTo(new Decimal(tolerance));
  }

  /**
   * Weighted Average Cost (WAC) update formula:
   * NewWAC = (OldCarryingValue + (PurchasedQty * PurchaseRate)) / (OldQty + PurchasedQty)
   * PRD Section 13 Standard: NUMERIC(24,12) for rates
   */
  static calculateNewWAC(
    oldQty: string | number | Decimal,
    oldCarryingValue: string | number | Decimal,
    purchasedQty: string | number | Decimal,
    purchaseRate: string | number | Decimal
  ): {
    newTotalQty: string;
    newCarryingValue: string;
    newWACRate: string;
  } {
    const oldQ = DecimalMath.from(oldQty);
    const oldVal = DecimalMath.from(oldCarryingValue);
    const buyQ = DecimalMath.from(purchasedQty);
    const rate = DecimalMath.from(purchaseRate);

    const purchaseCost = buyQ.times(rate);
    const newTotalQty = oldQ.plus(buyQ);
    const newCarryingValue = oldVal.plus(purchaseCost);

    const newWACRate = newTotalQty.isZero()
      ? new Decimal(0)
      : newCarryingValue.dividedBy(newTotalQty);

    return {
      newTotalQty: newTotalQty.toFixed(8),
      newCarryingValue: newCarryingValue.toFixed(8),
      newWACRate: newWACRate.toFixed(12),
    };
  }

  /**
   * Currency Sale Cost Basis & Realized Gain:
   * CostBasis = SoldQty * WACRate
   * GrossProceeds = SoldQty * SellingRate
   * RealizedFXGain = GrossProceeds - CostBasis
   */
  static calculateSaleProfit(
    soldQty: string | number | Decimal,
    sellingRate: string | number | Decimal,
    currentWACRate: string | number | Decimal
  ): {
    grossProceeds: string;
    costBasis: string;
    realizedGain: string;
  } {
    const qty = DecimalMath.from(soldQty);
    const sellR = DecimalMath.from(sellingRate);
    const wacR = DecimalMath.from(currentWACRate);

    const grossProceeds = qty.times(sellR);
    const costBasis = qty.times(wacR);
    const realizedGain = grossProceeds.minus(costBasis);

    return {
      grossProceeds: grossProceeds.toFixed(4),
      costBasis: costBasis.toFixed(4),
      realizedGain: realizedGain.toFixed(4),
    };
  }

  /**
   * Format decimal to fixed string according to currency precision
   */
  static format(val: string | number | Decimal, precision = 2): string {
    return DecimalMath.from(val).toFixed(precision);
  }
}
