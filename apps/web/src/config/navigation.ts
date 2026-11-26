import {
  LayoutDashboard,
  ArrowDownLeft,
  ArrowUpRight,
  Coins,
  Receipt,
  History,
  Boxes,
  Send,
  UserCheck,
  Users,
  UserCog,
  Briefcase,
  BookOpen,
  Landmark,
  Building2,
  Wallet,
  ArrowRightLeft,
  BookOpenCheck,
  FileText,
  FileSpreadsheet,
  Scale,
  TrendingUp,
  PieChart,
  ShieldAlert,
  FileCheck2,
  CheckSquare,
  ClipboardList,
  Truck,
  Banknote,
  CreditCard,
  BarChart3,
  ShieldCheck,
  Lock,
  GitBranch,
  Building,
  Sliders,
  CalendarCheck,
  FileDiff,
  LucideIcon,
} from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  exact?: boolean;
}

export interface NavGroup {
  name: string;
  items: NavItem[];
}

export const NAVIGATION_GROUPS: NavGroup[] = [
  {
    name: 'OVERVIEW',
    items: [
      { label: 'Dashboard', href: '/', icon: LayoutDashboard, exact: true },
    ],
  },
  {
    name: 'FOREIGN EXCHANGE',
    items: [
      { label: 'Buy Currency', href: '/exchange/buy', icon: ArrowDownLeft },
      { label: 'Sell Currency', href: '/exchange/sell', icon: ArrowUpRight },
      { label: 'Currency Stock Inventory', href: '/exchange/stock', icon: Boxes, badge: 'WAC' },
      { label: 'Purchase History', href: '/exchange/purchases', icon: Receipt },
      { label: 'Sales History', href: '/exchange/sales', icon: History },
      { label: 'Exchange Rates', href: '/exchange/rates', icon: Coins },
    ],
  },
  {
    name: 'PARTY MANAGEMENT',
    items: [
      { label: 'Customers', href: '/parties/customers', icon: Users },
      { label: 'Wholesale Dealers', href: '/parties/dealers', icon: Briefcase },
      { label: 'Party Ledger', href: '/parties/ledger', icon: BookOpen },
    ],
  },
  {
    name: 'FINANCIAL MANAGEMENT',
    items: [
      { label: 'Customer Payments', href: '/financials/payments', icon: ArrowDownLeft },
      { label: 'Buyer Receipts', href: '/financials/receipts', icon: ArrowUpRight },
      { label: 'Cash & Bank Accounts', href: '/financials/accounts', icon: Building2 },
      { label: 'Internal Transfers', href: '/transfers', icon: ArrowRightLeft },
      { label: 'Business Expenses', href: '/financials/expenses', icon: CreditCard },
    ],
  },
  {
    name: 'CONTROLS & RECONCILIATIONS',
    items: [
      { label: 'Daily Business Closing', href: '/controls/daily-closing', icon: CalendarCheck, badge: 'Lock' },
      { label: 'Stock Adjustments', href: '/controls/stock-adjustments', icon: FileDiff },
    ],
  },
  {
    name: 'REPORTS & STATEMENTS',
    items: [
      { label: 'Daily Business Summary', href: '/reports/daily-summary', icon: BarChart3 },
      { label: 'Profit & Loss', href: '/reports/profit-loss', icon: TrendingUp },
      { label: 'Currency Stock Ledger', href: '/reports/stock-ledger', icon: FileSpreadsheet },
    ],
  },
  {
    name: 'CROSS-BORDER OPERATIONS',
    items: [
      { label: 'Remittances', href: '/remittance', icon: Send, badge: 'Live' },
      { label: 'Beneficiaries', href: '/beneficiaries', icon: UserCheck },
      { label: 'Agents', href: '/agents', icon: UserCog },
    ],
  },
  {
    name: 'FINANCIAL ACCOUNTING',
    items: [
      { label: 'Chart of Accounts', href: '/accounting/coa', icon: BookOpenCheck },
      { label: 'Journal Entries', href: '/accounting/journals', icon: FileText },
      { label: 'General Ledger', href: '/accounting/ledger', icon: FileSpreadsheet },
      { label: 'Trial Balance', href: '/accounting/trial-balance', icon: Scale },
      { label: 'Balance Sheet', href: '/accounting/balance-sheet', icon: PieChart },
    ],
  },
  {
    name: 'RISK & GOVERNANCE',
    items: [
      { label: 'Compliance & AML', href: '/compliance', icon: ShieldAlert, badge: 'AML' },
      { label: 'KYC Management', href: '/compliance/kyc', icon: FileCheck2 },
      { label: 'Approvals', href: '/approvals', icon: CheckSquare },
      { label: 'Audit Logs', href: '/audit-logs', icon: ClipboardList },
    ],
  },
  {
    name: 'SYSTEM ADMINISTRATION',
    items: [
      { label: 'User Management', href: '/admin/users', icon: ShieldCheck },
      { label: 'Roles & Permissions', href: '/admin/roles', icon: Lock },
      { label: 'Branch Management', href: '/admin/branches', icon: GitBranch },
      { label: 'Organization Settings', href: '/admin/organization', icon: Building },
      { label: 'System Settings', href: '/admin/settings', icon: Sliders },
    ],
  },
];
