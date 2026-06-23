'use client'
import { Transaction } from '@/types'

interface TransactionTableProps {
  transactions: Transaction[]
  filter: 'all' | 'settled' | 'expired' | 'failed'
  onFilterChange: (filter: 'all' | 'settled' | 'expired' | 'failed') => void
  onExportCSV: () => void
}

export default function TransactionTable({ transactions, filter, onFilterChange, onExportCSV }: TransactionTableProps) {
  const filtered = transactions.filter((tx) => filter === 'all' || tx.status === filter)

  const statusBadge = (status: Transaction['status']) => {
    const classes: Record<string, string> = {
      settled: 'status-settled',
      pending: 'status-pending',
      expired: 'status-expired',
      failed: 'status-failed',
    }
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${classes[status]}`}>
        {status}
      </span>
    )
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(date)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Filter tabs */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div className="flex gap-1">
          {(['all', 'settled', 'expired', 'failed'] as const).map((f) => (
            <button key={f} onClick={() => onFilterChange(f)} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${filter === f ? 'bg-blue-primary text-white' : 'text-slate-500 hover:bg-slate-100'}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <button onClick={onExportCSV} className="text-sm text-blue-primary font-medium hover:underline">Export CSV</button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 text-left text-xs text-slate-500 font-medium">
              <th className="px-6 py-3">Ref ID</th>
              <th className="px-6 py-3">Payer</th>
              <th className="px-6 py-3">Remark</th>
              <th className="px-6 py-3">Date & Time</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-400 text-sm">No transactions found</td></tr>
            ) : filtered.map((tx) => (
              <tr key={tx.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-sm font-medium text-navy">{tx.id}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{tx.payerName || '—'}</td>
                <td className="px-6 py-4 text-sm font-mono text-slate-500">{tx.remarkCode}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{formatDate(tx.createdAt)}</td>
                <td className="px-6 py-4 text-sm font-semibold text-navy">{tx.amount ? `₹${tx.amount.toFixed(2)}` : '—'}</td>
                <td className="px-6 py-4">{statusBadge(tx.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}