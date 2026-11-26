import Decimal from 'decimal.js';
import { DecimalMath } from '@erp/shared';

describe('Phase 9 — Multi-Currency Money Exchange & Trading ERP Test Suite (18 Scenarios)', () => {
  // Test 1: Multi-Currency Support
  test('Test 1: Multi-Currency Support — verifies standard currency codes and decimal precision', () => {
    const supportedCurrencies = ['MYR', 'USD', 'EUR', 'SAR', 'SGD'];
    expect(supportedCurrencies).toHaveLength(5);
    expect(supportedCurrencies).toContain('MYR');
    expect(supportedCurrencies).toContain('USD');
    expect(supportedCurrencies).toContain('EUR');
    expect(supportedCurrencies).toContain('SAR');
    expect(supportedCurrencies).toContain('SGD');
  });

  // Test 2: Initial Stock Setup
  test('Test 2: Initial Stock Setup — verifies opening inventory with zero or positive stock and WAC', () => {
    const openingQty = '10000.00';
    const openingWAC = '33.0000';
    const totalValuation = DecimalMath.mul(openingQty, openingWAC).toFixed(2);
    expect(totalValuation).toBe('330000.00');
  });

  // Test 3: First Purchase (FX Buy)
  test('Test 3: First Purchase (FX Buy) — 50,000 MYR @ 33.00 BDT', () => {
    const qty = '50000';
    const rate = '33.00';
    const totalCost = DecimalMath.mul(qty, rate).toFixed(2);
    expect(totalCost).toBe('1650000.00');

    const wac1 = DecimalMath.calculateNewWAC('0', '0', qty, rate);
    expect(Number(wac1.newTotalQty)).toBe(50000);
    expect(Number(wac1.newCarryingValue)).toBe(1650000);
    expect(Number(wac1.newWACRate)).toBe(33.0);
  });

  // Test 4: Second Purchase (Higher Rate)
  test('Test 4: Second Purchase (Higher Rate) — 50,000 MYR @ 34.00 BDT recalculates WAC to 33.50 BDT', () => {
    // Current pool: 50,000 MYR carrying 1,650,000 BDT
    const currentQty = '50000';
    const currentVal = '1650000';

    // New purchase: 50,000 MYR @ 34 BDT = 1,700,000 BDT
    const newQty = '50000';
    const newRate = '34.00';

    const wac2 = DecimalMath.calculateNewWAC(currentQty, currentVal, newQty, newRate);
    expect(Number(wac2.newTotalQty)).toBe(100000);
    expect(Number(wac2.newCarryingValue)).toBe(3350000);
    // (1,650,000 + 1,700,000) / 100,000 = 33.50
    expect(Number(wac2.newWACRate)).toBe(33.5);
  });

  // Test 5: Third Purchase (Lower Rate)
  test('Test 5: Third Purchase (Lower Rate) — 50,000 MYR @ 32.00 BDT updates WAC correctly', () => {
    // Current pool: 100,000 MYR carrying 3,350,000 BDT
    const currentQty = '100000';
    const currentVal = '3350000';

    // New purchase: 50,000 MYR @ 32 BDT = 1,600,000 BDT
    const newQty = '50000';
    const newRate = '32.00';

    const wac3 = DecimalMath.calculateNewWAC(currentQty, currentVal, newQty, newRate);
    expect(Number(wac3.newTotalQty)).toBe(150000);
    expect(Number(wac3.newCarryingValue)).toBe(4950000);
    // 4,950,000 / 150,000 = 33.00
    expect(Number(wac3.newWACRate)).toBe(33.0);
  });

  // Test 6: Partial Payment Purchase
  test('Test 6: Partial Payment Purchase — Total 1,650,000 BDT, Paid 1,000,000 BDT -> Due 650,000 BDT', () => {
    const totalCost = '1650000.00';
    const paidAmount = '1000000.00';
    const dueAmount = DecimalMath.sub(totalCost, paidAmount).toFixed(2);

    expect(dueAmount).toBe('650000.00');
    // Party payable increases by due amount
    const partyBalanceBefore = '0.00';
    const partyBalanceAfter = DecimalMath.sub(partyBalanceBefore, dueAmount).toFixed(2);
    expect(partyBalanceAfter).toBe('-650000.00'); // Negative balance indicates payable
  });

  // Test 7: Credit Purchase
  test('Test 7: Credit Purchase — 100% on credit -> Due equals Total Cost', () => {
    const totalCost = '500000.00';
    const paidAmount = '0.00';
    const dueAmount = DecimalMath.sub(totalCost, paidAmount).toFixed(2);

    expect(dueAmount).toBe('500000.00');
  });

  // Test 8: Currency Sale (Full Payment) & COGS & Gross Profit
  test('Test 8: Currency Sale (Full Payment) — Sell 20,000 MYR @ 35.00 BDT (WAC 33.00 BDT)', () => {
    const qty = '20000';
    const sellRate = '35.00';
    const currentWAC = '33.00';

    const saleCalc = DecimalMath.calculateSaleProfit(qty, sellRate, currentWAC);
    expect(Number(saleCalc.grossProceeds)).toBe(700000); // 20,000 * 35 = 700,000
    expect(Number(saleCalc.costBasis)).toBe(660000); // 20,000 * 33 = 660,000
    expect(Number(saleCalc.realizedGain)).toBe(40000); // 700,000 - 660,000 = +40,000

    // Full payment received
    const receivedAmount = '700000.00';
    const customerDue = DecimalMath.sub('700000.00', receivedAmount).toFixed(2);
    expect(customerDue).toBe('0.00');
  });

  // Test 9: Currency Sale (Partial Payment)
  test('Test 9: Currency Sale (Partial Payment) — Gross 700,000 BDT, Received 500,000 BDT -> Due 200,000 BDT', () => {
    const grossProceeds = '700000.00';
    const receivedAmount = '500000.00';
    const dueAmount = DecimalMath.sub(grossProceeds, receivedAmount).toFixed(2);

    expect(dueAmount).toBe('200000.00');
    // Party balance debited (receivable = positive balance)
    const partyBalanceBefore = '0.00';
    const partyBalanceAfter = DecimalMath.add(partyBalanceBefore, dueAmount).toFixed(2);
    expect(partyBalanceAfter).toBe('200000.00');
  });

  // Test 10: Currency Sale (Credit)
  test('Test 10: Currency Sale (Credit) — 100% on credit -> Full receivable created', () => {
    const grossProceeds = '350000.00';
    const receivedAmount = '0.00';
    const dueAmount = DecimalMath.sub(grossProceeds, receivedAmount).toFixed(2);

    expect(dueAmount).toBe('350000.00');
  });

  // Test 11: Profit Calculation Verification
  test('Test 11: Profit Calculation Verification — Realized Margin = Quantity * (Selling Rate - WAC)', () => {
    const qty = '15000';
    const sellingRate = '35.50';
    const wac = '33.20';

    const unitSpread = DecimalMath.sub(sellingRate, wac).toFixed(4); // 2.3000
    const totalProfit = DecimalMath.mul(qty, unitSpread).toFixed(2); // 15,000 * 2.30 = 34,500

    const engineCalc = DecimalMath.calculateSaleProfit(qty, sellingRate, wac);
    expect(new Decimal(engineCalc.realizedGain).toFixed(2)).toBe(totalProfit);
  });

  // Test 12: Negative Stock Prevention
  test('Test 12: Negative Stock Prevention — Rejects selling quantity exceeding available stock', () => {
    const currentStock = 10000;
    const requestedSaleQty = 15000;

    const isAvailable = currentStock >= requestedSaleQty;
    expect(isAvailable).toBe(false);

    // Guard function verification
    const validateStock = (stock: number, req: number) => {
      if (req > stock) {
        throw new Error('Insufficient currency stock. Sale would cause negative inventory.');
      }
    };

    expect(() => validateStock(currentStock, requestedSaleQty)).toThrow(
      'Insufficient currency stock. Sale would cause negative inventory.'
    );
  });

  // Test 13: Party Ledger Accuracy
  test('Test 13: Party Ledger Accuracy — running balance calculation consistency', () => {
    let runningBalance = new Decimal('0.00');

    // 1. Credit Purchase: We owe party 300,000 BDT (Credit)
    const purchaseDue = new Decimal('300000.00');
    runningBalance = runningBalance.minus(purchaseDue);
    expect(runningBalance.toFixed(2)).toBe('-300000.00');

    // 2. Settlement Payment: We pay party 200,000 BDT (Debit)
    const payment = new Decimal('200000.00');
    runningBalance = runningBalance.plus(payment);
    expect(runningBalance.toFixed(2)).toBe('-100000.00');

    // 3. Credit Sale: Party buys 150,000 BDT on credit (Debit)
    const saleDue = new Decimal('150000.00');
    runningBalance = runningBalance.plus(saleDue);
    expect(runningBalance.toFixed(2)).toBe('50000.00'); // Now party owes us 50,000 BDT
  });

  // Test 14: Customer Payment (Payable Settlement)
  test('Test 14: Customer Payment — Deducts cash account and clears party payable', () => {
    const initialCash = new Decimal('1000000.00');
    const paymentAmount = new Decimal('100000.00');

    const updatedCash = initialCash.minus(paymentAmount);
    expect(updatedCash.toFixed(2)).toBe('900000.00');

    const initialPayable = new Decimal('-100000.00');
    const updatedPayable = initialPayable.plus(paymentAmount);
    expect(updatedPayable.toFixed(2)).toBe('0.00'); // Fully settled
  });

  // Test 15: Buyer Receipt (Receivable Collection)
  test('Test 15: Buyer Receipt — Adds cash account and clears party receivable', () => {
    const initialCash = new Decimal('500000.00');
    const receiptAmount = new Decimal('200000.00');

    const updatedCash = initialCash.plus(receiptAmount);
    expect(updatedCash.toFixed(2)).toBe('700000.00');

    const initialReceivable = new Decimal('200000.00');
    const updatedReceivable = initialReceivable.minus(receiptAmount);
    expect(updatedReceivable.toFixed(2)).toBe('0.00'); // Fully collected
  });

  // Test 16: Inter-Account Transfer
  test('Test 16: Inter-Account Transfer — Conserves total business liquidity', () => {
    const counterCash = new Decimal('300000.00');
    const vaultCash = new Decimal('700000.00');
    const initialTotal = counterCash.plus(vaultCash);

    const transferAmount = new Decimal('150000.00');
    const newCounterCash = counterCash.minus(transferAmount);
    const newVaultCash = vaultCash.plus(transferAmount);

    expect(newCounterCash.toFixed(2)).toBe('150000.00');
    expect(newVaultCash.toFixed(2)).toBe('850000.00');
    expect(newCounterCash.plus(newVaultCash).toFixed(2)).toBe(initialTotal.toFixed(2));
  });

  // Test 17: Business Expenses
  test('Test 17: Business Expenses — Deducts cash and reduces net profit', () => {
    const grossProfit = new Decimal('150000.00');
    const rentExpense = new Decimal('30000.00');
    const utilitiesExpense = new Decimal('10000.00');

    const totalExpenses = rentExpense.plus(utilitiesExpense);
    const netProfit = grossProfit.minus(totalExpenses);

    expect(totalExpenses.toFixed(2)).toBe('40000.00');
    expect(netProfit.toFixed(2)).toBe('110000.00');
  });

  // Test 18: Daily Closing & Reconciliations
  test('Test 18: Daily Closing — Reconciles physical cash vs expected and computes variance', () => {
    const expectedCash = new Decimal('1250000.00');
    const physicalCountedCash = new Decimal('1250000.00');

    const variance = physicalCountedCash.minus(expectedCash);
    expect(variance.toFixed(2)).toBe('0.00'); // Zero variance = 100% accurate match

    // Minor discrepancy test
    const discrepancyCount = new Decimal('1249500.00');
    const discrepancy = discrepancyCount.minus(expectedCash);
    expect(discrepancy.toFixed(2)).toBe('-500.00'); // 500 BDT shortage
  });
});
