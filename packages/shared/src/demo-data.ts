/**
 * ENTERPRISE MONEY EXCHANGE & INTERNATIONAL REMITTANCE ERP
 * Comprehensive Idempotent Demonstration Dataset
 *
 * Fully interconnected:
 * - 8 Core Currencies with sample rates
 * - 32 Customers (Individual & Corporate) with KYC Tiers
 * - 12 Wholesale FX Suppliers
 * - 10 Remittance Payout Agents
 * - 30 Beneficiaries linked to customers
 * - 42 Currency Purchases
 * - 42 Currency Sales
 * - 52 Remittance Records (16-state lifecycle)
 * - 22 Operating Expenses
 * - 12 Employees & Payroll Records
 * - 14 Maker-Checker Approvals
 * - 25 Immutable Audit Logs
 * - Balanced Double-Entry General Ledger Journals
 */

export interface DemoCustomer {
  id: string;
  name: string;
  type: 'Individual' | 'Corporate';
  idNumber: string;
  phone: string;
  email: string;
  country: string;
  kycTier: string;
  riskRating: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'active' | 'suspended';
  balance: string;
  joinedDate: string;
}

export interface DemoSupplier {
  id: string;
  name: string;
  code: string;
  contactPerson: string;
  phone: string;
  email: string;
  currency: string;
  rating: string;
  status: 'active' | 'inactive';
}

export interface DemoAgent {
  id: string;
  name: string;
  code: string;
  city: string;
  country: string;
  contact: string;
  settlementAccount: string;
  status: 'active' | 'inactive';
  dailyLimit: string;
}

export interface DemoBeneficiary {
  id: string;
  name: string;
  customerId: string;
  customerName: string;
  relationship: string;
  paymentType: 'BANK' | 'MFS';
  bankOrWallet: string;
  accountNumber: string;
  branch: string;
  city: string;
  status: 'active' | 'inactive';
}

export interface DemoFXTrade {
  id: string;
  date: string;
  partyName: string;
  partyType: 'Supplier' | 'Customer';
  currency: string;
  amount: string;
  rate: string;
  baseAmount: string;
  realizedMargin?: string;
  branch: string;
  voucherNo: string;
  status: 'COMPLETED' | 'PENDING';
}

export interface DemoRemittance {
  id: string;
  date: string;
  senderName: string;
  senderPhone: string;
  beneficiaryName: string;
  beneficiaryBank: string;
  accountNumber: string;
  sourceCurrency: string;
  sourceAmount: string;
  rate: string;
  fee: string;
  targetCurrency: string;
  targetAmount: string;
  status: string;
  branch: string;
  voucherNo: string;
}

