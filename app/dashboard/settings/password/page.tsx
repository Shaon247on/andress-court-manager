'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function ChangePasswordPage() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="h-full flex flex-col p-8 bg-white overflow-y-auto w-full">
      <div className="mb-10 flex items-center shrink-0">
        <Link href="/dashboard/settings" className="p-2 border border-slate-200 bg-white mr-4 rounded-lg hover:bg-slate-50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </Link>
        <div>
           <h1 className="text-3xl font-bold text-slate-900">Change Password</h1>
           <p className="text-slate-500 mt-1">Update your password to keep your account secure</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl pb-10">
         {/* Form Section */}
         <div className="flex-1 border border-slate-200 rounded-2xl p-8 bg-white shadow-sm">
            <div className="flex items-center mb-8">
               <Shield className="w-5 h-5 text-emerald-500 mr-3" />
               <h2 className="text-lg font-bold text-slate-900">Password Information</h2>
            </div>

            <div className="space-y-6">
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
                  <div className="relative">
                     <Input 
                        type={showCurrent ? "text" : "password"} 
                        placeholder="Enter your current password" 
                        className="h-12 pr-12" 
                     />
                     <button 
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                        onClick={() => setShowCurrent(!showCurrent)}
                     >
                        {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                     </button>
                  </div>
               </div>

               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                  <div className="relative">
                     <Input 
                        type={showNew ? "text" : "password"} 
                        placeholder="Enter your new password" 
                        className="h-12 pr-12" 
                     />
                     <button 
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                        onClick={() => setShowNew(!showNew)}
                     >
                        {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                     </button>
                  </div>
               </div>

               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
                  <div className="relative">
                     <Input 
                        type={showConfirm ? "text" : "password"} 
                        placeholder="Confirm your new password" 
                        className="h-12 pr-12" 
                     />
                     <button 
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                        onClick={() => setShowConfirm(!showConfirm)}
                     >
                        {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                     </button>
                  </div>
               </div>
            </div>

            <div className="mt-8 bg-slate-50 rounded-xl p-6 border border-slate-100">
               <div className="text-sm font-semibold text-slate-700 mb-4">Password must contain:</div>
               <div className="space-y-3">
                  <div className="flex items-center text-sm text-slate-500">
                     <div className="w-3.5 h-3.5 rounded-full bg-slate-300 mr-3"></div> At least 8 characters
                  </div>
                  <div className="flex items-center text-sm text-slate-500">
                     <div className="w-3.5 h-3.5 rounded-full bg-slate-300 mr-3"></div> One uppercase letter
                  </div>
                  <div className="flex items-center text-sm text-slate-500">
                     <div className="w-3.5 h-3.5 rounded-full bg-slate-300 mr-3"></div> One lowercase letter
                  </div>
                  <div className="flex items-center text-sm text-slate-500">
                     <div className="w-3.5 h-3.5 rounded-full bg-slate-300 mr-3"></div> One number
                  </div>
                  <div className="flex items-center text-sm text-slate-500">
                     <div className="w-3.5 h-3.5 rounded-full bg-slate-300 mr-3"></div> Passwords match
                  </div>
               </div>
            </div>

            <div className="mt-8 flex items-center space-x-4">
               <Button variant="primary" className="h-12 px-8 rounded-lg font-semibold">Update Password</Button>
               <Link href="/dashboard/settings">
                 <Button variant="ghost" className="h-12 px-6 rounded-lg font-semibold border border-slate-200">Cancel</Button>
               </Link>
            </div>
         </div>

         {/* Security Tips */}
         <div className="w-full lg:w-96 shrink-0">
            <div className="border border-slate-200 rounded-2xl p-8 bg-slate-50/50">
               <h3 className="text-lg font-bold text-slate-900 mb-6">Security Tips</h3>
               
               <ul className="space-y-4">
                  <li className="flex items-start">
                     <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-3 mt-2 shrink-0"></div>
                     <span className="text-sm text-slate-600 leading-relaxed">Use a unique password that you don't use for other websites</span>
                  </li>
                  <li className="flex items-start">
                     <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-3 mt-2 shrink-0"></div>
                     <span className="text-sm text-slate-600 leading-relaxed">Avoid using personal information in your password</span>
                  </li>
                  <li className="flex items-start">
                     <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-3 mt-2 shrink-0"></div>
                     <span className="text-sm text-slate-600 leading-relaxed">Consider using a password manager to generate and store strong passwords</span>
                  </li>
                  <li className="flex items-start">
                     <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-3 mt-2 shrink-0"></div>
                     <span className="text-sm text-slate-600 leading-relaxed">Change your password regularly, especially if you suspect unauthorized access</span>
                  </li>
               </ul>
            </div>
         </div>
      </div>
    </div>
  );
}
