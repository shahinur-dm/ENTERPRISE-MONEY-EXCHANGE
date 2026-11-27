const mongoose = require('mongoose');
const Decimal = require('decimal.js');

const MONGO_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  'mongodb+srv://efootballmadrid25_db_user:ljvpbVMGVJTQPVcH@dawatit.5hxbo9c.mongodb.net/hundy?retryWrites=true&w=majority&appName=dawatit';

async function seedDemoData() {
  console.log('Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 15000 });
  console.log('Connected to MongoDB Atlas: hundy');

  const db = mongoose.connection.db;

  const defaultOrgId = new mongoose.Types.ObjectId('6b05b7f487fc2e8cf74f3f12');
  const defaultLegalEntityId = new mongoose.Types.ObjectId('6b05b7f487fc2e8cf74f3f29');
  const defaultBranchId = new mongoose.Types.ObjectId('6b05b7f487fc2e8cf74f3f30');

  // 1. DEMO CUSTOMERS & SUPPLIERS (PARTIES)
  console.log('Seeding / Verifying Demo Parties (Customers & Suppliers)...');
  const partiesCollection = db.collection('parties');
  const customersCollection = db.collection('customers');
  const suppliersCollection = db.collection('suppliers');

  const demoParties = [
    {
      partyNo: 'CUST-DEMO-001',
      name: 'Sazzad Hossain',
      businessName: 'Sazzad Enterprise',
      phone: '+880 1711-234567',
      partyType: 'CUSTOMER',
      openingBalanceBDT: 0,
      currentBalanceBDT: 0,
      advanceBalanceBDT: 0,
      totalPurchasedBDT: 0,
      totalSoldBDT: 0,
      isDemo: true,
    },
    {
      partyNo: 'CUST-DEMO-002',
      name: 'Rahim Ahmed',
      businessName: 'Ahmed Traders',
      phone: '+880 1819-345678',
      partyType: 'CUSTOMER',
      openingBalanceBDT: 0,
      currentBalanceBDT: 0,
      advanceBalanceBDT: 0,
      totalPurchasedBDT: 0,
      totalSoldBDT: 0,
      isDemo: true,
    },
    {
      partyNo: 'DEALER-DEMO-001',
      name: 'Karim Traders',
      businessName: 'Karim Traders & Exchange Ltd',
      phone: '+880 1912-456789',
      partyType: 'DEALER',
      openingBalanceBDT: 0,
      currentBalanceBDT: 0,
      advanceBalanceBDT: 0,
      totalPurchasedBDT: 0,
      totalSoldBDT: 0,
      isDemo: true,
    },
    {
      partyNo: 'DEALER-DEMO-002',
      name: 'Ahmed International',
      businessName: 'Ahmed International FX Desk',
      phone: '+880 1713-567890',
      partyType: 'DEALER',
      openingBalanceBDT: 0,
      currentBalanceBDT: 0,
      advanceBalanceBDT: 0,
      totalPurchasedBDT: 0,
      totalSoldBDT: 0,
      isDemo: true,
    },
    {
      partyNo: 'CUST-DEMO-003',
      name: 'Noor Exchange Customer',
      businessName: 'Noor Counter Clients',
      phone: '+880 1614-678901',
      partyType: 'CUSTOMER',
      openingBalanceBDT: 0,
      currentBalanceBDT: 0,
      advanceBalanceBDT: 0,
      totalPurchasedBDT: 0,
      totalSoldBDT: 0,
      isDemo: true,
    },
    {
      partyNo: 'CUST-DEMO-004',
      name: 'Business Customer 01',
      businessName: 'Prime Business Solution Ltd',
      phone: '+880 1515-789012',
      partyType: 'CUSTOMER',
      openingBalanceBDT: 0,
      currentBalanceBDT: 0,
      advanceBalanceBDT: 0,
      totalPurchasedBDT: 0,
      totalSoldBDT: 0,
      isDemo: true,
    },
    // Suppliers
    {
      partyNo: 'SUPP-DEMO-001',
      name: 'Global Currency Supplier',
      businessName: 'Global Currency Wholesale Ltd',
      phone: '+880 1716-890123',
      partyType: 'SUPPLIER',
      openingBalanceBDT: 0,
      currentBalanceBDT: 0,
      advanceBalanceBDT: 0,
      totalPurchasedBDT: 0,
      totalSoldBDT: 0,
      isDemo: true,
    },
    {
      partyNo: 'SUPP-DEMO-002',
      name: 'Dhaka Forex Supplier',
      businessName: 'Dhaka Forex Consortium',
      phone: '+880 1817-901234',
      partyType: 'SUPPLIER',
      openingBalanceBDT: 0,
      currentBalanceBDT: 0,
      advanceBalanceBDT: 0,
      totalPurchasedBDT: 0,
      totalSoldBDT: 0,
      isDemo: true,
    },
    {
      partyNo: 'SUPP-DEMO-003',
      name: 'International Exchange Partner',
      businessName: 'Intl Exchange Interbank Desk',
      phone: '+880 1918-012345',
      partyType: 'SUPPLIER',
      openingBalanceBDT: 0,
      currentBalanceBDT: 0,
      advanceBalanceBDT: 0,
      totalPurchasedBDT: 0,
      totalSoldBDT: 0,
      isDemo: true,
    },
    {
      partyNo: 'SUPP-DEMO-004',
      name: 'Supplier Demo 01',
      businessName: 'Institutional Treasury Desk 01',
      phone: '+880 1719-123456',
      partyType: 'SUPPLIER',
      openingBalanceBDT: 0,
      currentBalanceBDT: 0,
      advanceBalanceBDT: 0,
      totalPurchasedBDT: 0,
      totalSoldBDT: 0,
      isDemo: true,
    },
  ];

  const partyMap = {};
  for (const p of demoParties) {
    let existing = await partiesCollection.findOne({ name: p.name });
    if (!existing) {
      const res = await partiesCollection.insertOne({
        ...p,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      existing = { _id: res.insertedId, ...p };
      console.log(`  + Created Party: ${p.name} (${p.partyType})`);
    } else {
      console.log(`  ✓ Party Exists: ${p.name}`);
    }
    partyMap[p.name] = existing;

    // Mirror to legacy collections
    if (p.partyType === 'CUSTOMER' || p.partyType === 'DEALER') {
      const existingCust = await customersCollection.findOne({ name: p.name });
      if (!existingCust) {
        await customersCollection.insertOne({
          name: p.name,
          phone: p.phone,
          type: p.partyType === 'DEALER' ? 'Corporate' : 'Individual',
          status: 'active',
          id: p.partyNo,
          isDemo: true,
          organizationId: defaultOrgId,
          legalEntityId: defaultLegalEntityId,
          branchId: defaultBranchId,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }
    if (p.partyType === 'SUPPLIER') {
      const existingSupp = await suppliersCollection.findOne({ name: p.name });
      if (!existingSupp) {
        await suppliersCollection.insertOne({
          name: p.name,
          phone: p.phone,
          code: p.partyNo,
          status: 'active',
          isDemo: true,
          organizationId: defaultOrgId,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }
  }

  // 2. FINANCIAL ACCOUNTS (Counter Cash, Vault, Commercial Banks)
  console.log('Seeding / Verifying Financial Accounts...');
  const accountsCollection = db.collection('financial_accounts');
  const demoAccounts = [
    {
      accountNo: 'ACC-BDT-001',
      accountName: 'Counter Cash Drawer (BDT)',
      accountType: 'CASH_REGISTER',
      currency: 'BDT',
      balanceBDT: 2500000.0,
      isActive: true,
      isDemo: true,
    },
    {
      accountNo: 'ACC-BDT-002',
      accountName: 'Central Main Vault (BDT)',
      accountType: 'VAULT',
      currency: 'BDT',
      balanceBDT: 10000000.0,
      isActive: true,
      isDemo: true,
    },
    {
      accountNo: 'ACC-BDT-003',
      accountName: 'Dhaka Bank Corporate Account',
      accountType: 'BANK_ACCOUNT',
      currency: 'BDT',
      balanceBDT: 5000000.0,
      bankName: 'Dhaka Bank Ltd',
      bankAccountNumber: '205-100-8849',
      branchName: 'Motijheel Principal Branch',
      isActive: true,
      isDemo: true,
    },
    {
      accountNo: 'ACC-BDT-004',
      accountName: 'City Bank Clearing Account',
      accountType: 'BANK_ACCOUNT',
      currency: 'BDT',
      balanceBDT: 7500000.0,
      bankName: 'City Bank PLC',
      bankAccountNumber: '310-200-9912',
      branchName: 'Gulshan Corporate Branch',
      isActive: true,
      isDemo: true,
    },
  ];

  const accountMap = {};
  for (const acc of demoAccounts) {
    let existing = await accountsCollection.findOne({ accountNo: acc.accountNo });
    if (!existing) {
      const res = await accountsCollection.insertOne({
        ...acc,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      existing = { _id: res.insertedId, ...acc };
      console.log(`  + Created Account: ${acc.accountName}`);
    } else {
      console.log(`  ✓ Account Exists: ${acc.accountName}`);
    }
    accountMap[acc.accountNo] = existing;
  }

  // 3. CURRENCIES & RATES & COST POOLS
  console.log('Seeding / Verifying Currencies & Cost Pools...');
  const currenciesCollection = db.collection('currencies');
  const costPoolsCollection = db.collection('currency_cost_pools');
  const demoCurrencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', rate: 100 },
    { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾', rate: 25 },
    { code: 'SAR', name: 'Saudi Riyal', symbol: 'SR', flag: '🇸🇦', rate: 27 },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬', rate: 90 },
    { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', rate: 125 },
  ];

  for (const c of demoCurrencies) {
    const existingCurr = await currenciesCollection.findOne({ code: c.code });
    if (!existingCurr) {
      await currenciesCollection.insertOne({
        code: c.code,
        name: c.name,
        symbol: c.symbol,
        flag: c.flag,
        isActive: true,
        isBase: c.code === 'MYR',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`  + Created Currency: ${c.code}`);
    }

    // Cost Pool matching unique index { legalEntityId: 1, branchId: 1, currencyCode: 1 }
    const existingPool = await costPoolsCollection.findOne({
      legalEntityId: defaultLegalEntityId,
      branchId: defaultBranchId,
      currencyCode: c.code,
    });
    if (!existingPool) {
      await costPoolsCollection.insertOne({
        legalEntityId: defaultLegalEntityId,
        branchId: defaultBranchId,
        currencyCode: c.code,
        currency: c.code,
        totalQuantity: mongoose.Types.Decimal128.fromString('0.00'),
        weightedAverageCostRate: mongoose.Types.Decimal128.fromString('0.0000'),
        totalCostValuation: mongoose.Types.Decimal128.fromString('0.00'),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`  + Created Cost Pool: ${c.code}`);
    }
  }

  // 4. DEMO PURCHASE TRANSACTIONS (EXACT 5 SCENARIOS)
  console.log('Seeding / Verifying Demo Purchase Transactions...');
  const purchasesCollection = db.collection('currency_purchases');
  const movementsCollection = db.collection('currency_stock_movements');
  const transactionsCollection = db.collection('financial_transactions');

  const defaultAccount = accountMap['ACC-BDT-001'];

  const demoPurchases = [
    {
      purchaseNo: 'FXP-202611-0001',
      partyName: 'Sazzad Hossain',
      currency: 'USD',
      quantity: 5000,
      rate: 100,
      totalCostBDT: 500000,
      paidAmount: 500000,
      dueAmount: 0,
      status: 'SETTLED',
      notes: '5,000 USD purchased from customer.',
    },
    {
      purchaseNo: 'FXP-202611-0002',
      partyName: 'Rahim Ahmed',
      currency: 'SAR',
      quantity: 10000,
      rate: 27,
      totalCostBDT: 270000,
      paidAmount: 200000,
      dueAmount: 70000,
      status: 'PARTIAL',
      notes: 'Partial payment for Saudi Riyal purchase.',
    },
    {
      purchaseNo: 'FXP-202611-0003',
      partyName: 'Karim Traders',
      currency: 'MYR',
      quantity: 3000,
      rate: 25,
      totalCostBDT: 75000,
      paidAmount: 75000,
      dueAmount: 0,
      status: 'SETTLED',
      notes: 'Malaysian Ringgit purchase.',
    },
    {
      purchaseNo: 'FXP-202611-0004',
      partyName: 'Ahmed International',
      currency: 'SGD',
      quantity: 2000,
      rate: 90,
      totalCostBDT: 180000,
      paidAmount: 150000,
      dueAmount: 30000,
      status: 'PARTIAL',
      notes: 'Singapore Dollar purchase with partial payment.',
    },
    {
      purchaseNo: 'FXP-202611-0005',
      partyName: 'Noor Exchange Customer',
      currency: 'EUR',
      quantity: 1000,
      rate: 125,
      totalCostBDT: 125000,
      paidAmount: 125000,
      dueAmount: 0,
      status: 'SETTLED',
      notes: 'Euro purchase.',
    },
  ];

  for (const dp of demoPurchases) {
    const existing = await purchasesCollection.findOne({ purchaseNo: dp.purchaseNo });
    if (existing) {
      console.log(`  ✓ Demo Purchase ${dp.purchaseNo} already exists.`);
      continue;
    }

    const party = partyMap[dp.partyName];
    const partyId = party ? party._id : null;

    // 1. Calculate WAC update
    const pool = await costPoolsCollection.findOne({
      legalEntityId: defaultLegalEntityId,
      branchId: defaultBranchId,
      currencyCode: dp.currency,
    });

    const currentQty = new Decimal(pool?.totalQuantity ? pool.totalQuantity.toString() : '0');
    const currentVal = new Decimal(pool?.totalCostValuation ? pool.totalCostValuation.toString() : '0');
    const addQty = new Decimal(dp.quantity);
    const addVal = new Decimal(dp.totalCostBDT);

    const newQty = currentQty.plus(addQty);
    const newVal = currentVal.plus(addVal);
    const newWAC = newQty.greaterThan(0) ? newVal.dividedBy(newQty) : new Decimal(dp.rate);

    await costPoolsCollection.updateOne(
      {
        legalEntityId: defaultLegalEntityId,
        branchId: defaultBranchId,
        currencyCode: dp.currency,
      },
      {
        $set: {
          totalQuantity: mongoose.Types.Decimal128.fromString(newQty.toFixed(4)),
          totalCostValuation: mongoose.Types.Decimal128.fromString(newVal.toFixed(4)),
          weightedAverageCostRate: mongoose.Types.Decimal128.fromString(newWAC.toFixed(8)),
          currency: dp.currency,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    // 2. Insert Purchase
    const purchaseDoc = {
      purchaseNo: dp.purchaseNo,
      voucherNo: dp.purchaseNo,
      organizationId: defaultOrgId,
      legalEntityId: defaultLegalEntityId,
      branchId: defaultBranchId,
      partyId: partyId,
      partyName: dp.partyName,
      supplierName: dp.partyName,
      currency: dp.currency,
      purchasedCurrency: dp.currency,
      quantity: mongoose.Types.Decimal128.fromString(dp.quantity.toString()),
      rate: mongoose.Types.Decimal128.fromString(dp.rate.toString()),
      purchaseRate: mongoose.Types.Decimal128.fromString(dp.rate.toString()),
      settlementCurrency: 'BDT',
      totalCostBDT: mongoose.Types.Decimal128.fromString(dp.totalCostBDT.toString()),
      totalSettlementAmount: mongoose.Types.Decimal128.fromString(dp.totalCostBDT.toString()),
      paidAmount: mongoose.Types.Decimal128.fromString(dp.paidAmount.toString()),
      dueAmount: mongoose.Types.Decimal128.fromString(dp.dueAmount.toString()),
      paymentAccountId: defaultAccount._id,
      paymentAccountName: defaultAccount.accountName,
      status: dp.status,
      notes: dp.notes,
      isReversed: false,
      isDemo: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await purchasesCollection.insertOne(purchaseDoc);

    // 3. Deduct Account Balance
    if (dp.paidAmount > 0) {
      await accountsCollection.updateOne(
        { _id: defaultAccount._id },
        { $inc: { balanceBDT: -dp.paidAmount } }
      );

      await transactionsCollection.insertOne({
        transactionNo: `TXN-${dp.purchaseNo}`,
        transactionType: 'PURCHASE_PAYMENT',
        accountId: defaultAccount._id,
        partyId: partyId,
        amountBDT: dp.paidAmount,
        direction: 'OUT',
        referenceVoucher: dp.purchaseNo,
        notes: `Purchase payment for ${dp.quantity} ${dp.currency}`,
        createdAt: new Date(),
      });
    }

    // 4. Update Party Balance
    if (partyId) {
      const balanceChange = -dp.dueAmount; // Negative indicates payable to party
      await partiesCollection.updateOne(
        { _id: partyId },
        {
          $inc: {
            currentBalanceBDT: balanceChange,
            totalPurchasedBDT: dp.totalCostBDT,
          },
        }
      );
    }

    // 5. Stock Movement Ledger
    await movementsCollection.insertOne({
      movementNo: `MOV-${dp.purchaseNo}`,
      currency: dp.currency,
      type: 'PURCHASE',
      quantity: dp.quantity,
      unitCostBDT: dp.rate,
      totalCostBDT: dp.totalCostBDT,
      resultingBalance: newQty.toNumber(),
      resultingWAC: newWAC.toNumber(),
      referenceVoucher: dp.purchaseNo,
      notes: dp.notes,
      createdAt: new Date(),
    });

    console.log(
      `  + Executed Demo Purchase: ${dp.purchaseNo} (${dp.quantity} ${dp.currency} @ ৳${dp.rate} = ৳${dp.totalCostBDT} BDT) -> New WAC: ৳${newWAC.toFixed(4)} | Due: ৳${dp.dueAmount} BDT`
    );
  }

  console.log('\n✅ Demo Data Seeding Completed Successfully!');
  process.exit(0);
}

seedDemoData().catch((err) => {
  console.error('❌ Seeder Failed:', err);
  process.exit(1);
});
