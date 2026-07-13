// app/dashboard/support/FAQSection.tsx

"use client";

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const faqs = [
  { q: 'How do I create a new booking?', a: 'To create a new booking, go to the Schedule page and click on an empty time slot. This will open a booking form where you can add customer details, select payment type, and set the duration.' },
  { q: 'How can I add benefits to a customer?', a: 'Navigate to the Customers tab, locate the customer, and click the Gift icon to apply custom benefits.' },
  { q: 'How do I manage staff permissions?', a: 'In the Manager Team section, use the Edit button on any staff member to adjust their access levels dynamically.' },
  { q: 'When are withdrawal requests processed?', a: 'All withdrawal requests are cleared securely on a weekly basis.' },
  { q: 'How do I create a tournament?', a: 'Under the Tournaments tab, use the "Create Tournament" button to define its schedule, size, and category easily.' },
  { q: 'Can I set recurring bookings for lessons?', a: 'Currently under development, this feature will be rolling out soon!' }
];

export default function FAQSection() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mr-3 text-emerald-600 font-bold">?</div>
        <h2 className="text-base sm:text-lg font-bold text-slate-900">Frequently Asked Questions</h2>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-slate-200 rounded-xl overflow-hidden shadow-sm transition-all">
            <button
              className="w-full flex justify-between items-center p-4 sm:p-5 bg-white hover:bg-slate-50 transition-colors focus:outline-none"
              onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
            >
              <span className="font-bold text-slate-800 text-sm sm:text-[15px] text-left">{faq.q}</span>
              <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform shrink-0 ml-2", expandedFaq === index && "rotate-180")} />
            </button>
            {expandedFaq === index && (
              <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-1 text-slate-500 text-sm sm:text-[15px] leading-relaxed bg-white/50 border-t border-slate-100">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}