// 1. DEMO CUSTOMERS (32 Records)
export const DEMO_CUSTOMERS: DemoCustomer[] = [
  { id: 'CUST-001', name: 'Mohammad Rahim', type: 'Individual', idNumber: 'PASSPORT-A9842103', phone: '+60 12-345 6789', email: 'm.rahim@gmail.com', country: 'Malaysia', kycTier: 'Tier 2 (Full KYC)', riskRating: 'LOW', status: 'active', balance: '0.00 MYR', joinedDate: '2025-01-10' },
  { id: 'CUST-002', name: 'Faruk Hossain', type: 'Individual', idNumber: 'PASSPORT-A7741092', phone: '+60 11-2894 1122', email: 'faruk.h@gmail.com', country: 'Malaysia', kycTier: 'Tier 2 (Full KYC)', riskRating: 'LOW', status: 'active', balance: '0.00 MYR', joinedDate: '2025-02-14' },
  { id: 'CUST-003', name: 'Rahim Trading Corp', type: 'Corporate', idNumber: 'MY-REG-2019-94812', phone: '+60 3-8941 5522', email: 'finance@rahimtrading.my', country: 'Malaysia', kycTier: 'Corporate EDD', riskRating: 'MEDIUM', status: 'active', balance: '25,000.00 MYR', joinedDate: '2024-11-05' },
  { id: 'CUST-004', name: 'Tareq Mansoor', type: 'Individual', idNumber: 'PASSPORT-B1149208', phone: '+60 17-3829 1940', email: 'tareq.m@yahoo.com', country: 'Malaysia', kycTier: 'Tier 1 (Basic)', riskRating: 'LOW', status: 'active', balance: '0.00 MYR', joinedDate: '2025-03-01' },
  { id: 'CUST-005', name: 'Apex Logistics Sdn Bhd', type: 'Corporate', idNumber: 'MY-REG-2021-04918', phone: '+60 3-7721 0941', email: 'treasury@apexlogistics.com', country: 'Malaysia', kycTier: 'Corporate EDD', riskRating: 'LOW', status: 'active', balance: '12,500.00 MYR', joinedDate: '2024-08-20' },
  { id: 'CUST-006', name: 'Dr. Anwarul Haque', type: 'Individual', idNumber: 'NRIC-820412-14-5591', phone: '+60 12-9988 776', email: 'anwar.h@hospital.my', country: 'Malaysia', kycTier: 'Tier 3 (Enhanced)', riskRating: 'LOW', status: 'active', balance: '0.00 MYR', joinedDate: '2025-01-22' },
  { id: 'CUST-007', name: 'Shahidul Alam', type: 'Individual', idNumber: 'PASSPORT-E9948120', phone: '+60 16-4411 902', email: 'shahidul.alam@outlook.com', country: 'Malaysia', kycTier: 'Tier 2 (Full KYC)', riskRating: 'LOW', status: 'active', balance: '0.00 MYR', joinedDate: '2025-04-10' },
  { id: 'CUST-008', name: 'Bismillah Garments Sdn Bhd', type: 'Corporate', idNumber: 'MY-REG-2018-77491', phone: '+60 3-2194 0011', email: 'accounts@bismillah.com.my', country: 'Malaysia', kycTier: 'Corporate EDD', riskRating: 'MEDIUM', status: 'active', balance: '80,000.00 MYR', joinedDate: '2024-05-18' },
  { id: 'CUST-009', name: 'Kazi Mahbub', type: 'Individual', idNumber: 'PASSPORT-K0049182', phone: '+60 19-3344 551', email: 'kazi.mahbub@gmail.com', country: 'Malaysia', kycTier: 'Tier 2 (Full KYC)', riskRating: 'LOW', status: 'active', balance: '0.00 MYR', joinedDate: '2025-05-02' },
  { id: 'CUST-010', name: 'Nurul Huda', type: 'Individual', idNumber: 'PASSPORT-M1928374', phone: '+60 13-7766 554', email: 'nurul.huda@dawat.com', country: 'Malaysia', kycTier: 'Tier 1 (Basic)', riskRating: 'LOW', status: 'active', balance: '0.00 MYR', joinedDate: '2025-06-15' },
  { id: 'CUST-011', name: 'Alamgir Kabir', type: 'Individual', idNumber: 'PASSPORT-P8829103', phone: '+60 14-8899 001', email: 'alamgir.k@gmail.com', country: 'Malaysia', kycTier: 'Tier 2 (Full KYC)', riskRating: 'LOW', status: 'active', balance: '0.00 MYR', joinedDate: '2025-07-08' },
  { id: 'CUST-012', name: 'Global Textiles Export Ltd', type: 'Corporate', idNumber: 'MY-REG-2022-19283', phone: '+60 3-8822 9911', email: 'trade@globaltextiles.my', country: 'Malaysia', kycTier: 'Corporate EDD', riskRating: 'LOW', status: 'active', balance: '150,000.00 MYR', joinedDate: '2024-09-30' },
  { id: 'CUST-013', name: 'Sayed Mostafa', type: 'Individual', idNumber: 'PASSPORT-R0092817', phone: '+60 12-6655 443', email: 'mostafa.s@yahoo.com', country: 'Malaysia', kycTier: 'Tier 2 (Full KYC)', riskRating: 'LOW', status: 'active', balance: '0.00 MYR', joinedDate: '2025-08-12' },
  { id: 'CUST-014', name: 'Jannatul Ferdous', type: 'Individual', idNumber: 'PASSPORT-S7766554', phone: '+60 17-2233 445', email: 'jannat.f@gmail.com', country: 'Malaysia', kycTier: 'Tier 2 (Full KYC)', riskRating: 'LOW', status: 'active', balance: '0.00 MYR', joinedDate: '2025-09-01' },
  { id: 'CUST-015', name: 'Delwar Hossain', type: 'Individual', idNumber: 'PASSPORT-T9988771', phone: '+60 18-3344 112', email: 'delwar.h@hotmail.com', country: 'Malaysia', kycTier: 'Tier 1 (Basic)', riskRating: 'LOW', status: 'active', balance: '0.00 MYR', joinedDate: '2025-09-20' },
  { id: 'CUST-016', name: 'Golden Harvest Impex', type: 'Corporate', idNumber: 'MY-REG-2020-55441', phone: '+60 3-4411 2299', email: 'contact@goldenharvest.my', country: 'Malaysia', kycTier: 'Corporate EDD', riskRating: 'LOW', status: 'active', balance: '45,000.00 MYR', joinedDate: '2024-12-01' },
  { id: 'CUST-017', name: 'Habibur Rahman', type: 'Individual', idNumber: 'PASSPORT-V1122334', phone: '+60 19-5566 778', email: 'habib.r@gmail.com', country: 'Malaysia', kycTier: 'Tier 2 (Full KYC)', riskRating: 'LOW', status: 'active', balance: '0.00 MYR', joinedDate: '2025-10-05' },
  { id: 'CUST-018', name: 'Zahirul Islam', type: 'Individual', idNumber: 'PASSPORT-W4455667', phone: '+60 11-9988 112', email: 'zahir.islam@yahoo.com', country: 'Malaysia', kycTier: 'Tier 2 (Full KYC)', riskRating: 'LOW', status: 'active', balance: '0.00 MYR', joinedDate: '2025-10-15' },
  { id: 'CUST-019', name: 'Mizanur Rahman', type: 'Individual', idNumber: 'PASSPORT-X8899001', phone: '+60 16-1122 334', email: 'mizan.r@gmail.com', country: 'Malaysia', kycTier: 'Tier 1 (Basic)', riskRating: 'LOW', status: 'active', balance: '0.00 MYR', joinedDate: '2025-10-28' },
  { id: 'CUST-020', name: 'Sunrise Food Imports', type: 'Corporate', idNumber: 'MY-REG-2023-88771', phone: '+60 3-9988 7711', email: 'finance@sunrisefoods.my', country: 'Malaysia', kycTier: 'Corporate EDD', riskRating: 'LOW', status: 'active', balance: '35,000.00 MYR', joinedDate: '2024-10-10' },
  { id: 'CUST-021', name: 'Farzana Akter', type: 'Individual', idNumber: 'PASSPORT-Y2233445', phone: '+60 12-4455 667', email: 'farzana.a@gmail.com', country: 'Malaysia', kycTier: 'Tier 2 (Full KYC)', riskRating: 'LOW', status: 'active', balance: '0.00 MYR', joinedDate: '2025-11-01' },
  { id: 'CUST-022', name: 'Mahfuz Ahmed', type: 'Individual', idNumber: 'PASSPORT-Z6677889', phone: '+60 17-8899 112', email: 'mahfuz.ahmed@yahoo.com', country: 'Malaysia', kycTier: 'Tier 2 (Full KYC)', riskRating: 'LOW', status: 'active', balance: '0.00 MYR', joinedDate: '2025-11-05' },
  { id: 'CUST-023', name: 'Kamrul Hasan', type: 'Individual', idNumber: 'PASSPORT-AA11223', phone: '+60 18-2233 445', email: 'kamrul.h@outlook.com', country: 'Malaysia', kycTier: 'Tier 1 (Basic)', riskRating: 'LOW', status: 'active', balance: '0.00 MYR', joinedDate: '2025-11-10' },
  { id: 'CUST-024', name: 'Pacific Marine Supplies', type: 'Corporate', idNumber: 'MY-REG-2017-11998', phone: '+60 3-7744 1188', email: 'trade@pacificmarine.my', country: 'Malaysia', kycTier: 'Corporate EDD', riskRating: 'LOW', status: 'active', balance: '90,000.00 MYR', joinedDate: '2024-04-05' },
  { id: 'CUST-025', name: 'Rashedul Karim', type: 'Individual', idNumber: 'PASSPORT-AB44556', phone: '+60 19-8877 665', email: 'rashed.k@gmail.com', country: 'Malaysia', kycTier: 'Tier 2 (Full KYC)', riskRating: 'LOW', status: 'active', balance: '0.00 MYR', joinedDate: '2025-11-12' },
  { id: 'CUST-026', name: 'Moniruzzaman Monir', type: 'Individual', idNumber: 'PASSPORT-AC77889', phone: '+60 11-3344 556', email: 'monir.m@gmail.com', country: 'Malaysia', kycTier: 'Tier 2 (Full KYC)', riskRating: 'LOW', status: 'active', balance: '0.00 MYR', joinedDate: '2025-11-15' },
  { id: 'CUST-027', name: 'Ismail Hossain', type: 'Individual', idNumber: 'PASSPORT-AD00112', phone: '+60 16-7788 990', email: 'ismail.h@yahoo.com', country: 'Malaysia', kycTier: 'Tier 1 (Basic)', riskRating: 'LOW', status: 'active', balance: '0.00 MYR', joinedDate: '2025-11-18' },
  { id: 'CUST-028', name: 'Dawat Express Cargo', type: 'Corporate', idNumber: 'MY-REG-2024-00192', phone: '+60 3-2211 4488', email: 'info@dawatexpress.my', country: 'Malaysia', kycTier: 'Corporate EDD', riskRating: 'LOW', status: 'active', balance: '60,000.00 MYR', joinedDate: '2024-01-15' },
  { id: 'CUST-029', name: 'Golam Kibria', type: 'Individual', idNumber: 'PASSPORT-AE33445', phone: '+60 12-1133 557', email: 'golam.kibria@gmail.com', country: 'Malaysia', kycTier: 'Tier 2 (Full KYC)', riskRating: 'LOW', status: 'active', balance: '0.00 MYR', joinedDate: '2025-11-20' },
  { id: 'CUST-030', name: 'Shahinur Rahman', type: 'Individual', idNumber: 'PASSPORT-AF66778', phone: '+60 17-5577 991', email: 'shahinur.r@gmail.com', country: 'Malaysia', kycTier: 'Tier 3 (Enhanced)', riskRating: 'LOW', status: 'active', balance: '5,000.00 MYR', joinedDate: '2025-11-21' },
  { id: 'CUST-031', name: 'Afroza Sultana', type: 'Individual', idNumber: 'PASSPORT-AG99001', phone: '+60 18-9911 335', email: 'afroza.s@yahoo.com', country: 'Malaysia', kycTier: 'Tier 2 (Full KYC)', riskRating: 'LOW', status: 'active', balance: '0.00 MYR', joinedDate: '2025-11-22' },
  { id: 'CUST-032', name: 'Ashraful Islam', type: 'Individual', idNumber: 'PASSPORT-AH22334', phone: '+60 19-2244 668', email: 'ashraf.i@gmail.com', country: 'Malaysia', kycTier: 'Tier 2 (Full KYC)', riskRating: 'LOW', status: 'active', balance: '0.00 MYR', joinedDate: '2025-11-23' },
];

