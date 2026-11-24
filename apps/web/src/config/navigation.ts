import {
  LayoutDashboard,
  ArrowDownLeft,
  ArrowUpRight,
  Coins,
  Receipt,
  History,
  Send,
  UserCheck,
  Users,
  UserCog,
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
      { label: 'Exchange Rates', href: '/exchange/rates', icon: Coins },
      { label: 'Purchase History', href: '/exchange/purchases', icon: Receipt },
      { label: 'Sales History', href: '/exchange/sales', icon: History },
    ],
  },
  {
    name: 'CROSS-BORDER OPERATIONS',
    items: [
      { label: 'Remittances', href: '/remittance', icon: Send, badge: 'Live' },
      { label: 'Beneficiaries', href: '/beneficiaries', icon: UserCheck },
      { label: 'Customers', href: '/customers', icon: Users },
      { label: 'Agents', href: '/agents', icon: UserCog },
    ],
  },
  {
    name: 'TREASURY & ACCOUNTS',
    items: [
      { label: 'Fund Management', href: '/funds', icon: Landmark },
      { label: 'Bank Accounts', href: '/funds/banks', icon: Building2 },
      { label: 'Cash Management', href: '/funds/cash', icon: Wallet },
      { label: 'Internal Transfers', href: '/transfers', icon: ArrowRightLeft },
    ],
  },
  {
    name: 'FINANCIAL ACCOUNTING',
    items: [
      { label: 'Chart of Accounts', href: '/accounting/coa', icon: BookOpenCheck },
      { label: 'Journal Entries', href: '/accounting/journals', icon: FileText },
      { label: 'General Ledger', href: '/accounting/ledger', icon: FileSpreadsheet },
      { label: 'Trial Balance', href: '/accounting/trial-balance', icon: Scale },
      { label: 'Profit & Loss', href: '/accounting/profit-loss', icon: TrendingUp },
      { label: 'Balance Sheet', href: '/accounting/balance-sheet', icon: PieChart },
    ],
  },
  {
    name: 'RISK & GOVERNANCE',
    items: [
      { label: 'Compliance & AML', href: '/compliance', icon: ShieldAlert, badge: 'AML' },
      { label: 'KYC Management', href: '/compliance/kyc', icon: FileCheck2 },
      { label: 'Approvals', href: '/approvals', icon: CheckSquare, badge: '3' },
      { label: 'Audit Logs', href: '/audit-logs', icon: ClipboardList },
    ],
  },
  {
    name: 'BUSINESS MANAGEMENT',
    items: [
      { label: 'Suppliers', href: '/suppliers', icon: Truck },
      { label: 'Employees', href: '/employees', icon: Users },
      { label: 'Payroll', href: '/payroll', icon: Banknote },
      { label: 'Expenses', href: '/expenses', icon: CreditCard },
      { label: 'Reports', href: '/reports', icon: BarChart3 },
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
