'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, Check, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function AddCourtPage() {
  const [activeTab, setActiveTab] = useState<'basic' | 'pricing'>('basic');
  const [courtType, setCourtType] = useState('Indoor');
  const [gameFormat, setGameFormat] = useState('5vs5');

  const gameFormats = [
    { title: '5vs5', desc: '10 players' },
    { title: '6vs6', desc: '12 players' },
    { title: '7vs7', desc: '14 players' },
    { title: '8vs8', desc: '16 players' },
    { title: '11vs11', desc: '22 players' },
  ];

  return (
    <div className="h-full flex flex-col bg-white overflow-y-auto">
      <div className="p-8 pb-32 max-w-5xl mx-auto w-full">
        <div className="flex items-center mb-8">
          <Link href="/dashboard/courts" className="p-2 hover:bg-slate-100 rounded-full mr-4 text-slate-600 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Add New Court</h1>
            <p className="text-slate-500">Create a court listing</p>
          </div>
        </div>

        {/* Image Upload Area */}
        <div className="mb-8">
          <h3 className="font-semibold text-sm mb-3 flex items-center text-slate-800">
             <span className="w-4 h-4 bg-primary/20 text-primary rounded flex items-center justify-center mr-2 text-[10px]">🖼</span>
             Court Images
          </h3>
          <div className="border border-slate-200 rounded-lg bg-slate-50 p-6 flex flex-col items-center justify-center min-h-[300px]">
             <div className="w-full max-w-sm border-2 border-dashed border-slate-300 rounded-xl bg-white h-48 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 cursor-pointer transition-colors mb-4">
                <Upload className="w-8 h-8 mb-2" />
                <span className="text-sm font-medium">Upload Images</span>
             </div>
             <p className="text-xs text-slate-500">Upload up to 10 images. First image becomes the cover. Max 10MB per file.</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex rounded-full bg-slate-50 border border-slate-200 p-1 mb-8 max-w-2xl">
          <button 
             onClick={() => setActiveTab('basic')}
             className={`flex-1 rounded-full py-2 text-sm font-medium transition-colors ${activeTab === 'basic' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Basic Info
          </button>
          <button 
             onClick={() => setActiveTab('pricing')}
             className={`flex-1 rounded-full py-2 text-sm font-medium transition-colors ${activeTab === 'pricing' ? 'bg-primary text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Pricing
          </button>
        </div>

        {/* Forms */}
        <div className="border border-slate-200 rounded-xl p-8 bg-white max-w-4xl">
          {activeTab === 'basic' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Court Name *</label>
                <Input placeholder="Arena Pro" className="h-12" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Description</label>
                <textarea 
                  className="w-full rounded-md border border-slate-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[120px] resize-none"
                  placeholder="Describe your court, facilities, and any special features..."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Court Type *</label>
                <div className="flex border border-slate-200 rounded-full p-1 max-w-md">
                   <button 
                     onClick={() => setCourtType('Indoor')}
                     className={`flex-1 rounded-full py-2.5 text-sm font-bold transition-colors ${courtType === 'Indoor' ? 'bg-primary text-white' : 'text-slate-500 hover:text-slate-900'}`}
                   >Indoor</button>
                   <button 
                     onClick={() => setCourtType('Outdoor')}
                     className={`flex-1 rounded-full py-2.5 text-sm font-bold transition-colors ${courtType === 'Outdoor' ? 'bg-primary text-white' : 'text-slate-500 hover:text-slate-900'}`}
                   >Outdoor</button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">Game Format *</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                   {gameFormats.map((format) => (
                     <button
                        key={format.title}
                        onClick={() => setGameFormat(format.title)}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${gameFormat === format.title ? 'border-blue-400 bg-blue-50 ring-1 ring-blue-400' : 'border-slate-200 hover:border-blue-300'}`}
                     >
                       <Users className={`w-8 h-8 mb-2 ${gameFormat === format.title ? 'text-slate-800' : 'text-slate-400'}`} />
                       <div className="font-bold text-slate-900">{format.title}</div>
                       <div className="text-xs text-slate-500">{format.desc}</div>
                     </button>
                   ))}
                </div>
                <p className="text-xs text-slate-400 mt-3">Select the game format supported by this court</p>
              </div>

              <div className="pt-6 border-t border-slate-200 flex justify-between space-x-4">
                 <Button variant="outline" className="flex-1 max-w-xs h-12 rounded-full font-bold">Cancel</Button>
                 <Button 
                   variant="primary" 
                   className="flex-1 max-w-xs h-12 rounded-full font-bold opacity-50 flex items-center justify-center"
                   onClick={() => setActiveTab('pricing')}
                 >
                   <Check className="w-5 h-5 mr-2" />
                   Create Court
                 </Button>
              </div>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
               <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Price per Hour (€) *</label>
                  <div className="max-w-xs">
                     <div className="relative flex items-center">
                       <div className="absolute left-4 font-bold text-slate-400">$</div>
                       <input 
                         type="number"
                         defaultValue="50"
                         className="flex h-12 w-full rounded-full border border-slate-200 bg-white pl-8 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                       />
                     </div>
                  </div>
               </div>

               <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                 <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Pricing Preview</div>
                 <div className="flex space-x-4">
                    <div className="bg-white rounded-xl p-6 flex flex-col items-center justify-center flex-1 shadow-sm border border-slate-100">
                       <span className="text-sm font-medium text-slate-500 mb-2">1h session</span>
                       <span className="text-3xl font-black text-primary">€50</span>
                    </div>
                    <div className="bg-white rounded-xl p-6 flex flex-col items-center justify-center flex-1 shadow-sm border border-slate-100">
                       <span className="text-sm font-medium text-slate-500 mb-2">1.5h session</span>
                       <span className="text-3xl font-black text-primary">€70</span>
                    </div>
                 </div>
               </div>

               <div className="pt-6 border-t border-slate-200 flex justify-between space-x-4">
                 <Button variant="outline" className="flex-1 max-w-xs h-12 rounded-full font-bold" onClick={() => setActiveTab('basic')}>Cancel</Button>
                 <Link href="/dashboard/courts" className="flex-1 max-w-xs">
                    <Button variant="primary" className="w-full h-12 rounded-full font-bold bg-emerald-400 hover:bg-emerald-500">
                       <Check className="w-5 h-5 mr-2" />
                       Create Court
                    </Button>
                 </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