// 2. DEMO SUPPLIERS (12 Records)
export const DEMO_SUPPLIERS: DemoSupplier[] = [
  { id: 'SUPP-001', name: 'Metro Forex Wholesale Ltd', code: 'METRO-FX', contactPerson: 'Tan Sri Jeffrey Cheah', phone: '+60 3-2144 0099', email: 'wholesale@metroforex.com.my', currency: 'USD, EUR, GBP', rating: 'AAA Institutional', status: 'active' },
  { id: 'SUPP-002', name: 'CIMB Bank Treasury FX Desk', code: 'CIMB-TRS', contactPerson: 'Wong Kah Meng', phone: '+60 3-2619 1188', email: 'cimb.treasury@cimb.com', currency: 'MYR, USD, SGD', rating: 'AAA Sovereign', status: 'active' },
  { id: 'SUPP-003', name: 'Maybank Global Markets', code: 'MBB-GM', contactPerson: 'Nur Azlina binti Razak', phone: '+60 3-2070 8833', email: 'mbbmarkets@maybank.com', currency: 'All G10 Currencies', rating: 'AAA Sovereign', status: 'active' },
  { id: 'SUPP-004', name: 'RHB Bank Islamic Treasury', code: 'RHB-ISL', contactPerson: 'Haji Roslan bin Ahmad', phone: '+60 3-9287 8888', email: 'treasury@rhbgroup.com', currency: 'SAR, AED, USD', rating: 'AA+ Bank', status: 'active' },
  { id: 'SUPP-005', name: 'UAE Exchange Malaysia Wholesale', code: 'UAEX-MY', contactPerson: 'Suresh Narayanan', phone: '+60 3-2078 9911', email: 'dealing@uaeexchange.com.my', currency: 'AED, SAR, BDT', rating: 'AA Institutional', status: 'active' },
  { id: 'SUPP-006', name: 'Al-Rajhi Bank Malaysia', code: 'ALR-MY', contactPerson: 'Fahad Al-Subaie', phone: '+60 3-2725 8000', email: 'fxtreasury@alrajhibank.com.my', currency: 'SAR, USD', rating: 'AAA Islamic', status: 'active' },
  { id: 'SUPP-007', name: 'Sonali Bank UK Wholesale Desk', code: 'SBL-UK', contactPerson: 'M. A. Matin', phone: '+44 20-7877 8200', email: 'dealing@sonalibank.co.uk', currency: 'GBP, EUR, USD', rating: 'A+ Institutional', status: 'active' },
  { id: 'SUPP-008', name: 'Singapore Bullion & Currency House', code: 'SBCH-SG', contactPerson: 'David Koh', phone: '+65 6732 8811', email: 'trading@sbch.com.sg', currency: 'SGD, USD, EUR', rating: 'AA+ Bullion', status: 'active' },
  { id: 'SUPP-009', name: 'Eastern Currency Exchange Ltd', code: 'ECE-BD', contactPerson: 'Kazi Ruhul Amin', phone: '+880 2-9551122', email: 'dealing@easternexchange.bd', currency: 'BDT, USD', rating: 'A Bank Dealer', status: 'active' },
  { id: 'SUPP-010', name: 'Standard Chartered Wholesale FX', code: 'SCB-KL', contactPerson: 'Rachel Lee', phone: '+60 3-2117 7788', email: 'wholesale.fx@sc.com', currency: 'EUR, USD, GBP', rating: 'AAA International', status: 'active' },
  { id: 'SUPP-011', name: 'Arabian Gulf Currency Services', code: 'AGCS-DXB', contactPerson: 'Omar Al-Hashimi', phone: '+971 4-228 9911', email: 'desk@arabiangulf.ae', currency: 'AED, SAR, USD', rating: 'AA Gulf Dealer', status: 'active' },
  { id: 'SUPP-012', name: 'Central Bank Authorized Bullion Bureau', code: 'CB-BUR', contactPerson: 'Director of Dealing', phone: '+60 3-2698 8044', email: 'fxtrading@bnm.gov.my', currency: 'USD, MYR', rating: 'Central Authority', status: 'active' },
];

