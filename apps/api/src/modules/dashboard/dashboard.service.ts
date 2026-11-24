import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {
  async getDashboardSummary(scope = 'GLOBAL') {
    return {
      scope,
      kpis: {
        globalFundBdtEquivalent: '8500000.00',
        myrBalance: '150000.00',
        bdtBalance: '3550000.00',
        todayPurchaseBdt: '850000.00',
        todaySalesBdt: '1250000.00',
        todayNetProfitBdt: '42500.00',
        pendingTransfers: 18,
        activeBranches: 6,
        activeAgents: 24,
      },
      currencyPositions: [
        { currency: 'MYR', symbol: 'RM', quantity: '150000.00', wacRate: '33.3333', valuationBdt: '5000000.00' },
        { currency: 'BDT', symbol: '৳', quantity: '3550000.00', wacRate: '1.0000', valuationBdt: '3550000.00' },
        { currency: 'USD', symbol: '$', quantity: '25000.00', wacRate: '118.5000', valuationBdt: '2962500.00' },
        { currency: 'SAR', symbol: '﷼', quantity: '40000.00', wacRate: '31.6000', valuationBdt: '1264000.00' },
      ],
      recentTransactions: [
        {
          id: 'TXN-REM-1092',
          type: 'REMITTANCE',
          referenceNo: 'REM-202611-001092',
          sender: 'Mohammad Faruk Hossain',
          beneficiary: 'Rokeya Begum',
          sourceAmount: '2,500.00 MYR',
          destinationAmount: '87,500.00 BDT',
          rate: '35.00 BDT/MYR',
          status: 'processing',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        },
        {
          id: 'TXN-BUY-482',
          type: 'CURRENCY_PURCHASE',
          referenceNo: 'PUR-202611-000482',
          supplier: 'Metro Forex Wholesale Ltd',
          purchased: '50,000.00 MYR',
          rate: '33.00 BDT',
          totalPaid: '1,650,000.00 BDT',
          status: 'settled',
          timestamp: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
        },
        {
          id: 'TXN-SAL-882',
          type: 'CURRENCY_SALE',
          referenceNo: 'SAL-202611-000882',
          customer: 'Rahim Trading Corp',
          sold: '10,000.00 MYR',
          rate: '35.00 BDT',
          realizedGain: '20,000.00 BDT',
          status: 'settled',
          timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
        },
      ],
      profitTrends: [
        { day: 'Mon', grossProfit: 38000, netProfit: 29500 },
        { day: 'Tue', grossProfit: 45000, netProfit: 36000 },
        { day: 'Wed', grossProfit: 52000, netProfit: 41000 },
        { day: 'Thu', grossProfit: 49000, netProfit: 38500 },
        { day: 'Fri', grossProfit: 68000, netProfit: 54000 },
        { day: 'Sat', grossProfit: 58000, netProfit: 46000 },
        { day: 'Sun', grossProfit: 54000, netProfit: 42500 },
      ],
      complianceAlerts: [
        {
          id: 'CMP-ALT-01',
          type: 'THRESHOLD_LIMIT_EXCEEDED',
          riskLevel: 'HIGH',
          message: 'Single transaction exceeding RM 50,000 threshold flagged for manual compliance review',
          status: 'UNDER_REVIEW',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        },
        {
          id: 'CMP-ALT-02',
          type: 'PEP_SANCTIONS_MATCH',
          riskLevel: 'PROHIBITED',
          message: 'Beneficiary name phonetic match against central bank restricted watchlist',
          status: 'HOLD_ENFORCED',
          timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
        },
      ],
    };
  }
}
