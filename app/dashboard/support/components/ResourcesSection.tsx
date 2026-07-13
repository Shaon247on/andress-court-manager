// app/dashboard/support/ResourcesSection.tsx

"use client";

import React from 'react';
import { FileText, Shield } from 'lucide-react';

export default function ResourcesSection() {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
      <h3 className="font-bold text-slate-900 mb-5">Resources</h3>

      <div className="space-y-5">
        <div className="flex items-start">
          <FileText className="w-5 h-5 text-slate-400 mr-3 mt-0.5 shrink-0" />
          <div>
            <div className="text-sm font-bold text-slate-900 leading-tight">Terms & Policies</div>
            <div className="text-xs text-slate-500">View terms of service</div>
          </div>
        </div>
        <div className="flex items-start">
          <Shield className="w-5 h-5 text-slate-400 mr-3 mt-0.5 shrink-0" />
          <div>
            <div className="text-sm font-bold text-slate-900 leading-tight">Privacy Policy</div>
            <div className="text-xs text-slate-500">Data protection info</div>
          </div>
        </div>
      </div>
    </div>
  );
}