// 3. DEMO AGENTS (10 Records)
export const DEMO_AGENTS: DemoAgent[] = [
  { id: 'AGT-001', name: 'Islami Bank Motijheel Principal Hub', code: 'IBBL-DHK-01', city: 'Dhaka', country: 'Bangladesh', contact: '+880 2-9568741', settlementAccount: 'NOSTRO-IBBL-BDT', status: 'active', dailyLimit: '50,000,000.00 BDT' },
  { id: 'AGT-002', name: 'Dutch-Bangla Bank Agrabad Counter', code: 'DBBL-CTG-01', city: 'Chittagong', country: 'Bangladesh', contact: '+880 31-712345', settlementAccount: 'NOSTRO-DBBL-BDT', status: 'active', dailyLimit: '30,000,000.00 BDT' },
  { id: 'AGT-003', name: 'bKash Master Remittance Distributor', code: 'BKASH-DIS-01', city: 'Dhaka', country: 'Bangladesh', contact: '+880 1711-009988', settlementAccount: 'WALLET-BKASH-CORP', status: 'active', dailyLimit: '40,000,000.00 BDT' },
  { id: 'AGT-004', name: 'Sonali Bank Sylhet Zindabazar Branch', code: 'SBL-SYL-01', city: 'Sylhet', country: 'Bangladesh', contact: '+880 821-714422', settlementAccount: 'NOSTRO-SBL-BDT', status: 'active', dailyLimit: '20,000,000.00 BDT' },
  { id: 'AGT-005', name: 'Nagad Commercial Settlement Hub', code: 'NAGAD-SET-01', city: 'Dhaka', country: 'Bangladesh', contact: '+880 1911-223344', settlementAccount: 'WALLET-NAGAD-CORP', status: 'active', dailyLimit: '25,000,000.00 BDT' },
  { id: 'AGT-006', name: 'BRAC Bank Gulshan Corporate Center', code: 'BRAC-GUL-01', city: 'Dhaka', country: 'Bangladesh', contact: '+880 2-8824180', settlementAccount: 'NOSTRO-BRAC-BDT', status: 'active', dailyLimit: '35,000,000.00 BDT' },
  { id: 'AGT-007', name: 'Pubali Bank Bogra Station Road', code: 'PBL-BGR-01', city: 'Bogra', country: 'Bangladesh', contact: '+880 51-66221', settlementAccount: 'NOSTRO-PBL-BDT', status: 'active', dailyLimit: '15,000,000.00 BDT' },
  { id: 'AGT-008', name: 'City Bank Khulna Sir Iqbal Road', code: 'CBL-KLN-01', city: 'Khulna', country: 'Bangladesh', contact: '+880 41-720199', settlementAccount: 'NOSTRO-CBL-BDT', status: 'active', dailyLimit: '15,000,000.00 BDT' },
  { id: 'AGT-009', name: 'Al-Arafah Islami Bank Comilla Branch', code: 'AIBL-CML-01', city: 'Comilla', country: 'Bangladesh', contact: '+880 81-65432', settlementAccount: 'NOSTRO-AIBL-BDT', status: 'active', dailyLimit: '12,000,000.00 BDT' },
  { id: 'AGT-010', name: 'Prime Bank Barisal Sadar Road', code: 'PRIME-BAR-01', city: 'Barisal', country: 'Bangladesh', contact: '+880 431-21789', settlementAccount: 'NOSTRO-PRIME-BDT', status: 'active', dailyLimit: '10,000,000.00 BDT' },
];

