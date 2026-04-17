'use client';

import { CreditCard, CheckCircle, AlertCircle } from 'lucide-react';

interface PaymentSummaryProps {
  total: number;
  paid: number;
  currency?: string;
}

export function PaymentSummary({ total, paid, currency = 'KES' }: PaymentSummaryProps) {
  const remaining = total - paid;
  const percentage = (paid / total) * 100;

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#0F4C5C]/10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-[#0F4C5C] flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-[#F28C00]" />
          Payment Summary
        </h2>
        <span className="text-sm text-[#1E1E1E]/50">{percentage}% Paid</span>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="h-2 bg-[#0F4C5C]/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#F28C00] rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Payment Details */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#1E1E1E]/60">Total Contract Value</span>
          <span className="font-semibold text-[#0F4C5C]">{currency} {total.toLocaleString()}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#1E1E1E]/60 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            Amount Paid
          </span>
          <span className="font-semibold text-green-600">{currency} {paid.toLocaleString()}</span>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-[#0F4C5C]/10">
          <span className="text-sm text-[#1E1E1E]/60 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#F28C00]" />
            Remaining Balance
          </span>
          <span className="font-bold text-[#F28C00]">{currency} {remaining.toLocaleString()}</span>
        </div>
      </div>

      {/* Payment Button */}
      {remaining > 0 && (
        <button className="w-full mt-4 py-2 bg-[#F28C00] text-white rounded-lg hover:bg-[#F28C00]/90 transition-colors">
          Make Payment
        </button>
      )}
    </div>
  );
}