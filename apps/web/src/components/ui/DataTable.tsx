'use client';

import React, { useState } from 'react';
import {
  Search,
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchKey?: string;
  searchPlaceholder?: string;
  onSearch?: (term: string) => void;
  statusOptions?: { label: string; value: string }[];
  selectedStatus?: string;
  onStatusChange?: (status: string) => void;
  actions?: React.ReactNode;
  title?: string;
  subtitle?: string;
  isLoading?: boolean;
  loading?: boolean;
  emptyMessage?: string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  searchPlaceholder = 'Search records...',
  statusOptions,
  selectedStatus = 'ALL',
  onStatusChange,
  actions,
  title,
  subtitle,
  isLoading = false,
  loading = false,
  emptyMessage = 'No records found',
}: DataTableProps<T>) {
  const effectiveLoading = isLoading || loading;
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Client-side filtering
  const filteredData = data.filter((item) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return Object.values(item).some(
      (val) => val && String(val).toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleExportCSV = () => {
    if (!filteredData.length) return;
    const headers = columns.map((c) => c.header).join(',');
    const rows = filteredData.map((item) =>
      columns.map((c) => (c.accessorKey ? String(item[c.accessorKey] ?? '') : '')).join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `erp_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white shadow-2xs overflow-hidden w-full">
      {/* Table Header Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          {title && <h2 className="text-base font-bold text-slate-900 tracking-tight">{title}</h2>}
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* Status Filter Tabs if provided */}
          {statusOptions && (
            <div className="flex flex-wrap items-center rounded-xl border border-slate-200 bg-slate-50 p-1 text-xs">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onStatusChange?.(opt.value)}
                  className={cn(
                    'px-2.5 py-1 rounded-lg font-semibold transition-all text-xs',
                    selectedStatus === opt.value
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {/* Search Input */}
          <div className="relative flex-1 sm:flex-initial min-w-[180px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 outline-none w-full sm:w-60 transition-all"
            />
          </div>

          {/* Export Actions */}
          <div className="flex items-center space-x-1 shrink-0">
            <button
              onClick={handleExportCSV}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              title="Export CSV"
              aria-label="Export table as CSV"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
              title="Print Table"
              aria-label="Print table"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>

          {actions}
        </div>
      </div>

      {/* Horizontally Scrollable Table Container */}
      <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-slate-200">
        <table className="w-full text-left text-xs whitespace-nowrap sm:whitespace-normal">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={cn(
                    'py-3 px-4 font-semibold whitespace-nowrap',
                    col.align === 'right' && 'text-right',
                    col.align === 'center' && 'text-center',
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {effectiveLoading ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-slate-400">
                  <div className="inline-block animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mb-2" />
                  <div>Loading financial records...</div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-slate-400">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-2 text-slate-400">
                    <Search className="w-5 h-5" />
                  </div>
                  <div className="font-semibold text-slate-600">{emptyMessage}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Try adjusting your filters or search keywords.</div>
                </td>
              </tr>
            ) : (
              paginatedData.map((item, rowIdx) => (
                <tr
                  key={item.id ?? item.code ?? rowIdx}
                  className="hover:bg-blue-50/30 transition-colors duration-150"
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={colIdx}
                      className={cn(
                        'py-3.5 px-4',
                        col.align === 'right' && 'text-right',
                        col.align === 'center' && 'text-center',
                        col.className
                      )}
                    >
                      {col.cell
                        ? col.cell(item)
                        : col.accessorKey
                        ? String(item[col.accessorKey] ?? '—')
                        : '—'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Responsive Pagination Footer */}
      <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-slate-500 font-medium">
        <div className="text-center sm:text-left">
          Showing <span className="font-bold text-slate-900">{filteredData.length ? (currentPage - 1) * pageSize + 1 : 0}</span> to{' '}
          <span className="font-bold text-slate-900">{Math.min(currentPage * pageSize, filteredData.length)}</span> of{' '}
          <span className="font-bold text-slate-900">{filteredData.length}</span> entries
        </div>

        <div className="flex items-center justify-center space-x-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-3 font-mono text-xs font-semibold">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