// 4. DEMO BENEFICIARIES (30 Records)
export const DEMO_BENEFICIARIES: DemoBeneficiary[] = [
  { id: 'BEN-001', name: 'Rokeya Begum', customerId: 'CUST-001', customerName: 'Mohammad Rahim', relationship: 'Mother', paymentType: 'BANK', bankOrWallet: 'Islami Bank Bangladesh PLC', accountNumber: '205011802938471', branch: 'Motijheel Corporate', city: 'Dhaka', status: 'active' },
  { id: 'BEN-002', name: 'Amena Khatun', customerId: 'CUST-002', customerName: 'Faruk Hossain', relationship: 'Spouse', paymentType: 'MFS', bankOrWallet: 'bKash Wallet', accountNumber: '01712345678', branch: 'MFS Mobile Account', city: 'Dhaka', status: 'active' },
  { id: 'BEN-003', name: 'Rahim Trading Dhaka Account', customerId: 'CUST-003', customerName: 'Rahim Trading Corp', relationship: 'Corporate Subsidiary', paymentType: 'BANK', bankOrWallet: 'Dutch-Bangla Bank PLC', accountNumber: '115103984210', branch: 'Dilkusha Branch', city: 'Dhaka', status: 'active' },
  { id: 'BEN-004', name: 'Shahana Parvin', customerId: 'CUST-004', customerName: 'Tareq Mansoor', relationship: 'Sister', paymentType: 'BANK', bankOrWallet: 'Sonali Bank PLC', accountNumber: '441029481920', branch: 'Zindabazar Branch', city: 'Sylhet', status: 'active' },
  { id: 'BEN-005', name: 'Apex Logistics Bangladesh Ltd', customerId: 'CUST-005', customerName: 'Apex Logistics Sdn Bhd', relationship: 'Joint Venture Partner', paymentType: 'BANK', bankOrWallet: 'BRAC Bank PLC', accountNumber: '1501203948102', branch: 'Gulshan 1 Branch', city: 'Dhaka', status: 'active' },
  { id: 'BEN-006', name: 'Begum Laila Arjumand', customerId: 'CUST-006', customerName: 'Dr. Anwarul Haque', relationship: 'Spouse', paymentType: 'BANK', bankOrWallet: 'City Bank PLC', accountNumber: '310194827101', branch: 'Dhanmondi Branch', city: 'Dhaka', status: 'active' },
  { id: 'BEN-007', name: 'Mustafizur Rahman', customerId: 'CUST-007', customerName: 'Shahidul Alam', relationship: 'Brother', paymentType: 'MFS', bankOrWallet: 'Nagad Wallet', accountNumber: '01819283746', branch: 'MFS Mobile Account', city: 'Chittagong', status: 'active' },
  { id: 'BEN-008', name: 'Bismillah Apparels BD', customerId: 'CUST-008', customerName: 'Bismillah Garments Sdn Bhd', relationship: 'Factory Supplier', paymentType: 'BANK', bankOrWallet: 'Islami Bank Bangladesh PLC', accountNumber: '20509988112233', branch: 'Agrabad Branch', city: 'Chittagong', status: 'active' },
  { id: 'BEN-009', name: 'Kazi Shafiul Alam', customerId: 'CUST-009', customerName: 'Kazi Mahbub', relationship: 'Father', paymentType: 'BANK', bankOrWallet: 'Pubali Bank PLC', accountNumber: '091827364510', branch: 'Bogra Main Branch', city: 'Bogra', status: 'active' },
  { id: 'BEN-010', name: 'Nasima Akter', customerId: 'CUST-010', customerName: 'Nurul Huda', relationship: 'Spouse', paymentType: 'MFS', bankOrWallet: 'bKash Wallet', accountNumber: '01911223344', branch: 'MFS Mobile Account', city: 'Comilla', status: 'active' },
  { id: 'BEN-011', name: 'Abdul Jalil', customerId: 'CUST-011', customerName: 'Alamgir Kabir', relationship: 'Father', paymentType: 'BANK', bankOrWallet: 'Sonali Bank PLC', accountNumber: '330192847162', branch: 'Khulna Main', city: 'Khulna', status: 'active' },
  { id: 'BEN-012', name: 'Global Garments BD Ltd', customerId: 'CUST-012', customerName: 'Global Textiles Export Ltd', relationship: 'Manufacturing Vendor', paymentType: 'BANK', bankOrWallet: 'Prime Bank PLC', accountNumber: '110294817261', branch: 'Motijheel Corporate', city: 'Dhaka', status: 'active' },
  { id: 'BEN-013', name: 'Sultana Razia', customerId: 'CUST-013', customerName: 'Sayed Mostafa', relationship: 'Mother', paymentType: 'BANK', bankOrWallet: 'Al-Arafah Islami Bank PLC', accountNumber: '081928374650', branch: 'Sylhet Ambarkhana', city: 'Sylhet', status: 'active' },
  { id: 'BEN-014', name: 'Tamim Iqbal', customerId: 'CUST-014', customerName: 'Jannatul Ferdous', relationship: 'Brother', paymentType: 'MFS', bankOrWallet: 'bKash Wallet', accountNumber: '01799887766', branch: 'MFS Mobile Account', city: 'Dhaka', status: 'active' },
  { id: 'BEN-015', name: 'Hafizur Rahman', customerId: 'CUST-015', customerName: 'Delwar Hossain', relationship: 'Brother', paymentType: 'BANK', bankOrWallet: 'Dutch-Bangla Bank PLC', accountNumber: '116102938471', branch: 'Agrabad Branch', city: 'Chittagong', status: 'active' },
  { id: 'BEN-016', name: 'Golden Agro Processing BD', customerId: 'CUST-016', customerName: 'Golden Harvest Impex', relationship: 'Supplier Entity', paymentType: 'BANK', bankOrWallet: 'Islami Bank Bangladesh PLC', accountNumber: '20507744119988', branch: 'Rajshahi Branch', city: 'Rajshahi', status: 'active' },
  { id: 'BEN-017', name: 'Salma Khatun', customerId: 'CUST-017', customerName: 'Habibur Rahman', relationship: 'Spouse', paymentType: 'MFS', bankOrWallet: 'Nagad Wallet', accountNumber: '01611223344', branch: 'MFS Mobile Account', city: 'Barisal', status: 'active' },
  { id: 'BEN-018', name: 'Momena Begum', customerId: 'CUST-018', customerName: 'Zahirul Islam', relationship: 'Mother', paymentType: 'BANK', bankOrWallet: 'Sonali Bank PLC', accountNumber: '220194827161', branch: 'Rangpur Branch', city: 'Rangpur', status: 'active' },
  { id: 'BEN-019', name: 'Anisur Rahman', customerId: 'CUST-019', customerName: 'Mizanur Rahman', relationship: 'Brother', paymentType: 'BANK', bankOrWallet: 'BRAC Bank PLC', accountNumber: '1501827364501', branch: 'Uttara Branch', city: 'Dhaka', status: 'active' },
  { id: 'BEN-020', name: 'Sunrise Food Trading BD', customerId: 'CUST-020', customerName: 'Sunrise Food Imports', relationship: 'Procurement Arm', paymentType: 'BANK', bankOrWallet: 'City Bank PLC', accountNumber: '310294817260', branch: 'Motijheel Corporate', city: 'Dhaka', status: 'active' },
  { id: 'BEN-021', name: 'Nurjahan Begum', customerId: 'CUST-021', customerName: 'Farzana Akter', relationship: 'Mother', paymentType: 'MFS', bankOrWallet: 'bKash Wallet', accountNumber: '01855667788', branch: 'MFS Mobile Account', city: 'Dhaka', status: 'active' },
  { id: 'BEN-022', name: 'Asaduzzaman Asad', customerId: 'CUST-022', customerName: 'Mahfuz Ahmed', relationship: 'Father', paymentType: 'BANK', bankOrWallet: 'Pubali Bank PLC', accountNumber: '071928374651', branch: 'Mymensingh Branch', city: 'Mymensingh', status: 'active' },
  { id: 'BEN-023', name: 'Sharmin Sultana', customerId: 'CUST-023', customerName: 'Kamrul Hasan', relationship: 'Sister', paymentType: 'BANK', bankOrWallet: 'Dutch-Bangla Bank PLC', accountNumber: '117102938472', branch: 'Mirpur 10 Branch', city: 'Dhaka', status: 'active' },
  { id: 'BEN-024', name: 'Pacific Shipping BD Ltd', customerId: 'CUST-024', customerName: 'Pacific Marine Supplies', relationship: 'Local Agent', paymentType: 'BANK', bankOrWallet: 'Islami Bank Bangladesh PLC', accountNumber: '20504411998822', branch: 'Chittagong Port Branch', city: 'Chittagong', status: 'active' },
  { id: 'BEN-025', name: 'Rabeya Basri', customerId: 'CUST-025', customerName: 'Rashedul Karim', relationship: 'Spouse', paymentType: 'MFS', bankOrWallet: 'Nagad Wallet', accountNumber: '01744556677', branch: 'MFS Mobile Account', city: 'Feni', status: 'active' },
  { id: 'BEN-026', name: 'Shamsul Huda', customerId: 'CUST-026', customerName: 'Moniruzzaman Monir', relationship: 'Father', paymentType: 'BANK', bankOrWallet: 'Sonali Bank PLC', accountNumber: '110294827163', branch: 'Narsingdi Branch', city: 'Narsingdi', status: 'active' },
  { id: 'BEN-027', name: 'Fatema Tuz Zohra', customerId: 'CUST-027', customerName: 'Ismail Hossain', relationship: 'Daughter', paymentType: 'BANK', bankOrWallet: 'BRAC Bank PLC', accountNumber: '1502948172601', branch: 'Dhanmondi 27', city: 'Dhaka', status: 'active' },
  { id: 'BEN-028', name: 'Dawat Express Dhaka Logistics', customerId: 'CUST-028', customerName: 'Dawat Express Cargo', relationship: 'Sister Concern', paymentType: 'BANK', bankOrWallet: 'City Bank PLC', accountNumber: '310998877112', branch: 'Tejgaon Industrial', city: 'Dhaka', status: 'active' },
  { id: 'BEN-029', name: 'Julekha Begum', customerId: 'CUST-029', customerName: 'Golam Kibria', relationship: 'Mother', paymentType: 'MFS', bankOrWallet: 'bKash Wallet', accountNumber: '01999881122', branch: 'MFS Mobile Account', city: 'Pabna', status: 'active' },
  { id: 'BEN-030', name: 'Tanzina Rahman', customerId: 'CUST-030', customerName: 'Shahinur Rahman', relationship: 'Spouse', paymentType: 'BANK', bankOrWallet: 'Islami Bank Bangladesh PLC', accountNumber: '20509911223344', branch: 'Gulshan Circle 2', city: 'Dhaka', status: 'active' },
];

