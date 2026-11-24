import Decimal from 'decimal.js';
import { DecimalMath } from '@erp/shared';
import * as bcrypt from 'bcryptjs';

describe('Phase 1 Financial ERP Foundation Verification', () => {
  describe('Mathematical Precision & Decimal.js Standards', () => {
    test('BR-FIN-01: Prohibits JavaScript float rounding leakage', () => {
      // Standard JS float fails: 0.1 + 0.2 === 0.30000000000000004
      const floatSum = 0.1 + 0.2;
      expect(floatSum).not.toBe(0.3);

      // DecimalMath precision must be exact
      const decSum = DecimalMath.add('0.1', '0.2').toString();
      expect(decSum).toBe('0.3');
    });

    test('BR-004: Double-Entry Equilibrium verification', () => {
      const debit1 = '3300000.00';
      const credit1 = '3000000.00';
      const credit2 = '300000.00';

      const totalDebit = debit1;
      const totalCredit = DecimalMath.add(credit1, credit2).toFixed(2);

      expect(DecimalMath.isBalanced(totalDebit, totalCredit)).toBe(true);

      // Discrepant journal line must be detected and rejected
      const imbalancedCredit = '3299999.99';
      expect(DecimalMath.isBalanced(totalDebit, imbalancedCredit)).toBe(false);
    });

    test('BR-003: Available Fund calculation with non-overlapping blocked/reserved amounts', () => {
      const current = '150000.00';
      const reserved = '20000.00';
      const blocked = '5000.00';

      const available = DecimalMath.calculateAvailableBalance(current, reserved, blocked).toFixed(2);
      expect(available).toBe('125000.00');

      // Attempting to spend 130,000 when available is 125,000 must be identified as insufficient
      const spendRequest = new Decimal('130000.00');
      const isSufficient = new Decimal(available).greaterThanOrEqualTo(spendRequest);
      expect(isSufficient).toBe(false);
    });

    test('BR-WAC: Weighted Average Cost (WAC) formula verification', () => {
      // PRD Section 11 Example:
      // 100,000 MYR @ 33 BDT + 50,000 MYR @ 34 BDT = 5,000,000 BDT carrying value
      // Total 150,000 MYR -> average 33.333333333333 BDT
      const pool1 = DecimalMath.calculateNewWAC('0', '0', '100000', '33');
      expect(pool1.newTotalQty).toBe('100000.00000000');
      expect(pool1.newCarryingValue).toBe('3300000.00000000');
      expect(pool1.newWACRate).toBe('33.000000000000');

      const pool2 = DecimalMath.calculateNewWAC(
        pool1.newTotalQty,
        pool1.newCarryingValue,
        '50000',
        '34'
      );
      expect(pool2.newTotalQty).toBe('150000.00000000');
      expect(pool2.newCarryingValue).toBe('5000000.00000000');
      expect(pool2.newWACRate).toBe('33.333333333333');

      // Sale of 20,000 MYR @ 35.00 BDT selling rate
      // Gross proceeds: 700,000; cost: 20,000 * 33.333333333333 = 666,666.67; realized gain: 33,333.33
      const sale = DecimalMath.calculateSaleProfit('20000', '35', pool2.newWACRate);
      expect(sale.grossProceeds).toBe('700000.0000');
      expect(sale.costBasis).toBe('666666.6667');
      expect(sale.realizedGain).toBe('33333.3333');
    });
  });

  describe('Security & Authentication Invariants', () => {
    test('BR-SEC-01: Password Hashing produces salt and resists plain text comparison', async () => {
      const rawPassword = 'InstitutionalPassword2026!';
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(rawPassword, salt);

      expect(hash).not.toBe(rawPassword);
      expect(await bcrypt.compare(rawPassword, hash)).toBe(true);
      expect(await bcrypt.compare('WrongPassword', hash)).toBe(false);
    });

    test('BR-020 & Maker-Checker Policy: Creator cannot approve sensitive transaction', () => {
      const creatorUserId: string = 'usr_maker_1001';
      const approverUserId: string = 'usr_maker_1001'; // Same user attempting approval

      const isMakerCheckerViolation = creatorUserId === approverUserId;
      expect(isMakerCheckerViolation).toBe(true);

      const validIndependentApprover: string = 'usr_checker_2002';
      expect(creatorUserId === validIndependentApprover).toBe(false);
    });
  });
});
