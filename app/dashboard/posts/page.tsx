'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ChevronDown, MoreVertical, Heart, Pin, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';

type Post = {
  id: string;
  title: string;
  type: 'Announcement' | 'Promotion' | 'Maintenance' | 'Update' | 'Milestone';
  content: string;
  author: string;
  timestamp: string;
  likes: number;
  tags: string[];
  isPinned?: boolean;
};

const mockPosts: Post[] = [
  {
    id: 'p-1',
    title: 'Special Weekend Discount — 20% Off!',
    type: 'Announcement',
    author: 'Arena Pro Management',
    timestamp: '2 hours ago',
    likes: 45,
    tags: ['#discount', '#weekend'],
    isPinned: true,
    content: 'Book your weekend slots now and get 20% off on all court bookings. Valid for March 10-12. Limited slots available! Use code WEEKEND20 at checkout.'
  },
  {
    id: 'p-2',
    title: 'Court Maintenance Completed',
    type: 'Maintenance',
    author: 'Arena Pro Management',
    timestamp: '2 days ago',
    likes: 45,
    tags: ['#maintenance', '#update'],
    content: 'Indoor Court Premium maintenance has been completed successfully. New artificial turf installed and lighting upgraded. Now available for bookings!'
  },
  {
    id: 'p-3',
    title: '🎉 1000 Bookings Milestone Reached!',
    type: 'Milestone',
    author: 'Arena Pro Management',
    timestamp: '3 days ago',
    likes: 45,
    tags: ['#milestone', '#celebration'],
    content: "We're thrilled to announce that we've reached 1000 successful bookings! Thank you to all our amazing players and teams for your continued support."
  }
];

const getTypeColor = (type: Post['type']) => {
  switch (type) {
    case 'Announcement': return 'bg-blue-100 text-blue-700';
    case 'Promotion': return 'bg-amber-100 text-amber-700';
    case 'Maintenance': return 'bg-cyan-100 text-cyan-700';
    case 'Update': return 'bg-green-100 text-green-700';
    case 'Milestone': return 'bg-purple-100 text-purple-700 border-purple-200';
    default: return 'bg-slate-100 text-slate-700';
  }
};

const getBoxStyle = (type: Post['type']) => {
  switch (type) {
    case 'Announcement': return 'border-blue-300';
    case 'Maintenance': return 'border-blue-300';
    case 'Milestone': return 'border-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.1)]';
    default: return 'border-slate-200';
  }
};