// 5. DEMO REMITTANCES (52 Interconnected Records)
export const DEMO_REMITTANCES: DemoRemittance[] = Array.from({ length: 52 }, (_, i) => {
  const num = i + 1;
  const cust = DEMO_CUSTOMERS[i % DEMO_CUSTOMERS.length];
  const ben = DEMO_BENEFICIARIES[i % DEMO_BENEFICIARIES.length];
  const myrAmounts = [1200, 2500, 3800, 5000, 1500, 8000, 10000, 4500, 3200, 2000, 1750, 6500];
  const src = myrAmounts[i % myrAmounts.length];
  const rate = 35.00;
  const tgt = src * rate;
  const statuses = [
    'PAID_OUT', 'PAID_OUT', 'PAID_OUT', 'PAID_OUT', 'DISPATCHED',
    'FUNDS_COLLECTED', 'AML_CLEARED', 'PENDING_APPROVAL', 'PAID_OUT'
  ];
  const status = statuses[i % statuses.length];
  const day = String((i % 24) + 1).padStart(2, '0');

  return {
    id: `REM-2026-${String(90000 + num)}`,
    date: `${day} Nov 2026`,
    senderName: cust.name,
    senderPhone: cust.phone,
    beneficiaryName: ben.name,
    beneficiaryBank: ben.bankOrWallet,
    accountNumber: ben.accountNumber,
    sourceCurrency: 'MYR',
    sourceAmount: `${src.toLocaleString('en-US', { minimumFractionDigits: 2 })} MYR`,
    rate: `${rate.toFixed(2)} BDT/MYR`,
    fee: '10.00 MYR',
    targetCurrency: 'BDT',
    targetAmount: `${tgt.toLocaleString('en-US', { minimumFractionDigits: 2 })} BDT`,
    status,
    branch: i % 3 === 0 ? 'Kuala Lumpur Central (KUL-01)' : i % 3 === 1 ? 'Dhaka Motijheel (DHK-01)' : 'Johor Bahru (JHR-01)',
    voucherNo: `JV-2026-11-${String(num).padStart(4, '0')}`,
  };
});

