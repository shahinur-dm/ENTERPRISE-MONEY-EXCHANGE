const https = require('https');

async function get(path) {
  return new Promise((resolve, reject) => {
    https.get(`https://moneyexchangecom.vercel.app${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    }).on('error', reject);
  });
}

async function post(path, payload) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(payload);
    const req = https.request(`https://moneyexchangecom.vercel.app${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function run() {
  console.log('1. Testing GET /api/v1/currency/accounts...');
  const accs = await get('/api/v1/currency/accounts');
  console.log('Accounts status:', accs.status, 'Count:', accs.body?.data?.length);

  console.log('\n2. Testing GET /api/v1/currency/stock...');
  const stock = await get('/api/v1/currency/stock');
  console.log('Stock status:', stock.status, 'Total valuation BDT:', stock.body?.data?.totalValuationBDT);
  console.log('Currencies:', stock.body?.data?.stocks?.map(s => `${s.code}: qty=${s.stockQuantity} WAC=${s.averageCostRateBDT}`));

  console.log('\n3. Testing GET /api/v1/currency/purchases...');
  const purchases = await get('/api/v1/currency/purchases');
  console.log('Purchases status:', purchases.status, 'Recent count:', purchases.body?.data?.length);
  if (purchases.body?.data?.length > 0) {
    console.log('Sample purchase:', purchases.body.data[0]);
  }

  console.log('\n4. Testing POST /api/v1/currency/purchase...');
  const newPurchase = await post('/api/v1/currency/purchase', {
    supplierName: 'Sazzad Hossain',
    purchasedCurrency: 'USD',
    quantity: '500',
    purchaseRate: '100',
    paidAmount: '50000',
    notes: 'Live verification purchase test',
  });
  console.log('POST purchase status:', newPurchase.status);
  console.log('POST purchase result:', newPurchase.body);
}

run().catch(console.error);
