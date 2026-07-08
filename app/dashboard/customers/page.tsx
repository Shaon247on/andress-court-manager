'use client';

import React, { useState } from 'react';
import { Search, Gift, Edit2, Ban, UserPlus, X, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

const mockCustomers = [
  { id: 1, name: 'John Doe', country: 'USA', phone: '+1234567890', email: 'john@example.com', totalGames: 45, benefits: 0 },
  { id: 2, name: 'Jane Smith', country: 'UK', phone: '+1234567891', email: 'jane@example.com', totalGames: 32, benefits: 0 },
  { id: 3, name: 'Mike Johnson', country: 'Canada', phone: '+1234567892', email: 'mike@example.com', totalGames: 28, benefits: 0 },
  { id: 4, name: 'Sarah Williams', country: 'Australia', phone: '+1234567893', email: 'sarah@example.com', totalGames: 56, benefits: 1 },
  { id: 5, name: 'David Brown', country: 'USA', phone: '+1234567894', email: 'david@example.com', totalGames: 19, benefits: 0 },
];

export default function CustomersPage() {
  const [filterType, setFilterType] = useState<'All' | 'With Benefits'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isBenefitModalOpen, setIsBenefitModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<typeof mockCustomers[0] | null>(null);

  const [benefitType, setBenefitType] = useState<'Percentage' | 'Fixed Amount'>('Percentage');
  const [benefitValue, setBenefitValue] = useState('10');
  const [applyOn, setApplyOn] = useState('Split Payment Only');
  const [usageDay, setUsageDay] = useState('2');
  const [usageMonth, setUsageMonth] = useState('20');
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredCustomers = mockCustomers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          customer.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          customer.phone.includes(searchQuery);
    const matchesFilter = filterType === 'All' || (filterType === 'With Benefits' && customer.benefits > 0);
    return matchesSearch && matchesFilter;
  });

  const openBenefitModal = (user: typeof mockCustomers[0]) => {
    setSelectedUser(user);
    setIsBenefitModalOpen(true);
    setBenefitType('Percentage');
    setBenefitValue('10');
    setApplyOn('Split Payment Only');
  };

  return (
    <div className="h-full flex flex-col p-8 bg-white overflow-y-auto">
      <div className="mb-6 flex flex-col space-y-1 shrink-0">
        <h1 className="text-3xl font-bold text-slate-900">Customers</h1>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0 shrink-0">
        <div className="flex space-x-4 items-center">
          <div className="w-80">
            <Input 
              icon={<Search className="w-4 h-4"/>} 
              placeholder="Search by name, email, or phone..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex border border-slate-200 rounded-md overflow-hidden bg-slate-50 p-1">
             <button 
               onClick={() => setFilterType('All')}
               className={`px-4 py-2 rounded text-sm font-medium transition-colors ${filterType === 'All' ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-200'}`}
             >
               All Customers
             </button>
             <button 
               onClick={() => setFilterType('With Benefits')}
               className={`px-4 py-2 rounded text-sm font-medium transition-colors ${filterType === 'With Benefits' ? 'bg-primary text-white' : 'text-slate-600 hover:bg-slate-200'}`}
             >
               With Benefits
             </button>
          </div>
        </div>

        <Link href="/dashboard/customers/add">
          <Button variant="primary" className="h-10 px-4 cursor-pointer">
            <UserPlus className="w-4 h-4 mr-2" /> Add Customer
          </Button>
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-white border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Total Games</th>
                <th className="px-6 py-4">Benefits</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{customer.name}</div>
                    <div className="text-xs text-slate-500">{customer.country}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{customer.phone}</td>
                  <td className="px-6 py-4 text-slate-600">{customer.email}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                      {customer.totalGames} games
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {customer.benefits > 0 ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        <Gift className="w-3 h-3 mr-1" /> {customer.benefits} active
                      </span>
                    ) : (
                      <span className="text-slate-400 font-medium">None</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                       <button onClick={() => openBenefitModal(customer)} className="text-primary hover:text-primary-hover transition-colors">
                         <Gift className="w-5 h-5" />
                       </button>
                       <button className="text-blue-600 hover:text-blue-800 transition-colors">
                         <Edit2 className="w-5 h-5" />
                       </button>
                       <button className="text-red-500 hover:text-red-700 transition-colors">
                         <Ban className="w-5 h-5" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Benefit Modal */}
      <AnimatePresence>
        {isBenefitModalOpen && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsBenefitModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl shadow-xl w-full max-w-[400px] relative z-10 flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-slate-100 shrink-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Add Benefit</h2>
                    <p className="text-slate-500 text-sm mt-1">For {selectedUser.name}</p>
                  </div>
                  <button onClick={() => setIsBenefitModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-5 overflow-y-auto">
                 <div>
                   <label className="block text-sm font-semibold text-slate-700 mb-3">Benefit Type</label>
                   <div className="flex items-center space-x-6">
                      <label className="flex items-center cursor-pointer group">
                        <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center mr-2 transition-colors", benefitType === 'Percentage' ? "border-primary" : "border-slate-400 group-hover:border-slate-600")}>
                           {benefitType === 'Percentage' && <div className="w-2 h-2 rounded-full bg-primary" />}
                        </div>
                        <input type="radio" className="hidden" checked={benefitType === 'Percentage'} onChange={() => setBenefitType('Percentage')} />
                        <span className="text-sm font-medium text-slate-900">Percentage</span>
                      </label>
                      <label className="flex items-center cursor-pointer group">
                        <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center mr-2 transition-colors", benefitType === 'Fixed Amount' ? "border-primary" : "border-slate-400 group-hover:border-slate-600")}>
                           {benefitType === 'Fixed Amount' && <div className="w-2 h-2 rounded-full bg-primary" />}
                        </div>
                        <input type="radio" className="hidden" checked={benefitType === 'Fixed Amount'} onChange={() => setBenefitType('Fixed Amount')} />
                        <span className="text-sm font-medium text-slate-900">Fixed Amount</span>
                      </label>
                   </div>
                 </div>

                 <div>
                   <label className="block text-sm font-semibold text-slate-700 mb-1.5">Value ({benefitType === 'Percentage' ? '%' : '$'})</label>
                   <Input 
                     type="number" 
                     value={benefitValue}
                     onChange={(e) => setBenefitValue(e.target.value)}
                     className="h-10"
                   />
                 </div>

                 <div className="relative">
                   <label className="block text-sm font-semibold text-slate-700 mb-1.5">Apply On</label>
                   <div 
                     className="flex items-center justify-between h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm cursor-pointer hover:border-slate-300 transition-colors"
                     onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                   >
                     <span>{applyOn}</span>
                     <ChevronDown className="w-4 h-4 text-slate-500" />
                   </div>
                   
                   {isDropdownOpen && (
                     <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg z-20 overflow-hidden py-1">
                        {['Split Payment Only', 'Whole Court Only', 'Both'].map(option => (
                           <div 
                             key={option}
                             className="px-4 py-2.5 text-sm cursor-pointer hover:bg-slate-50 border-b border-slate-50 last:border-0"
                             onClick={() => { setApplyOn(option); setIsDropdownOpen(false); }}
                           >
                             {option}
                           </div>
                        ))}
                     </div>
                   )}
                 </div>

                 <div>
                   <label className="block text-sm font-semibold text-slate-700 mb-1.5">Usage Per Day</label>
                   <Input 
                     type="number" 
                     value={usageDay}
                     onChange={(e) => setUsageDay(e.target.value)}
                     className="h-10"
                   />
                 </div>

                 <div>
                   <label className="block text-sm font-semibold text-slate-700 mb-1.5">Usage Per Month</label>
                   <Input 
                     type="number" 
                     value={usageMonth}
                     onChange={(e) => setUsageMonth(e.target.value)}
                     className="h-10"
                   />
                 </div>
              </div>

              <div className="p-6 border-t border-slate-100 flex justify-end space-x-3 shrink-0">
                 <Button variant="secondary" onClick={() => setIsBenefitModalOpen(false)}>
                   Cancel
                 </Button>
                 <Button variant="primary" onClick={() => setIsBenefitModalOpen(false)}>
                   Add Benefit
                 </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