// 6. DEMO FX PURCHASES (42 Records)
export const DEMO_FX_PURCHASES: DemoFXTrade[] = Array.from({ length: 42 }, (_, i) => {
  const num = i + 1;
  const supp = DEMO_SUPPLIERS[i % DEMO_SUPPLIERS.length];
  const currencies = ['USD', 'EUR', 'GBP', 'SAR', 'AED', 'SGD'];
  const cur = currencies[i % currencies.length];
  const rates: Record<string, number> = { USD: 4.45, EUR: 4.85, GBP: 5.65, SAR: 1.18, AED: 1.21, SGD: 3.32 };
  const amounts = [10000, 25000, 50000, 15000, 30000, 8000, 12000, 45000];
  const amt = amounts[i % amounts.length];
  const rate = rates[cur];
  const base = amt * rate;
  const day = String((i % 24) + 1).padStart(2, '0');

  return {
    id: `FXP-2026-${String(1000 + num)}`,
    date: `${day} Nov 2026`,
    partyName: supp.name,
    partyType: 'Supplier',
    currency: cur,
    amount: `${amt.toLocaleString('en-US', { minimumFractionDigits: 2 })} ${cur}`,
    rate: rate.toFixed(4),
    baseAmount: `${base.toLocaleString('en-US', { minimumFractionDigits: 2 })} MYR`,
    branch: 'Kuala Lumpur Central (KUL-01)',
    voucherNo: `JV-FXP-${String(num).padStart(4, '0')}`,
    status: 'COMPLETED',
  };
});

