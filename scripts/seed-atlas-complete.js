const mongoose = require('mongoose');
const { 
  DEMO_CUSTOMERS, 
  DEMO_SUPPLIERS, 
  DEMO_AGENTS, 
  DEMO_BENEFICIARIES, 
  DEMO_REMITTANCES,
  DEMO_FX_PURCHASES,
  DEMO_FX_SALES,
  DEMO_BALANCED_JOURNALS 
} = require('../packages/shared/dist/index.js');

require('dotenv').config();

const uri = process.env.MONGO_URI || 'mongodb+srv://efootballmadrid25_db_user:ljvpbVMGVJTQPVcH@dawatit.5hxbo9c.mongodb.net/hundy?retryWrites=true&w=majority&appName=dawatit';

async function seedCompleteAtlas() {
  console.log('Connecting to MongoDB Atlas [hundy]...');
  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  const org = await db.collection('organizations').findOne({});
  const entities = await db.collection('legal_entities').find({}).toArray();
  const branches = await db.collection('branches').find({}).toArray();
  const users = await db.collection('users').find({}).toArray();

  const myrEntity = entities.find(e => e.functionalCurrency === 'MYR') || entities[0];
  const bdtEntity = entities.find(e => e.functionalCurrency === 'BDT') || entities[1] || entities[0];
  const kulBranch = branches.find(b => b.code === 'KUL-HQ') || branches[0];
  const adminUser = users.find(u => u.role === 'MASTER_ADMIN') || users[0];

  console.log('Seeding Customers...');
  await db.collection('customers').deleteMany({});
  const customerDocs = DEMO_CUSTOMERS.map((c, idx) => ({
    ...c,
    organizationId: org._id,
    legalEntityId: myrEntity._id,
    branchId: kulBranch._id,
    createdAt: new Date(),
    updatedAt: new Date()
  }));
  await db.collection('customers').insertMany(customerDocs);
  console.log(`Inserted ${customerDocs.length} customers.`);

  console.log('Seeding Suppliers...');
  await db.collection('suppliers').deleteMany({});
  const supplierDocs = DEMO_SUPPLIERS.map(s => ({
    ...s,
    organizationId: org._id,
    createdAt: new Date(),
    updatedAt: new Date()
  }));
  await db.collection('suppliers').insertMany(supplierDocs);
  console.log(`Inserted ${supplierDocs.length} wholesale suppliers.`);

  console.log('Seeding Agents...');
  await db.collection('agents').deleteMany({});
  const agentDocs = DEMO_AGENTS.map(a => ({
    ...a,
    organizationId: org._id,
    createdAt: new Date(),
    updatedAt: new Date()
  }));
  await db.collection('agents').insertMany(agentDocs);
  console.log(`Inserted ${agentDocs.length} payout agents.`);

  console.log('Seeding Beneficiaries...');
  await db.collection('beneficiaries').deleteMany({});
  const benDocs = DEMO_BENEFICIARIES.map(b => ({
    ...b,
    organizationId: org._id,
    createdAt: new Date(),
    updatedAt: new Date()
  }));
  await db.collection('beneficiaries').insertMany(benDocs);
  console.log(`Inserted ${benDocs.length} beneficiaries.`);

  console.log('Seeding Remittances...');
  await db.collection('remittances').deleteMany({});
  const remittanceDocs = DEMO_REMITTANCES.map(r => {
    const sAmount = parseFloat(r.sourceAmount.replace(/[^0-9.]/g, '')) || 1000;
    const tAmount = parseFloat(r.targetAmount.replace(/[^0-9.]/g, '')) || 35000;
    const rateVal = parseFloat(r.rate.split(' ')[0]) || 35;
    const feeVal = parseFloat(r.fee.replace(/[^0-9.]/g, '')) || 10;

    return {
      transactionNo: r.id,
      organizationId: org._id,
      sourceEntityId: myrEntity._id,
      sourceBranchId: kulBranch._id,
      destinationEntityId: bdtEntity._id,
      senderName: r.senderName,
      senderPhone: r.senderPhone,
      beneficiaryName: r.beneficiaryName,
      beneficiaryAccount: r.accountNumber,
      beneficiaryBank: r.beneficiaryBank,
      sourceCurrency: r.sourceCurrency,
      sourceAmount: mongoose.Types.Decimal128.fromString(sAmount.toFixed(2)),
      exchangeRate: mongoose.Types.Decimal128.fromString(rateVal.toFixed(4)),
      destinationCurrency: r.targetCurrency,
      destinationAmount: mongoose.Types.Decimal128.fromString(tAmount.toFixed(2)),
      serviceFee: mongoose.Types.Decimal128.fromString(feeVal.toFixed(2)),
      providerCharge: mongoose.Types.Decimal128.fromString('0.00'),
      totalCollectedAmount: mongoose.Types.Decimal128.fromString((sAmount + feeVal).toFixed(2)),
      status: r.status,
      voucherNo: r.voucherNo,
      timeline: [
        {
          status: 'DRAFT',
          timestamp: new Date(Date.now() - 3600000 * 24),
          memo: 'Order submitted by customer',
          updatedBy: adminUser._id
        },
        {
          status: r.status,
          timestamp: new Date(),
          memo: `Status updated to ${r.status}`,
          updatedBy: adminUser._id
        }
      ],
      createdBy: adminUser._id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  });
  await db.collection('remittances').insertMany(remittanceDocs);
  console.log(`Inserted ${remittanceDocs.length} remittances.`);

  console.log('Seeding FX Purchases...');
  await db.collection('currency_purchases').deleteMany({});
  const purchaseDocs = DEMO_FX_PURCHASES.map(p => {
    const qty = parseFloat(p.amount.replace(/[^0-9.]/g, '')) || 1000;
    const rateVal = parseFloat(p.rate) || 4.45;
    const baseVal = parseFloat(p.baseAmount.replace(/[^0-9.]/g, '')) || (qty * rateVal);
    return {
      purchaseNo: p.id,
      organizationId: org._id,
      legalEntityId: myrEntity._id,
      branchId: kulBranch._id,
      supplierName: p.partyName,
      purchasedCurrency: p.currency,
      quantity: mongoose.Types.Decimal128.fromString(qty.toFixed(2)),
      purchaseRate: mongoose.Types.Decimal128.fromString(rateVal.toFixed(4)),
      settlementCurrency: 'MYR',
      totalSettlementAmount: mongoose.Types.Decimal128.fromString(baseVal.toFixed(2)),
      paidAmount: mongoose.Types.Decimal128.fromString(baseVal.toFixed(2)),
      dueAmount: mongoose.Types.Decimal128.fromString('0.00'),
      status: 'SETTLED',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  });
  await db.collection('currency_purchases').insertMany(purchaseDocs);
  console.log(`Inserted ${purchaseDocs.length} currency purchases.`);

  console.log('Seeding FX Sales...');
  await db.collection('currency_sales').deleteMany({});
  const saleDocs = DEMO_FX_SALES.map(s => {
    const qty = parseFloat(s.amount.replace(/[^0-9.]/g, '')) || 500;
    const rateVal = parseFloat(s.rate) || 4.48;
    const proceeds = parseFloat(s.baseAmount.replace(/[^0-9.]/g, '')) || (qty * rateVal);
    const costRate = rateVal * 0.98;
    const totalCost = qty * costRate;
    const gain = proceeds - totalCost;

    return {
      saleNo: s.id,
      organizationId: org._id,
      legalEntityId: myrEntity._id,
      branchId: kulBranch._id,
      customerName: s.partyName,
      soldCurrency: s.currency,
      quantity: mongoose.Types.Decimal128.fromString(qty.toFixed(2)),
      sellingRate: mongoose.Types.Decimal128.fromString(rateVal.toFixed(4)),
      grossProceeds: mongoose.Types.Decimal128.fromString(proceeds.toFixed(2)),
      costBasisRate: mongoose.Types.Decimal128.fromString(costRate.toFixed(4)),
      totalCostBasis: mongoose.Types.Decimal128.fromString(totalCost.toFixed(2)),
      realizedFxGain: mongoose.Types.Decimal128.fromString(gain.toFixed(2)),
      receivedAmount: mongoose.Types.Decimal128.fromString(proceeds.toFixed(2)),
      dueAmount: mongoose.Types.Decimal128.fromString('0.00'),
      status: 'SETTLED',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  });
  await db.collection('currency_sales').insertMany(saleDocs);
  console.log(`Inserted ${saleDocs.length} currency sales.`);

  console.log('Seeding Balanced Journal Entries...');
  await db.collection('journal_entries').deleteMany({});
  const jvDocs = await Promise.all(DEMO_BALANCED_JOURNALS.map(async jv => {
    const dTotal = parseFloat(jv.debitTotal.replace(/[^0-9.]/g, '')) || 1000;
    const cTotal = parseFloat(jv.creditTotal.replace(/[^0-9.]/g, '')) || 1000;

    const lines = await Promise.all(jv.lines.map(async l => {
      const coa = await db.collection('chart_of_accounts').findOne({ code: l.code, legalEntityId: myrEntity._id });
      const debitVal = parseFloat(l.debit.replace(/[^0-9.]/g, '')) || 0;
      const creditVal = parseFloat(l.credit.replace(/[^0-9.]/g, '')) || 0;
      const amt = debitVal > 0 ? debitVal : creditVal;

      return {
        coaId: coa ? coa._id : new mongoose.Types.ObjectId(),
        coaCode: l.code,
        coaName: l.name,
        currency: 'MYR',
        nativeAmount: mongoose.Types.Decimal128.fromString(amt.toFixed(2)),
        exchangeRate: mongoose.Types.Decimal128.fromString('1.0000'),
        debit: mongoose.Types.Decimal128.fromString(debitVal.toFixed(2)),
        credit: mongoose.Types.Decimal128.fromString(creditVal.toFixed(2)),
        memo: l.name
      };
    }));

    return {
      entryNumber: jv.id,
      organizationId: org._id,
      legalEntityId: myrEntity._id,
      branchId: kulBranch._id,
      postingDate: new Date(jv.date),
      businessDate: jv.date,
      sourceModule: 'TREASURY',
      narration: jv.narrative,
      totalDebit: mongoose.Types.Decimal128.fromString(dTotal.toFixed(2)),
      totalCredit: mongoose.Types.Decimal128.fromString(cTotal.toFixed(2)),
      functionalCurrency: 'MYR',
      status: 'POSTED',
      isReversal: false,
      lines,
      postedBy: adminUser._id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }));
  await db.collection('journal_entries').insertMany(jvDocs);
  console.log(`Inserted ${jvDocs.length} balanced journal vouchers.`);

  console.log('\n=============================================================');
  console.log(' ALL ENTERPRISE RECORDS SUCCESSFULLY SEEDED TO MONGODB ATLAS ');
  console.log('=============================================================');

  const collections = await db.listCollections().toArray();
  for (const c of collections) {
    const count = await db.collection(c.name).countDocuments();
    console.log(`  * ${c.name}: ${count} records`);
  }

  await mongoose.disconnect();
}

seedCompleteAtlas().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});
