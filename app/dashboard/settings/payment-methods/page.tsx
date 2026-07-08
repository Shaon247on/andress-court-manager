'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CreditCard, MoreVertical, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function PaymentMethodsPage() {
  const [cards, setCards] = useState([
    { id: '1', type: 'Visa', number: '•••• •••• •••• 4242', holder: 'Admin User', expires: '12/2026', isDefault: true },
    { id: '2', type: 'Mastercard', number: '•••• •••• •••• 5555', holder: 'Admin User', expires: '08/2025', isDefault: false },
  ]);

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const makeDefault = (id: string) => {
    setCards(cards.map(c => ({...c, isDefault: c.id === id})));
    setActiveDropdown(null);
  };

  const removeCard = (id: string) => {
    setCards(cards.filter(c => c.id !== id));
    setActiveDropdown(null);
  };

  return (
    <div className="h-full flex flex-col p-8 bg-white overflow-y-auto w-full">
      <div className="mb-10 flex justify-between items-center shrink-0">
        <div className="flex items-center">
           <Link href="/dashboard/settings" className="p-2 border border-slate-200 bg-white mr-4 rounded-lg hover:bg-slate-50 transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-700" />
           </Link>
           <div>
              <h1 className="text-3xl font-bold text-slate-900">Payment Methods</h1>
              <p className="text-slate-500 mt-1">Manage your saved payment methods</p>
           </div>
        </div>
        <Button variant="primary" className="h-10 px-5 rounded-lg text-sm font-semibold shadow-sm">
           <Plus className="w-4 h-4 mr-2" /> Add Card
        </Button>
      </div>

      <div className="max-w-4xl space-y-6 pb-10">
         {cards.map(card => (
            <div 
               key={card.id} 
               className={cn(
                  "border rounded-2xl p-6 relative transition-all",
                  card.isDefault ? "border-emerald-500 shadow-sm" : "border-slate-200"
               )}
            >
               <div className="flex justify-between items-start mb-8">
                  <div className={cn(
                     "w-12 h-10 rounded text-xl flex items-center justify-center shrink-0 border",
                     card.type === 'Visa' ? "bg-indigo-50 border-indigo-100 text-indigo-700 font-bold italic font-serif" : "bg-red-50 border-red-100 text-red-600 font-bold"
                  )}>
                     {card.type === 'Visa' ? 'VISA' : 'MC'}
                  </div>
                  
                  <div className="flex items-center">
                     {card.isDefault && (
                        <span className="px-3 py-1 bg-emerald-100 flex items-center text-emerald-700 text-xs font-bold rounded-full mr-3">
                           <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                           Default
                        </span>
                     )}
                     <div className="relative">
                        <button 
                           onClick={() => setActiveDropdown(activeDropdown === card.id ? null : card.id)}
                           className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                           <MoreVertical className="w-5 h-5" />
                        </button>

                        {/* Dropdown Menu */}
                        {activeDropdown === card.id && (
                           <div className="absolute top-10 right-0 bg-white border border-slate-200 shadow-xl rounded-xl w-48 overflow-hidden z-10 transition-all">
                              {!card.isDefault && (
                                 <button 
                                    className="w-full text-left px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 border-b border-slate-100 transition-colors"
                                    onClick={() => makeDefault(card.id)}
                                 >
                                    Set as Default
                                 </button>
                              )}
                              <button 
                                 className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                                 onClick={() => removeCard(card.id)}
                              >
                                 Remove Card
                              </button>
                           </div>
                        )}
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6">
                  <div>
                     <div className="text-xs text-slate-500 font-medium mb-1">Card Type</div>
                     <div className="text-sm font-bold text-slate-900">{card.type}</div>
                  </div>
                  <div>
                     <div className="text-xs text-slate-500 font-medium mb-1">Card Number</div>
                     <div className="text-sm font-bold text-slate-900 font-mono tracking-widest">{card.number}</div>
                  </div>
                  <div>
                     <div className="text-xs text-slate-500 font-medium mb-1">Card Holder Name</div>
                     <div className="text-sm font-medium text-slate-900">{card.holder}</div>
                  </div>
                  <div>
                     <div className="text-xs text-slate-500 font-medium mb-1">Expires</div>
                     <div className="text-sm font-medium text-slate-900">{card.expires}</div>
                  </div>
               </div>
            </div>
         ))}

         {/* Security Information Footer */}
         <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-8 mt-12">
            <h3 className="font-bold text-slate-900 mb-6 text-lg">Security Information</h3>
            <ul className="space-y-4">
               <li className="flex items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-3 mt-2 shrink-0"></div>
                  <span className="text-sm text-slate-600">All payment information is encrypted using industry-standard SSL technology</span>
               </li>
               <li className="flex items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-3 mt-2 shrink-0"></div>
                  <span className="text-sm text-slate-600">Your card details are securely stored and never shared with third parties</span>
               </li>
               <li className="flex items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-3 mt-2 shrink-0"></div>
                  <span className="text-sm text-slate-600">We use PCI-DSS compliant payment processors to handle all transactions</span>
               </li>
               <li className="flex items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-3 mt-2 shrink-0"></div>
                  <span className="text-sm text-slate-600">You can remove any saved payment method at any time</span>
               </li>
            </ul>
         </div>
      </div>
    </div>
  );
}