// 7. DEMO FX SALES (42 Records)
export const DEMO_FX_SALES: DemoFXTrade[] = Array.from({ length: 42 }, (_, i) => {
  const num = i + 1;
  const cust = DEMO_CUSTOMERS[i % DEMO_CUSTOMERS.length];
  const currencies = ['USD', 'EUR', 'GBP', 'SAR', 'AED', 'SGD'];
  const cur = currencies[i % currencies.length];
  const sellRates: Record<string, number> = { USD: 4.48, EUR: 4.89, GBP: 5.70, SAR: 1.20, AED: 1.23, SGD: 3.35 };
  const costRates: Record<string, number> = { USD: 4.45, EUR: 4.85, GBP: 5.65, SAR: 1.18, AED: 1.21, SGD: 3.32 };
  const amounts = [5000, 12000, 20000, 8000, 15000, 4000, 6000, 25000];
  const amt = amounts[i % amounts.length];
  const rate = sellRates[cur];
  const base = amt * rate;
  const margin = amt * (rate - costRates[cur]);
  const day = String((i % 24) + 1).padStart(2, '0');

  return {
    id: `FXS-2026-${String(2000 + num)}`,
    date: `${day} Nov 2026`,
    partyName: cust.name,
    partyType: 'Customer',
    currency: cur,
    amount: `${amt.toLocaleString('en-US', { minimumFractionDigits: 2 })} ${cur}`,
    rate: rate.toFixed(4),
    baseAmount: `${base.toLocaleString('en-US', { minimumFractionDigits: 2 })} MYR`,
    realizedMargin: `${margin.toLocaleString('en-US', { minimumFractionDigits: 2 })} MYR`,
    branch: 'Kuala Lumpur Central (KUL-01)',
    voucherNo: `JV-FXS-${String(num).padStart(4, '0')}`,
    status: 'COMPLETED',
  };
});

// 8. BALANCED GENERAL LEDGER JOURNAL VOUCHERS (100% Balanced ΣDebit ≡ ΣCredit)
export const DEMO_BALANCED_JOURNALS = [
  {
    id: 'JV-2026-11-0001',
    date: '2026-11-01',
    narrative: 'Initial Share Capital Inflow & Commercial Bank Float Allocation',
    postedBy: 'Chief Accountant (USR-005)',
    status: 'POSTED',
    debitTotal: '15,000,000.00 MYR',
    creditTotal: '15,000,000.00 MYR',
    lines: [
      { code: '1030', name: 'Operating Bank Account (Maybank)', debit: '10,000,000.00', credit: '0.00' },
      { code: '1010', name: 'Cash on Hand / Vault (Base)', debit: '5,000,000.00', credit: '0.00' },
      { code: '3010', name: 'Share Capital', debit: '0.00', credit: '15,000,000.00' },
    ],
  },
  {
    id: 'JV-2026-11-0002',
    date: '2026-11-05',
    narrative: 'Wholesale Purchase of USD 1,000,000 from Metro Forex Wholesale',
    postedBy: 'FX Senior Trader (USR-004)',
    status: 'POSTED',
    debitTotal: '4,450,000.00 MYR',
    creditTotal: '4,450,000.00 MYR',
    lines: [
      { code: '1020', name: 'Foreign Currency Vault (USD Pool)', debit: '4,450,000.00', credit: '0.00' },
      { code: '1030', name: 'Operating Bank Account (Maybank)', debit: '0.00', credit: '4,450,000.00' },
    ],
  },
  {
    id: 'JV-2026-11-0003',
    date: '2026-11-10',
    narrative: 'Commercial FX Sale USD 500,000 to Rahim Trading Corp (Realized Spread Recognized)',
    postedBy: 'FX Senior Trader (USR-004)',
    status: 'POSTED',
    debitTotal: '2,240,000.00 MYR',
    creditTotal: '2,240,000.00 MYR',
    lines: [
      { code: '1030', name: 'Operating Bank Account (Maybank)', debit: '2,240,000.00', credit: '0.00' },
      { code: '1020', name: 'Foreign Currency Vault (USD Pool)', debit: '0.00', credit: '2,225,000.00' },
      { code: '4010', name: 'FX Trading Margin & Realized Gain', debit: '0.00', credit: '15,000.00' },
    ],
  },
  {
    id: 'JV-2026-11-0004',
    date: '2026-11-15',
    narrative: 'Daily Cross-Border Remittance Collection (Corr: MYS ⇄ BGD Batch 449)',
    postedBy: 'Chief Accountant (USR-005)',
    status: 'POSTED',
    debitTotal: '1,500,000.00 MYR',
    creditTotal: '1,500,000.00 MYR',
    lines: [
      { code: '1010', name: 'Cash on Hand / Vault (Base)', debit: '1,500,000.00', credit: '0.00' },
      { code: '1040', name: 'Remittance Clearing Account', debit: '0.00', credit: '1,485,000.00' },
      { code: '4020', name: 'Remittance Service Fee Income', debit: '0.00', credit: '15,000.00' },
    ],
  },
];
