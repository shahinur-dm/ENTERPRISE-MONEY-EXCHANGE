const http = require('http');

const routes = [
  '/',
  '/login',
  '/exchange/buy',
  '/exchange/sell',
  '/exchange/rates',
  '/exchange/purchases',
  '/exchange/sales',
  '/remittance',
  '/beneficiaries',
  '/customers',
  '/agents',
  '/funds',
  '/funds/banks',
  '/funds/cash',
  '/transfers',
  '/accounting',
  '/accounting/coa',
  '/accounting/journals',
  '/accounting/ledger',
  '/accounting/trial-balance',
  '/accounting/profit-loss',
  '/accounting/balance-sheet',
  '/compliance',
  '/compliance/kyc',
  '/approvals',
  '/audit-logs',
  '/suppliers',
  '/employees',
  '/payroll',
  '/expenses',
  '/reports',
  '/admin',
  '/admin/users',
  '/admin/roles',
  '/admin/branches',
  '/admin/organization',
  '/admin/settings',
];

async function checkRoutes() {
  let ok = 0;
  let failed = 0;

  for (const r of routes) {
    try {
      const res = await fetch('http://localhost:3000' + r);
      if (res.status === 200) {
        console.log(`[PASS] ${r} -> 200 OK`);
        ok++;
      } else {
        console.error(`[FAIL] ${r} -> Status ${res.status}`);
        failed++;
      }
    } catch (err) {
      console.error(`[ERROR] ${r} -> ${err.message}`);
      failed++;
    }
  }

  console.log(`\n========================================`);
  console.log(`Total Routes Verified: ${ok}/${routes.length}`);
  console.log(`Failed Routes: ${failed}`);
  console.log(`========================================\n`);

  if (failed > 0) process.exit(1);
}

checkRoutes();
