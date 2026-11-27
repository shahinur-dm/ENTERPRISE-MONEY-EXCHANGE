import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Decimal from 'decimal.js';
import { connectDB } from '@/lib/db';

export const dynamic = 'force-dynamic';

function toDecimalString(val: any, fallback = '0.00'): string {
  if (val === null || val === undefined) return fallback;
  if (typeof val === 'object' && val.$numberDecimal) return val.$numberDecimal;
  if (typeof val === 'object' && typeof val.toString === 'function') return val.toString();
  return String(val);
}

function toDecimalNumber(val: any, fallback = 0): number {
  const str = toDecimalString(val, String(fallback));
  const num = parseFloat(str);
  return isNaN(num) ? fallback : num;
}

const defaultOrgId = new mongoose.Types.ObjectId('6b05b7f487fc2e8cf74f3f12');
const defaultLegalEntityId = new mongoose.Types.ObjectId('6b05b7f487fc2e8cf74f3f29');
const defaultBranchId = new mongoose.Types.ObjectId('6b05b7f487fc2e8cf74f3f30');

export async function GET(req: NextRequest, { params }: { params: { slug: string[] } }) {
  try {
    await connectDB();
    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json({ success: false, statusCode: 500, message: 'Database not connected' }, { status: 500 });
    }

    const slugPath = (params.slug || []).join('/');
    const url = new URL(req.url);

    // 1. /api/v1/currency/parties
    if (slugPath === 'currency/parties') {
      const type = url.searchParams.get('type');
      const query: any = {};
      if (type) query.partyType = type;
      const list = await db.collection('parties').find(query).sort({ createdAt: -1 }).toArray();

      const formatted = list.map((p) => ({
        _id: p._id.toString(),
        partyNo: p.partyNo || `PARTY-${p._id.toString().slice(-4)}`,
        name: p.name || 'Unnamed Party',
        businessName: p.businessName || '',
        phone: p.phone || '',
        partyType: p.partyType || 'CUSTOMER',
        currentBalanceBDT: toDecimalString(p.currentBalanceBDT, '0.00'),
      }));

      return NextResponse.json({ success: true, statusCode: 200, data: formatted });
    }

    // 2. /api/v1/currency/accounts
    if (slugPath === 'currency/accounts') {
      const list = await db.collection('financial_accounts').find({}).sort({ accountNo: 1 }).toArray();
      const formatted = list.map((acc) => ({
        _id: acc._id.toString(),
        accountNo: acc.accountNo,
        accountName: acc.accountName,
        accountType: acc.accountType,
        currency: acc.currency || 'BDT',
        balanceBDT: toDecimalString(acc.balanceBDT, '0.00'),
        bankName: acc.bankName || '',
        bankAccountNumber: acc.bankAccountNumber || '',
        branchName: acc.branchName || '',
      }));
      return NextResponse.json({ success: true, statusCode: 200, data: formatted });
    }

    // 3. /api/v1/currency/currencies
    if (slugPath === 'currency/currencies') {
      const list = await db.collection('currencies').find({}).sort({ code: 1 }).toArray();
      const formatted = list.map((c) => ({
        _id: c._id.toString(),
        code: c.code,
        name: c.name,
        symbol: c.symbol,
        flag: c.flag || '🌐',
        isBase: Boolean(c.isBase),
        isActive: c.isActive !== false,
      }));
      return NextResponse.json({ success: true, statusCode: 200, data: formatted });
    }

    // 4. /api/v1/currency/rates
    if (slugPath === 'currency/rates') {
      const list = await db.collection('exchange_rates').find({}).sort({ pairSymbol: 1 }).toArray();
      let formatted: any[] = [];
      if (list.length > 0) {
        formatted = list.map((r) => ({
          id: r._id.toString(),
          pairSymbol: r.pairSymbol,
          baseCurrency: r.baseCurrency,
          quoteCurrency: r.quoteCurrency,
          buyRate: toDecimalString(r.buyRate, '0.00'),
          sellRate: toDecimalString(r.sellRate, '0.00'),
          midRate: toDecimalString(r.midRate, '0.00'),
          spread: toDecimalString(r.spread, '0.00'),
          version: r.version || 1,
          status: r.status || 'ACTIVE',
          effectiveFrom: r.effectiveFrom || new Date().toISOString(),
        }));
      } else {
        formatted = [
          { id: 'rate-1', pairSymbol: 'USD/BDT', baseCurrency: 'USD', quoteCurrency: 'BDT', buyRate: '100.00', sellRate: '102.50', midRate: '101.25', spread: '2.50', status: 'ACTIVE' },
          { id: 'rate-2', pairSymbol: 'MYR/BDT', baseCurrency: 'MYR', quoteCurrency: 'BDT', buyRate: '25.00', sellRate: '26.50', midRate: '25.75', spread: '1.50', status: 'ACTIVE' },
          { id: 'rate-3', pairSymbol: 'SAR/BDT', baseCurrency: 'SAR', quoteCurrency: 'BDT', buyRate: '27.00', sellRate: '28.20', midRate: '27.60', spread: '1.20', status: 'ACTIVE' },
          { id: 'rate-4', pairSymbol: 'SGD/BDT', baseCurrency: 'SGD', quoteCurrency: 'BDT', buyRate: '90.00', sellRate: '92.50', midRate: '91.25', spread: '2.50', status: 'ACTIVE' },
          { id: 'rate-5', pairSymbol: 'EUR/BDT', baseCurrency: 'EUR', quoteCurrency: 'BDT', buyRate: '125.00', sellRate: '128.00', midRate: '126.50', spread: '3.00', status: 'ACTIVE' },
        ];
      }
      return NextResponse.json({ success: true, statusCode: 200, data: formatted });
    }

    // 5. /api/v1/currency/stock
    if (slugPath === 'currency/stock') {
      const pools = await db.collection('currency_cost_pools').find({}).toArray();
      const currencies = await db.collection('currencies').find({}).toArray();
      const currMap: Record<string, any> = {};
      currencies.forEach((c) => { currMap[c.code] = c; });

      // Group pools by currency code, preferring entries with legalEntityId or positive stock
      const aggregatedPools: Record<string, { qty: Decimal; val: Decimal; wac: Decimal }> = {};
      for (const p of pools) {
        const code = (p.currencyCode || p.currency || '').toUpperCase();
        if (!code) continue;
        const q = new Decimal(toDecimalString(p.totalQuantity, '0'));
        const v = new Decimal(toDecimalString(p.totalCostValuation, '0'));
        if (!aggregatedPools[code]) {
          aggregatedPools[code] = { qty: q, val: v, wac: q.gt(0) ? v.dividedBy(q) : new Decimal(toDecimalString(p.weightedAverageCostRate, '0')) };
        } else {
          // If existing is 0 and new has quantity, replace or sum
          aggregatedPools[code].qty = aggregatedPools[code].qty.plus(q);
          aggregatedPools[code].val = aggregatedPools[code].val.plus(v);
          if (aggregatedPools[code].qty.gt(0)) {
            aggregatedPools[code].wac = aggregatedPools[code].val.dividedBy(aggregatedPools[code].qty);
          }
        }
      }

      let totalValuation = new Decimal('0');
      const stocks = Object.keys(aggregatedPools).map((code) => {
        const p = aggregatedPools[code];
        const info = currMap[code] || { name: code, symbol: code, flag: '🌐' };
        totalValuation = totalValuation.plus(p.val);

        return {
          code,
          name: info.name || code,
          symbol: info.symbol || code,
          flag: info.flag || '🌐',
          stockQuantity: p.qty.toFixed(2),
          averageCostRateBDT: p.wac.toFixed(4),
          totalValuationBDT: p.val.toFixed(2),
          todayPurchased: p.qty.toFixed(2),
          todaySold: '0.00',
        };
      });

      return NextResponse.json({
        success: true,
        statusCode: 200,
        data: {
          stocks,
          totalValuationBDT: totalValuation.toFixed(2),
        },
      });
    }

    // 6. /api/v1/currency/stock/ledger
    if (slugPath === 'currency/stock/ledger') {
      const currency = url.searchParams.get('currency');
      const query: any = {};
      if (currency && currency !== 'ALL') query.currencyCode = currency;
      const list = await db.collection('currency_stock_movements').find(query).sort({ createdAt: -1 }).limit(100).toArray();

      const formatted = list.map((m) => ({
        _id: m._id.toString(),
        movementNo: m.movementNo || `MOV-${m._id.toString().slice(-6)}`,
        movementType: m.movementType,
        currencyCode: m.currencyCode,
        openingQuantity: toDecimalString(m.openingQuantity, '0.00'),
        inflowQuantity: toDecimalString(m.inflowQuantity, '0.00'),
        outflowQuantity: toDecimalString(m.outflowQuantity, '0.00'),
        closingQuantity: toDecimalString(m.closingQuantity, '0.00'),
        unitCostRate: toDecimalString(m.unitCostRate, '0.0000'),
        bdtValuation: toDecimalString(m.bdtValuation, '0.00'),
        reference: m.reference || '',
        timestamp: m.createdAt ? new Date(m.createdAt).toISOString() : new Date().toISOString(),
      }));

      return NextResponse.json({ success: true, statusCode: 200, data: formatted });
    }

    // 7. /api/v1/currency/purchases
    if (slugPath === 'currency/purchases') {
      const currency = url.searchParams.get('currency');
      const query: any = {};
      if (currency && currency !== 'ALL') {
        query.$or = [{ currency }, { purchasedCurrency: currency }];
      }
      const list = await db.collection('currency_purchases').find(query).sort({ createdAt: -1 }).limit(200).toArray();

      const formatted = list.map((p) => ({
        _id: p._id.toString(),
        voucherNo: p.purchaseNo || p.voucherNo || `FXP-${p._id.toString().slice(-6)}`,
        partyName: p.supplierName || p.partyName || 'Counter Customer',
        currency: p.purchasedCurrency || p.currency || 'USD',
        quantity: toDecimalNumber(p.quantity, 0),
        rate: toDecimalNumber(p.purchaseRate || p.rate, 0),
        totalCostBDT: toDecimalNumber(p.totalCostBDT || p.totalSettlementAmount, 0),
        paidAmount: toDecimalNumber(p.paidAmount, 0),
        dueAmount: toDecimalNumber(p.dueAmount, 0),
        paymentAccountName: p.paymentAccountName || 'Counter Cash Drawer',
        status: p.status || 'SETTLED',
        isReversed: Boolean(p.isReversed),
        reversalReason: p.reversalReason || '',
        createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : new Date().toISOString(),
      }));

      return NextResponse.json({ success: true, statusCode: 200, data: formatted });
    }

    // 8. /api/v1/currency/sales
    if (slugPath === 'currency/sales') {
      const currency = url.searchParams.get('currency');
      const query: any = {};
      if (currency && currency !== 'ALL') {
        query.$or = [{ currency }, { soldCurrency: currency }];
      }
      const list = await db.collection('currency_sales').find(query).sort({ createdAt: -1 }).limit(200).toArray();

      const formatted = list.map((s) => ({
        _id: s._id.toString(),
        saleNo: s.saleNo || s.voucherNo || `FXS-${s._id.toString().slice(-6)}`,
        customerName: s.customerName || s.partyName || 'Counter Customer',
        currency: s.soldCurrency || s.currency || 'USD',
        quantity: toDecimalNumber(s.quantity, 0),
        sellingRate: toDecimalNumber(s.sellingRate || s.rate, 0),
        wacRate: toDecimalNumber(s.wacRate, 0),
        totalSaleAmountBDT: toDecimalNumber(s.totalSaleAmountBDT, 0),
        cogsBDT: toDecimalNumber(s.cogsBDT, 0),
        grossProfitBDT: toDecimalNumber(s.grossProfitBDT, 0),
        receivedAmount: toDecimalNumber(s.receivedAmount, 0),
        dueAmount: toDecimalNumber(s.dueAmount, 0),
        receiptAccountName: s.receiptAccountName || 'Counter Cash Drawer',
        status: s.status || 'SETTLED',
        isReversed: Boolean(s.isReversed),
        createdAt: s.createdAt ? new Date(s.createdAt).toISOString() : new Date().toISOString(),
      }));

      return NextResponse.json({ success: true, statusCode: 200, data: formatted });
    }

    // 9. /api/v1/currency/dashboard/metrics
    if (slugPath === 'currency/dashboard/metrics') {
      const pools = await db.collection('currency_cost_pools').find({}).toArray();
      let totalStockValuation = new Decimal('0');
      pools.forEach((p) => {
        totalStockValuation = totalStockValuation.plus(new Decimal(toDecimalString(p.totalCostValuation, '0')));
      });

      const cashAccount = await db.collection('financial_accounts').findOne({ accountType: 'CASH_REGISTER' });
      const cashBalance = cashAccount ? toDecimalString(cashAccount.balanceBDT, '0.00') : '2500000.00';

      const purchasesToday = await db.collection('currency_purchases').countDocuments();
      const salesToday = await db.collection('currency_sales').countDocuments();

      return NextResponse.json({
        success: true,
        statusCode: 200,
        data: {
          totalStockValuationBDT: totalStockValuation.toFixed(2),
          counterCashBalanceBDT: cashBalance,
          purchasesCount: purchasesToday,
          salesCount: salesToday,
        },
      });
    }

    // 10. /api/v1/currency/expenses
    if (slugPath === 'currency/expenses') {
      const list = await db.collection('business_expenses').find({}).sort({ createdAt: -1 }).limit(100).toArray();
      const formatted = list.map((e) => ({
        _id: e._id.toString(),
        expenseNo: e.expenseNo || `EXP-${e._id.toString().slice(-6)}`,
        category: e.category,
        description: e.description,
        amountBDT: toDecimalString(e.amountBDT, '0.00'),
        paidTo: e.paidTo || '',
        date: e.date || new Date().toISOString().split('T')[0],
      }));
      return NextResponse.json({ success: true, statusCode: 200, data: formatted });
    }

    // 11. /api/v1/currency/closing/status
    if (slugPath === 'currency/closing/status') {
      const today = new URL(req.url).searchParams.get('date') || new Date().toISOString().split('T')[0];
      const existing = await db.collection('daily_closings').findOne({ closingDate: today });
      return NextResponse.json({
        success: true,
        statusCode: 200,
        data: {
          isClosed: Boolean(existing),
          closingDate: today,
          details: existing || null,
        },
      });
    }

    // 12. /api/v1/auth/me
    if (slugPath === 'auth/me') {
      return NextResponse.json({
        success: true,
        statusCode: 200,
        data: {
          id: 'admin_user_id',
          name: 'Chief Executive Master Admin',
          email: 'admin@moneyexchange.com',
          role: 'MASTER_ADMIN',
          allowedBranches: ['Kuala Lumpur HQ (MYR)', 'Dhaka Central Branch (BDT)', 'Chittagong Port Branch (BDT)'],
        },
      });
    }

    return NextResponse.json({ success: false, statusCode: 404, message: `Route GET /api/v1/${slugPath} not found` }, { status: 404 });
  } catch (err: any) {
    console.error('API GET error:', err);
    return NextResponse.json({ success: false, statusCode: 500, message: err.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { slug: string[] } }) {
  try {
    await connectDB();
    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json({ success: false, statusCode: 500, message: 'Database not connected' }, { status: 500 });
    }

    const slugPath = (params.slug || []).join('/');
    const body = await req.json().catch(() => ({}));

    // 1. POST /api/v1/auth/login
    if (slugPath === 'auth/login') {
      const email = (body.email || '').trim().toLowerCase();
      const password = body.password || '';

      const isDemoAdmin = email === 'admin@moneyexchange.com' && password === 'Admin@123456';
      const isDemoAccountant = email === 'accountant@moneyexchange.com' && password === 'Accountant@123456';
      const isDemoAgent = email === 'agent.kul@moneyexchange.com' && password === 'Agent@123456';
      const isDemoCompliance = email === 'compliance@moneyexchange.com' && password === 'Compliance@123456';

      let user: any = await db.collection('users').findOne({ email });

      if (!user && (isDemoAdmin || isDemoAccountant || isDemoAgent || isDemoCompliance)) {
        const role = isDemoAdmin ? 'MASTER_ADMIN' : isDemoAccountant ? 'ACCOUNTANT' : isDemoAgent ? 'AGENT' : 'COMPLIANCE';
        const name = isDemoAdmin
          ? 'Chief Executive Master Admin'
          : isDemoAccountant
          ? 'Senior Financial Accountant'
          : isDemoAgent
          ? 'Kuala Lumpur Operational Agent'
          : 'Institutional Compliance Officer';
        user = {
          _id: new mongoose.Types.ObjectId(),
          email,
          name,
          role,
          allowedBranches: ['Kuala Lumpur HQ (MYR)', 'Dhaka Central Branch (BDT)', 'Chittagong Port Branch (BDT)'],
        };
      }

      if (!user) {
        return NextResponse.json(
          { success: false, statusCode: 401, message: 'Invalid institutional email or password' },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        statusCode: 200,
        data: {
          accessToken: 'jwt_secure_institutional_token_2026',
          refreshToken: 'jwt_refresh_secure_token_2026',
          user: {
            id: user._id.toString(),
            name: user.name || 'Enterprise Admin',
            email: user.email,
            role: user.role || 'MASTER_ADMIN',
            allowedBranches: user.allowedBranches || ['Kuala Lumpur HQ (MYR)', 'Dhaka Central Branch (BDT)'],
          },
        },
      });
    }

    // 2. POST /api/v1/currency/purchase (THE MASTER PURCHASING LOGIC!)
    if (slugPath === 'currency/purchase') {
      const currency = (body.purchasedCurrency || body.currency || 'USD').toUpperCase();
      const quantityStr = String(body.quantity || '0');
      const rateStr = String(body.purchaseRate || body.rate || '0');
      const paidAmountStr = String(body.paidAmount !== undefined ? body.paidAmount : '0');
      const notes = body.notes || '';
      const partyId = body.partyId;
      const supplierName = body.supplierName || 'Counter Customer';
      const paymentAccountId = body.paymentAccountId;

      const qty = new Decimal(quantityStr);
      const rate = new Decimal(rateStr);
      if (qty.lte(0) || rate.lte(0)) {
        return NextResponse.json(
          { success: false, statusCode: 400, message: 'Quantity and Purchase Rate must be greater than zero.' },
          { status: 400 }
        );
      }

      const totalCostBDT = qty.times(rate);
      let paidBDT = new Decimal(paidAmountStr || '0');
      if (paidBDT.lt(0)) paidBDT = new Decimal('0');
      const dueBDT = totalCostBDT.minus(paidBDT);
      const status = dueBDT.lte(0) ? 'SETTLED' : paidBDT.gt(0) ? 'PARTIAL' : 'UNPAID';

      // 1. Update or create Currency Cost Pool (WAC Calculation)
      const costPoolsCollection = db.collection('currency_cost_pools');
      const existingPool = await costPoolsCollection.findOne({
        legalEntityId: defaultLegalEntityId,
        branchId: defaultBranchId,
        currencyCode: currency,
      });

      const currentPoolQty = new Decimal(toDecimalString(existingPool?.totalQuantity, '0'));
      const currentPoolVal = new Decimal(toDecimalString(existingPool?.totalCostValuation, '0'));

      const newPoolQty = currentPoolQty.plus(qty);
      const newPoolVal = currentPoolVal.plus(totalCostBDT);
      const newWAC = newPoolQty.gt(0) ? newPoolVal.dividedBy(newPoolQty) : rate;

      await costPoolsCollection.updateOne(
        {
          legalEntityId: defaultLegalEntityId,
          branchId: defaultBranchId,
          currencyCode: currency,
        },
        {
          $set: {
            totalQuantity: mongoose.Types.Decimal128.fromString(newPoolQty.toFixed(4)),
            totalCostValuation: mongoose.Types.Decimal128.fromString(newPoolVal.toFixed(4)),
            weightedAverageCostRate: mongoose.Types.Decimal128.fromString(newWAC.toFixed(8)),
            currency,
            updatedAt: new Date(),
          },
        },
        { upsert: true }
      );

      // 2. Generate unique Purchase Voucher
      const purchasesCollection = db.collection('currency_purchases');
      const totalCount = await purchasesCollection.countDocuments();
      const monthPrefix = new Date().toISOString().slice(0, 7).replace('-', '');
      const purchaseNo = `FXP-${monthPrefix}-${String(totalCount + 1).padStart(4, '0')}`;

      // 3. Resolve party and payment account
      let resolvedPartyId = partyId ? new mongoose.Types.ObjectId(partyId) : null;
      if (!resolvedPartyId && supplierName) {
        const matchedParty = await db.collection('parties').findOne({
          name: { $regex: new RegExp(`^${supplierName.trim()}$`, 'i') },
        });
        if (matchedParty) {
          resolvedPartyId = matchedParty._id;
        }
      }

      const accountsCollection = db.collection('financial_accounts');
      let paymentAccount: any = null;
      if (paymentAccountId) {
        try {
          paymentAccount = await accountsCollection.findOne({ _id: new mongoose.Types.ObjectId(paymentAccountId) });
        } catch {
          paymentAccount = await accountsCollection.findOne({ accountNo: paymentAccountId });
        }
      }
      if (!paymentAccount) {
        paymentAccount = await accountsCollection.findOne({ accountType: 'CASH_REGISTER' });
      }

      // 4. Insert Purchase record
      const purchaseDoc: any = {
        purchaseNo,
        voucherNo: purchaseNo,
        organizationId: defaultOrgId,
        legalEntityId: defaultLegalEntityId,
        branchId: defaultBranchId,
        partyId: resolvedPartyId,
        partyName: supplierName,
        supplierName,
        currency,
        purchasedCurrency: currency,
        quantity: mongoose.Types.Decimal128.fromString(qty.toFixed(4)),
        rate: mongoose.Types.Decimal128.fromString(rate.toFixed(4)),
        purchaseRate: mongoose.Types.Decimal128.fromString(rate.toFixed(4)),
        settlementCurrency: 'BDT',
        totalCostBDT: mongoose.Types.Decimal128.fromString(totalCostBDT.toFixed(2)),
        totalSettlementAmount: mongoose.Types.Decimal128.fromString(totalCostBDT.toFixed(2)),
        paidAmount: mongoose.Types.Decimal128.fromString(paidBDT.toFixed(2)),
        dueAmount: mongoose.Types.Decimal128.fromString(dueBDT.toFixed(2)),
        paymentAccountId: paymentAccount ? paymentAccount._id : null,
        paymentAccountName: paymentAccount ? paymentAccount.accountName : 'Counter Cash Drawer',
        status,
        notes,
        isReversed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const insertRes = await purchasesCollection.insertOne(purchaseDoc);

      // 5. Deduct Cash/Bank Account balance
      if (paymentAccount && paidBDT.gt(0)) {
        await accountsCollection.updateOne(
          { _id: paymentAccount._id },
          { $inc: { balanceBDT: -paidBDT.toNumber() } }
        );

        await db.collection('financial_transactions').insertOne({
          transactionNo: `FTX-${purchaseNo}`,
          accountId: paymentAccount._id,
          accountName: paymentAccount.accountName,
          type: 'PURCHASE_PAYMENT',
          amountBDT: mongoose.Types.Decimal128.fromString(paidBDT.toFixed(2)),
          reference: purchaseNo,
          notes: `Payment for FX Purchase ${purchaseNo} (${quantityStr} ${currency})`,
          createdAt: new Date(),
        });
      }

      // 6. Update Party Due Balance if applicable
      if (resolvedPartyId && dueBDT.gt(0)) {
        try {
          await db.collection('parties').updateOne(
            { _id: resolvedPartyId },
            { $inc: { currentBalanceBDT: dueBDT.toNumber() } }
          );
        } catch {
          // ignore party update error
        }
      }

      // 7. Record Currency Stock Movement
      await db.collection('currency_stock_movements').insertOne({
        movementNo: `MOV-${purchaseNo}`,
        movementType: 'PURCHASE',
        currencyCode: currency,
        openingQuantity: mongoose.Types.Decimal128.fromString(currentPoolQty.toFixed(4)),
        inflowQuantity: mongoose.Types.Decimal128.fromString(qty.toFixed(4)),
        outflowQuantity: mongoose.Types.Decimal128.fromString('0.00'),
        closingQuantity: mongoose.Types.Decimal128.fromString(newPoolQty.toFixed(4)),
        unitCostRate: mongoose.Types.Decimal128.fromString(newWAC.toFixed(8)),
        bdtValuation: mongoose.Types.Decimal128.fromString(totalCostBDT.toFixed(2)),
        reference: purchaseNo,
        createdAt: new Date(),
      });

      return NextResponse.json({
        success: true,
        statusCode: 201,
        message: 'বৈদেশিক মুদ্রা ক্রয় সফলভাবে সম্পন্ন হয়েছে (Currency purchase recorded successfully)',
        data: {
          _id: insertRes.insertedId.toString(),
          purchaseNo,
          voucherNo: purchaseNo,
          supplierName,
          purchasedCurrency: currency,
          currency,
          quantity: qty.toFixed(2),
          purchaseRate: rate.toFixed(4),
          totalCostBDT: totalCostBDT.toFixed(2),
          paidAmount: paidBDT.toFixed(2),
          dueAmount: dueBDT.toFixed(2),
          status,
          newWAC: newWAC.toFixed(4),
        },
      });
    }

    // 3. POST /api/v1/currency/sale (FX SELL)
    if (slugPath === 'currency/sale') {
      const currency = (body.soldCurrency || body.currency || 'USD').toUpperCase();
      const quantityStr = String(body.quantity || '0');
      const rateStr = String(body.sellingRate || body.rate || '0');
      const receivedAmountStr = String(body.receivedAmount !== undefined ? body.receivedAmount : '0');
      const notes = body.notes || '';
      const partyId = body.partyId;
      const customerName = body.customerName || 'Counter Customer';
      const receiptAccountId = body.receiptAccountId;

      const qty = new Decimal(quantityStr);
      const sellRate = new Decimal(rateStr);
      if (qty.lte(0) || sellRate.lte(0)) {
        return NextResponse.json(
          { success: false, statusCode: 400, message: 'Quantity and Selling Rate must be greater than zero.' },
          { status: 400 }
        );
      }

      // Check stock
      const costPoolsCollection = db.collection('currency_cost_pools');
      const pool = await costPoolsCollection.findOne({
        legalEntityId: defaultLegalEntityId,
        branchId: defaultBranchId,
        currencyCode: currency,
      });

      const currentPoolQty = new Decimal(toDecimalString(pool?.totalQuantity, '0'));
      const currentWAC = new Decimal(toDecimalString(pool?.weightedAverageCostRate, rateStr));

      if (currentPoolQty.lt(qty)) {
        return NextResponse.json(
          {
            success: false,
            statusCode: 400,
            message: `অপর্যাপ্ত স্টক: ${currency} বর্তমান স্টক ${currentPoolQty.toFixed(2)}, বিক্রয় পরিমাণ ${qty.toFixed(2)} (Insufficient Stock)`,
          },
          { status: 400 }
        );
      }

      const totalSaleAmountBDT = qty.times(sellRate);
      const cogsBDT = qty.times(currentWAC);
      const grossProfitBDT = totalSaleAmountBDT.minus(cogsBDT);

      let receivedBDT = new Decimal(receivedAmountStr || '0');
      if (receivedBDT.lt(0)) receivedBDT = new Decimal('0');
      const dueBDT = totalSaleAmountBDT.minus(receivedBDT);
      const status = dueBDT.lte(0) ? 'SETTLED' : receivedBDT.gt(0) ? 'PARTIAL' : 'UNPAID';

      // Deduct stock
      const newPoolQty = currentPoolQty.minus(qty);
      const newPoolVal = newPoolQty.times(currentWAC);

      await costPoolsCollection.updateOne(
        {
          legalEntityId: defaultLegalEntityId,
          branchId: defaultBranchId,
          currencyCode: currency,
        },
        {
          $set: {
            totalQuantity: mongoose.Types.Decimal128.fromString(newPoolQty.toFixed(4)),
            totalCostValuation: mongoose.Types.Decimal128.fromString(newPoolVal.toFixed(4)),
            updatedAt: new Date(),
          },
        }
      );

      // Generate Sale Voucher
      const salesCollection = db.collection('currency_sales');
      const totalCount = await salesCollection.countDocuments();
      const monthPrefix = new Date().toISOString().slice(0, 7).replace('-', '');
      const saleNo = `FXS-${monthPrefix}-${String(totalCount + 1).padStart(4, '0')}`;

      // Resolve receipt account
      const accountsCollection = db.collection('financial_accounts');
      let receiptAccount: any = null;
      if (receiptAccountId) {
        try {
          receiptAccount = await accountsCollection.findOne({ _id: new mongoose.Types.ObjectId(receiptAccountId) });
        } catch {
          receiptAccount = await accountsCollection.findOne({ accountNo: receiptAccountId });
        }
      }
      if (!receiptAccount) {
        receiptAccount = await accountsCollection.findOne({ accountType: 'CASH_REGISTER' });
      }

      const saleDoc: any = {
        saleNo,
        voucherNo: saleNo,
        organizationId: defaultOrgId,
        legalEntityId: defaultLegalEntityId,
        branchId: defaultBranchId,
        partyId: partyId ? new mongoose.Types.ObjectId(partyId) : null,
        customerName,
        currency,
        soldCurrency: currency,
        quantity: mongoose.Types.Decimal128.fromString(qty.toFixed(4)),
        rate: mongoose.Types.Decimal128.fromString(sellRate.toFixed(4)),
        sellingRate: mongoose.Types.Decimal128.fromString(sellRate.toFixed(4)),
        wacRate: mongoose.Types.Decimal128.fromString(currentWAC.toFixed(8)),
        totalSaleAmountBDT: mongoose.Types.Decimal128.fromString(totalSaleAmountBDT.toFixed(2)),
        cogsBDT: mongoose.Types.Decimal128.fromString(cogsBDT.toFixed(2)),
        grossProfitBDT: mongoose.Types.Decimal128.fromString(grossProfitBDT.toFixed(2)),
        receivedAmount: mongoose.Types.Decimal128.fromString(receivedBDT.toFixed(2)),
        dueAmount: mongoose.Types.Decimal128.fromString(dueBDT.toFixed(2)),
        receiptAccountId: receiptAccount ? receiptAccount._id : null,
        receiptAccountName: receiptAccount ? receiptAccount.accountName : 'Counter Cash Drawer',
        status,
        notes,
        isReversed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const insertRes = await salesCollection.insertOne(saleDoc);

      // Increment cash balance
      if (receiptAccount && receivedBDT.gt(0)) {
        await accountsCollection.updateOne(
          { _id: receiptAccount._id },
          { $inc: { balanceBDT: receivedBDT.toNumber() } }
        );

        await db.collection('financial_transactions').insertOne({
          transactionNo: `FTX-${saleNo}`,
          accountId: receiptAccount._id,
          accountName: receiptAccount.accountName,
          type: 'SALE_RECEIPT',
          amountBDT: mongoose.Types.Decimal128.fromString(receivedBDT.toFixed(2)),
          reference: saleNo,
          notes: `Receipt for FX Sale ${saleNo} (${quantityStr} ${currency})`,
          createdAt: new Date(),
        });
      }

      // Record Currency Stock Movement
      await db.collection('currency_stock_movements').insertOne({
        movementNo: `MOV-${saleNo}`,
        movementType: 'SALE',
        currencyCode: currency,
        openingQuantity: mongoose.Types.Decimal128.fromString(currentPoolQty.toFixed(4)),
        inflowQuantity: mongoose.Types.Decimal128.fromString('0.00'),
        outflowQuantity: mongoose.Types.Decimal128.fromString(qty.toFixed(4)),
        closingQuantity: mongoose.Types.Decimal128.fromString(newPoolQty.toFixed(4)),
        unitCostRate: mongoose.Types.Decimal128.fromString(currentWAC.toFixed(8)),
        bdtValuation: mongoose.Types.Decimal128.fromString(cogsBDT.toFixed(2)),
        reference: saleNo,
        createdAt: new Date(),
      });

      return NextResponse.json({
        success: true,
        statusCode: 201,
        message: 'বৈদেশিক মুদ্রা বিক্রয় সফলভাবে সম্পন্ন হয়েছে (Currency sale recorded successfully)',
        data: {
          _id: insertRes.insertedId.toString(),
          saleNo,
          customerName,
          soldCurrency: currency,
          quantity: qty.toFixed(2),
          sellingRate: sellRate.toFixed(4),
          totalSaleAmountBDT: totalSaleAmountBDT.toFixed(2),
          cogsBDT: cogsBDT.toFixed(2),
          grossProfitBDT: grossProfitBDT.toFixed(2),
          receivedAmount: receivedBDT.toFixed(2),
          dueAmount: dueBDT.toFixed(2),
          status,
        },
      });
    }

    // 4. POST /api/v1/currency/rates
    if (slugPath === 'currency/rates') {
      const { pairSymbol, buyRate, sellRate } = body;
      const bRate = new Decimal(buyRate || '0');
      const sRate = new Decimal(sellRate || '0');
      const spread = sRate.minus(bRate);
      const mid = bRate.plus(sRate).dividedBy(2);

      await db.collection('exchange_rates').updateOne(
        { pairSymbol },
        {
          $set: {
            pairSymbol,
            baseCurrency: pairSymbol.split('/')[0],
            quoteCurrency: pairSymbol.split('/')[1] || 'BDT',
            buyRate: mongoose.Types.Decimal128.fromString(bRate.toFixed(4)),
            sellRate: mongoose.Types.Decimal128.fromString(sRate.toFixed(4)),
            midRate: mongoose.Types.Decimal128.fromString(mid.toFixed(4)),
            spread: mongoose.Types.Decimal128.fromString(spread.toFixed(4)),
            updatedAt: new Date(),
          },
          $inc: { version: 1 },
        },
        { upsert: true }
      );

      return NextResponse.json({
        success: true,
        statusCode: 200,
        message: 'Exchange rate updated successfully',
        data: { pairSymbol, buyRate: bRate.toFixed(4), sellRate: sRate.toFixed(4) },
      });
    }

    // 5. POST /api/v1/currency/parties
    if (slugPath === 'currency/parties') {
      const count = await db.collection('parties').countDocuments();
      const partyNo = `PARTY-${String(count + 1).padStart(4, '0')}`;
      const newParty = {
        partyNo,
        name: body.name || 'New Party',
        businessName: body.businessName || '',
        phone: body.phone || '',
        partyType: body.partyType || 'CUSTOMER',
        openingBalanceBDT: 0,
        currentBalanceBDT: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const res = await db.collection('parties').insertOne(newParty);
      return NextResponse.json({
        success: true,
        statusCode: 201,
        data: { _id: res.insertedId.toString(), ...newParty },
      });
    }

    // 6. POST /api/v1/currency/purchase/:id/reverse
    if (slugPath.startsWith('currency/purchase/') && slugPath.endsWith('/reverse')) {
      const id = slugPath.split('/')[2];
      const reason = body.reason || 'Operator requested reversal';
      await db.collection('currency_purchases').updateOne(
        { _id: new mongoose.Types.ObjectId(id) },
        { $set: { isReversed: true, reversalReason: reason, status: 'REVERSED', updatedAt: new Date() } }
      );
      return NextResponse.json({ success: true, statusCode: 200, message: 'Purchase reversed successfully' });
    }

    // 7. POST /api/v1/currency/accounts/transfer
    if (slugPath === 'currency/accounts/transfer') {
      const { sourceAccountId, destinationAccountId, amountBDT, notes } = body;
      const amt = new Decimal(amountBDT || '0');
      if (amt.lte(0)) {
        return NextResponse.json({ success: false, statusCode: 400, message: 'Transfer amount must be greater than zero' }, { status: 400 });
      }

      await db.collection('financial_accounts').updateOne(
        { _id: new mongoose.Types.ObjectId(sourceAccountId) },
        { $inc: { balanceBDT: -amt.toNumber() } }
      );
      await db.collection('financial_accounts').updateOne(
        { _id: new mongoose.Types.ObjectId(destinationAccountId) },
        { $inc: { balanceBDT: amt.toNumber() } }
      );

      return NextResponse.json({ success: true, statusCode: 200, message: 'Fund transfer executed successfully' });
    }

    // 8. POST /api/v1/currency/expenses
    if (slugPath === 'currency/expenses') {
      const { category, description, amountBDT, paidTo, paymentAccountId } = body;
      const amt = new Decimal(amountBDT || '0');
      const count = await db.collection('business_expenses').countDocuments();
      const expenseNo = `EXP-${String(count + 1).padStart(4, '0')}`;

      await db.collection('business_expenses').insertOne({
        expenseNo,
        category: category || 'OPERATIONAL',
        description: description || 'General Expense',
        amountBDT: mongoose.Types.Decimal128.fromString(amt.toFixed(2)),
        paidTo: paidTo || '',
        paymentAccountId: paymentAccountId ? new mongoose.Types.ObjectId(paymentAccountId) : null,
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date(),
      });

      if (paymentAccountId) {
        await db.collection('financial_accounts').updateOne(
          { _id: new mongoose.Types.ObjectId(paymentAccountId) },
          { $inc: { balanceBDT: -amt.toNumber() } }
        );
      }

      return NextResponse.json({ success: true, statusCode: 201, message: 'Business expense recorded' });
    }

    // 9. POST /api/v1/currency/closing
    if (slugPath === 'currency/closing') {
      const { closingDate, actualCashCounted, differenceReasons } = body;
      const date = closingDate || new Date().toISOString().split('T')[0];

      await db.collection('daily_closings').updateOne(
        { closingDate: date },
        {
          $set: {
            closingDate: date,
            actualCashCounted: actualCashCounted || '0.00',
            differenceReasons: differenceReasons || '',
            closedAt: new Date(),
          },
        },
        { upsert: true }
      );

      return NextResponse.json({ success: true, statusCode: 200, message: `Business closed for date ${date}` });
    }

    return NextResponse.json({ success: false, statusCode: 404, message: `Route POST /api/v1/${slugPath} not found` }, { status: 404 });
  } catch (err: any) {
    console.error('API POST error:', err);
    return NextResponse.json({ success: false, statusCode: 500, message: err.message || 'Internal server error' }, { status: 500 });
  }
}