export default function PostsPage() {
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const filterOptions = ['All Status', 'Maintenance', 'Announcement', 'Review', 'Milestone'];

  return (
    <div className="h-full flex flex-col p-8 bg-white overflow-y-auto w-full">
      <div className="mb-8 flex flex-col space-y-1 shrink-0">
        <div className="flex justify-between items-start">
           <div>
              <h1 className="text-3xl font-bold text-slate-900">All Posts & Announcements</h1>
              <p className="text-slate-500 mt-1">Engage with your facility community</p>
           </div>
           <Link href="/dashboard/posts/create" className="px-5 py-2.5 bg-emerald-50 text-emerald-600 rounded-full font-semibold border border-emerald-200 hover:bg-emerald-100 transition-colors">
              New Post
           </Link>
        </div>
      </div>

      <div className="flex items-center justify-between mb-8">
         <div className="w-80">
            <Input icon={<Search className="w-4 h-4"/>} placeholder="Search posts..." />
         </div>
         
         <div className="relative">
            <button 
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg flex items-center shadow-sm text-sm font-medium text-slate-700"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
               {filterStatus} <ChevronDown className="w-4 h-4 ml-3 text-slate-400" />
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl w-48 py-2 z-20">
                 {filterOptions.map(opt => (
                   <button 
                      key={opt}
                      className="w-full text-left px-5 py-2.5 text-sm hover:bg-slate-50 border-b border-slate-50 last:border-0 font-medium"
                      style={{
                        color: opt === 'Maintenance' ? '#10b981' : 
                               opt === 'Announcement' ? '#3b82f6' : 
                               opt === 'Review' ? '#f59e0b' : 
                               opt === 'Milestone' ? '#a855f7' : '#1e293b'
                      }}
                      onClick={() => { setFilterStatus(opt); setIsDropdownOpen(false); }}
                   >
                     {opt}
                   </button>
                 ))}
              </div>
            )}
         </div>
      </div>

      <div className="space-y-5">
         {mockPosts.map(post => (
            <div key={post.id} className={`rounded-xl p-6 border ${getBoxStyle(post.type)} relative`}>
               <div className="absolute right-4 top-4">
                  <div className="relative">
                     <button onClick={() => setOpenMenuId(openMenuId === post.id ? null : post.id)} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg">
                        <MoreVertical className="w-5 h-5" />
                     </button>
                     {openMenuId === post.id && (
                        <div className="absolute top-full right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl w-40 py-2 z-20">
                           <button className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 font-semibold text-slate-700 flex items-center">
                              <span className="w-4 h-4 mr-2 border-2 border-current rounded-sm flex items-center justify-center text-[10px] bg-blue-50 text-blue-600 border-blue-600 -rotate-45 block transform">✎</span> Edit Post
                           </button>
                           <button className="w-full text-left px-4 py-2.5 text-sm hover:bg-red-50 font-semibold text-red-600 flex items-center border-t border-slate-50">
                              <span className="w-4 h-4 mr-2 border-2 border-current rounded-sm flex items-center justify-center text-[10px] bg-red-50 text-red-600 border-red-600">🗑</span> Delete Post
                           </button>
                        </div>
                     )}
                  </div>
               </div>

               <div className="flex px-2 mb-4">
                  <div className={`w-12 h-12 rounded-full shrink-0 mr-4 flex items-center justify-center text-xl font-bold bg-gradient-to-br ${post.type === 'Announcement' ? 'from-blue-400 to-blue-600 text-white' : post.type === 'Maintenance' ? 'from-slate-400 to-slate-600 text-white' : 'from-purple-400 to-fuchsia-500 text-white'}`}>
                    {post.type === 'Announcement' ? '📢' : post.type === 'Maintenance' ? '🔧' : '🎉'}
                  </div>
                  <div>
                     <h3 className="text-lg font-bold text-slate-900 flex items-center leading-tight">
                        {post.title} 
                        {post.isPinned && <Pin className="w-4 h-4 text-blue-500 ml-2 rotate-45" />}
                     </h3>
                     <div className="flex items-center mt-1.5 flex-wrap gap-2 text-sm text-slate-500">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getTypeColor(post.type)}`}>
                           {post.type}
                        </span>
                        {post.type === 'Maintenance' && (
                           <span className="flex items-center text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                              Indoor Court Premium
                           </span>
                        )}
                        <span className="flex items-center ml-1">
                           {post.author} • {post.timestamp}
                        </span>
                     </div>
                  </div>
               </div>

               <p className="text-slate-800 ml-[4.5rem] pr-8 mb-4 leading-relaxed text-[15px]">
                  {post.content}
               </p>

               <div className="ml-[4.5rem] flex flex-wrap gap-2 mb-5">
                  {post.tags.map(tag => (
                     <span key={tag} className="text-blue-500 hover:text-blue-600 cursor-pointer font-medium text-[13px]">{tag}</span>
                  ))}
               </div>

               <div className="ml-[4.5rem] flex items-center text-slate-400 text-sm font-semibold border-t border-slate-100 pt-3">
                  <Heart className="w-4 h-4 mr-1.5 hover:text-red-500 cursor-pointer transition-colors" /> {post.likes}
               </div>
            </div>
         ))}
      </div>

      <div className="mt-8 flex justify-center">
         <button className="px-10 py-3 rounded-full border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors">
            Load More Posts
         </button>
      </div>
    </div>
  );
}
