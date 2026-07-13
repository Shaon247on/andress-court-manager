// app/dashboard/support/DirectContactSection.tsx

"use client";

import React from 'react';
import { Mail, Phone } from 'lucide-react';

export default function DirectContactSection() {
  return (
    <div className="bg-blue-50/50 rounded-2xl p-6 sm:p-8 border border-blue-100">
      <h3 className="font-bold text-slate-900 mb-2">Direct Contact</h3>
      <p className="text-sm text-slate-500 font-medium mb-6">Reach out directly for urgent support</p>

      <div className="space-y-4">
        <div className="bg-white rounded-xl p-4 flex items-center shadow-sm border border-slate-100">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-4 shrink-0">
            <Mail className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Email Support</div>
            <div className="text-xs text-slate-500">support@courtmanager.com</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 flex items-center shadow-sm border border-slate-100">
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center mr-4 shrink-0">
            <Phone className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Phone Support</div>
            <div className="text-xs text-slate-500">+1 (234) 567-890</div>
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-400 font-medium mt-6 pt-6 border-t border-blue-100">
        Available Monday to Friday, 9 AM - 6 PM EST
      </p>
    </div>
  );
}