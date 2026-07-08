'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const postTypes = [
  { id: 'Announcement', icon: '📢', title: 'Announcement', desc: 'Share news & updates' },
  { id: 'Promotion', icon: '🎉', title: 'Promotion', desc: 'Discounts & offers' },
  { id: 'Update', icon: '📝', title: 'Update', desc: 'General updates' },
  { id: 'Milestone', icon: '🏆', title: 'Milestone', desc: 'Achievements' },
];

export default function CreatePostPage() {
  const [selectedType, setSelectedType] = useState('Announcement');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  return (
    <div className="h-full flex flex-col p-8 bg-slate-50/50 overflow-y-auto w-full">
      <div className="mb-8 flex items-center shrink-0">
        <Link href="/dashboard/posts" className="p-2 mr-4 rounded-full hover:bg-slate-200 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
           <h1 className="text-3xl font-bold text-slate-900">Create Post</h1>
           <p className="text-slate-500 mt-1">Share updates with players</p>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">
         <div className="flex-1 space-y-8">
            
            {/* Post Type Selector */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
               <label className="block text-sm font-bold text-slate-900 mb-5">Post Type *</label>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {postTypes.map(type => (
                     <div 
                        key={type.id}
                        onClick={() => setSelectedType(type.id)}
                        className={cn(
                           "flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all",
                           selectedType === type.id 
                              ? "border-emerald-400 bg-emerald-50/30" 
                              : "border-slate-100 hover:border-slate-200 bg-white"
                        )}
                     >
                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-xl mr-4 shrink-0">
                           {type.icon}
                        </div>
                        <div>
                           <div className="font-bold text-slate-900 text-sm">{type.title}</div>
                           <div className="text-xs text-slate-500 mt-0.5">{type.desc}</div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Content Editor */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
               <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Title *</label>
                  <Input 
                     placeholder="Enter an engaging post title..." 
                     className="h-12 bg-slate-50/50" 
                     value={title}
                     onChange={(e) => setTitle(e.target.value)}
                     maxLength={100}
                  />
                  <div className="text-[10px] text-slate-400 font-medium mt-1.5">{title.length}/100 characters</div>
               </div>

               <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Description</label>
                  <textarea 
                     placeholder="Write your post content here... Be engaging and informative!" 
                     className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary h-40 resize-none"
                     value={content}
                     onChange={(e) => setContent(e.target.value)}
                     maxLength={500}
                  />
                  <div className="text-[10px] text-slate-400 font-medium mt-1.5">{content.length}/500 characters</div>
               </div>
            </div>

            {/* Media Upload */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
               <label className="block text-sm font-bold text-slate-900 mb-4">Media (Optional)</label>
               <div className="w-64 h-40 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors relative overflow-hidden group">
                  <div className="absolute inset-0 bg-yellow-400 flex flex-col items-center justify-center pointer-events-none p-4 text-center">
                     <span className="text-[40px] leading-none mb-2">📣</span>
                     <span className="font-black text-2xl uppercase italic tracking-tighter mix-blend-color-burn rotate-[-5deg]">IMPORTANT<br/>ANNOUNCEMENT!</span>
                  </div>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity">
                     <ImageIcon className="w-8 h-8 text-white mb-2" />
                     <span className="text-white font-bold text-sm">Replace Image</span>
                  </div>
               </div>
               <p className="text-xs text-slate-500 mt-3 font-medium">Upload up to 4 images (max 10MB each)</p>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4 pt-4 pb-12">
               <Button variant="secondary" className="px-10 h-12 rounded-full font-bold w-48 shadow-sm">
                  Cancel
               </Button>
               <Button variant="primary" className="px-10 h-12 rounded-full font-bold flex-1 shadow-md hover:shadow-lg transition-shadow">
                  <CheckCircle className="w-4 h-4 mr-2" /> Publish Now
               </Button>
            </div>
         </div>

         {/* Sidebar Checklist */}
         <div className="xl:w-80 shrink-0">
            <div className="bg-slate-50 rounded-2xl p-6 sticky top-8">
               <h3 className="font-bold text-slate-900 mb-4 text-sm">Publish Checklist</h3>
               <ul className="space-y-3">
                  <li className="flex items-center text-sm font-medium text-slate-700">
                     <CheckCircle className="w-4 h-4 mr-3 text-emerald-500 fill-emerald-100" /> Post type selected
                  </li>
                  <li className="flex items-center text-sm font-medium text-slate-700">
                     <CheckCircle className={cn("w-4 h-4 mr-3", title.length > 0 ? "text-emerald-500 fill-emerald-100" : "text-slate-300 fill-slate-100")} /> Title added
                  </li>
                  <li className="flex items-center text-sm font-medium text-slate-700">
                     <CheckCircle className={cn("w-4 h-4 mr-3", content.length > 0 ? "text-emerald-500 fill-emerald-100" : "text-slate-300 fill-slate-100")} /> Content written
                  </li>
                  <li className="flex items-center text-sm font-medium text-slate-700">
                     <CheckCircle className="w-4 h-4 mr-3 text-emerald-500 fill-emerald-100" /> Court(s) selected
                  </li>
               </ul>
            </div>
         </div>
      </div>
    </div>
  );
}
