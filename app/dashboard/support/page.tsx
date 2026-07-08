'use client';

import React, { useState } from 'react';
import { Search, ChevronDown, ChevronRight, MessageSquare, ArrowLeft, Paperclip, Send, Mail, Phone, FileText, Shield } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const mockTickets = [
  { id: 'SP-001', user: 'John Doe', avatar: 'J', color: 'bg-emerald-500', message: 'Booking Issue', status: 'New', date: '2024-03-09' },
  { id: 'SP-002', user: 'Sarah Smith', avatar: 'S', color: 'bg-emerald-500', message: 'Payment Problem', status: 'In Progress', date: '2024-03-09' },
  { id: 'SP-003', user: 'Mike Johnson', avatar: 'M', color: 'bg-emerald-500', message: 'Account Access', status: 'New', date: '2024-03-08' },
  { id: 'SP-004', user: 'Emily Brown', avatar: 'E', color: 'bg-emerald-500', message: 'Feature Request', status: 'Resolved', date: '2024-03-08' },
  { id: 'SP-005', user: 'David Wilson', avatar: 'D', color: 'bg-emerald-500', message: 'Bug Report', status: 'In Progress', date: '2024-03-07' },
  { id: 'SP-006', user: 'Emily Brown', avatar: 'E', color: 'bg-emerald-500', message: 'Feature Request', status: 'Resolved', date: '2024-03-08' },
];

export default function SupportPage() {
  
  const [activeTicket, setActiveTicket] = useState<typeof mockTickets[0] | null>(null);

  const [filterStatus, setFilterStatus] = useState('All Status');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const filterOptions = ['All Status', 'New', 'In Progress', 'Resolved'];

  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const faqs = [
    { q: 'How do I create a new booking?', a: 'To create a new booking, go to the Schedule page and click on an empty time slot. This will open a booking form where you can add customer details, select payment type, and set the duration.' },
    { q: 'How can I add benefits to a customer?', a: 'Navigate to the Customers tab, locate the customer, and click the Gift icon to apply custom benefits.' },
    { q: 'How do I manage staff permissions?', a: 'In the Manager Team section, use the Edit button on any staff member to adjust their access levels dynamically.' },
    { q: 'When are withdrawal requests processed?', a: 'All withdrawal requests are cleared securely on a weekly basis.' },
    { q: 'How do I create a tournament?', a: 'Under the Tournaments tab, use the "Create Tournament" button to define its schedule, size, and category easily.' },
    { q: 'Can I set recurring bookings for lessons?', a: 'Currently under development, this feature will be rolling out soon!' }
  ];

  if (activeTicket) {
    return (
      <div className="h-full flex flex-col p-8 bg-slate-50/30 overflow-y-auto w-full">
         <div className="flex items-center mb-8 shrink-0">
           <button onClick={() => setActiveTicket(null)} className="p-2 border border-slate-200 bg-white mr-4 rounded hover:bg-slate-50 transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-700" />
           </button>
           <div>
              <h1 className="text-2xl font-bold text-slate-900">Unable to complete court booking</h1>
              <p className="text-slate-500 text-sm mt-0.5">Ticket #TK-001</p>
           </div>
         </div>

         {/* Initial Request Block */}
         <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">
            <div className="flex justify-between items-start mb-6">
               <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-3 ${activeTicket.color}`}>
                     {activeTicket.avatar}
                  </div>
                  <div>
                     <div className="font-bold text-slate-900 text-sm">{activeTicket.user}</div>
                     <div className="text-slate-500 text-xs">{activeTicket.user.toLowerCase().replace(' ', '.')}@example.com</div>
                  </div>
               </div>
               <div className="text-slate-400 text-sm font-medium">{activeTicket.date}</div>
            </div>
            
            <h3 className="font-bold text-slate-900 mb-2">Unable to complete court booking</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
               I am trying to book Court 1 for tomorrow at 3 PM, but the system keeps showing an error message. I have tried multiple times but the booking is not going through. Can you please help me resolve this issue?
            </p>
         </div>

         <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Conversation Thread */}
            <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-6 w-full">
               <h3 className="text-lg font-bold text-slate-900 mb-6">Conversation</h3>
               
               <div className="space-y-6 mb-8">
                  <div className="flex flex-col items-start">
                     <div className="flex items-center mb-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-2 text-xs ${activeTicket.color}`}>
                           {activeTicket.avatar}
                        </div>
                        <span className="font-semibold text-slate-900 text-sm mr-2">{activeTicket.user}</span>
                        <span className="text-xs text-slate-400 font-medium">2024-03-09 10:30 AM</span>
                     </div>
                     <div className="ml-10 bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-sm p-4 text-slate-700 text-sm leading-relaxed max-w-[90%]">
                        I am trying to book Court 1 for tomorrow at 3 PM, but the system keeps showing an error message. I have tried multiple times but the booking is not going through. Can you please help me resolve this issue?
                     </div>
                  </div>

                  <div className="flex flex-col items-end">
                     <div className="flex items-center mb-2 flex-row-reverse">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ml-2 text-xs bg-emerald-500">
                           S
                        </div>
                        <span className="font-semibold text-slate-900 text-sm ml-2">Support Team</span>
                        <span className="text-xs text-slate-400 font-medium">2024-03-09 11:00 AM</span>
                     </div>
                     <div className="mr-10 bg-emerald-50 border border-emerald-100 rounded-2xl rounded-tr-sm p-4 text-slate-700 text-sm leading-relaxed max-w-[90%]">
                        Thank you for reaching out. We are looking into this issue. Could you please provide a screenshot of the error message?
                     </div>
                  </div>

                  <div className="flex flex-col items-start">
                     <div className="flex items-center mb-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-2 text-xs ${activeTicket.color}`}>
                           {activeTicket.avatar}
                        </div>
                        <span className="font-semibold text-slate-900 text-sm mr-2">{activeTicket.user}</span>
                        <span className="text-xs text-slate-400 font-medium">2024-03-09 11:15 AM</span>
                     </div>
                     <div className="ml-10 bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-sm p-4 text-slate-700 text-sm leading-relaxed max-w-[90%]">
                        Sure, I have attached the screenshot showing the error.
                     </div>
                  </div>
               </div>

               <div className="mt-8 border border-slate-200 rounded-xl overflow-hidden focus-within:border-emerald-400 focus-within:ring-1 focus-within:ring-emerald-400 transition-all">
                  <textarea 
                     placeholder="Type your reply..." 
                     className="w-full h-32 p-4 resize-none bg-white focus:outline-none text-sm"
                  ></textarea>
                  <div className="flex justify-between items-center p-3 bg-white border-t border-slate-100">
                     <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors">
                        <Paperclip className="w-5 h-5" />
                     </button>
                     <Button variant="primary" className="h-10 px-6 rounded-lg font-semibold text-sm shadow-sm hover:shadow">
                        <Send className="w-4 h-4 mr-2 -ml-1" /> Send Reply
                     </Button>
                  </div>
               </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="w-full lg:w-80 bg-slate-50/50 border border-slate-200 rounded-2xl p-6 shrink-0">
               <h3 className="text-lg font-bold text-slate-900 mb-6">Quick Actions</h3>
               <div className="space-y-4">
                  <div className="p-4 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-emerald-300 transition-colors">
                     <span className="text-sm font-medium text-slate-700">User Problem Solved</span>
                  </div>
                  <div className="p-4 bg-red-500 border border-red-600 rounded-xl cursor-pointer shadow-sm shadow-red-500/20 hover:bg-red-600 transition-colors">
                     <span className="text-sm font-medium text-white">Close Message</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-8 bg-white overflow-y-auto w-full">
      <div className="mb-6 flex flex-col space-y-1 shrink-0">
        <h1 className="text-3xl font-bold text-slate-900">Support</h1>
        <p className="text-slate-500">Manage customer support and get help</p>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-8 mb-12 shrink-0">

            <div className="flex-1 space-y-8">
               {/* FAQ */}
               <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                  <div className="flex items-center mb-6">
                     <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mr-3 text-emerald-600 font-bold">?</div>
                     <h2 className="text-lg font-bold text-slate-900">Frequently Asked Questions</h2>
                  </div>
                  
                  <div className="space-y-4">
                     {faqs.map((faq, index) => (
                        <div key={index} className="border border-slate-200 rounded-xl overflow-hidden shadow-sm transition-all">
                           <button 
                              className="w-full flex justify-between items-center p-5 bg-white hover:bg-slate-50 transition-colors focus:outline-none"
                              onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                           >
                              <span className="font-bold text-slate-800 text-[15px]">{faq.q}</span>
                              <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform", expandedFaq === index && "rotate-180")} />
                           </button>
                           {expandedFaq === index && (
                              <div className="px-5 pb-5 pt-1 text-slate-500 text-[15px] leading-relaxed bg-white/50 border-t border-slate-100">
                                 {faq.a}
                              </div>
                           )}
                        </div>
                     ))}
                  </div>
               </div>

               {/* Contact Form */}
               <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm mb-12">
                  <div className="flex items-center mb-6">
                     <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center mr-3">
                        <Send className="w-4 h-4 text-emerald-500" />
                     </div>
                     <h2 className="text-lg font-bold text-slate-900">Contact Admin Support</h2>
                  </div>

                  <div className="space-y-5 flex flex-col">
                     <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2">Subject</label>
                        <Input placeholder="Brief description of your issue" className="h-12 bg-white" />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-700 mb-2">Your Message</label>
                        <textarea 
                           placeholder="Describe your issue or question..." 
                           className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent h-40 resize-none"
                        />
                     </div>
                     <Button variant="primary" className="h-12 px-6 rounded-lg font-bold text-sm shadow-md mt-2">
                        <Send className="w-4 h-4 mr-2" /> Send to Admin
                     </Button>
                  </div>
               </div>
            </div>

            <div className="w-full lg:w-96 shrink-0 space-y-6">
               <div className="bg-blue-50/50 rounded-2xl p-8 border border-blue-100">
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

                  <p className="text-xs text-slate-400 font-medium mt-6 pt-6 border-t border-blue-100">Available Monday to Friday, 9 AM - 6 PM EST</p>
               </div>

               <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
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

               <div className="bg-white rounded-2xl p-6 border border-slate-200">
                  <div className="flex text-xs space-x-2"><span className="text-slate-500 font-medium">Version:</span> <span className="font-bold text-slate-900">1.0.0</span></div>
                  <div className="flex text-xs space-x-2 mt-2"><span className="text-slate-500 font-medium">Last Updated:</span> <span className="font-bold text-slate-900">April 8, 2026</span></div>
               </div>
            </div>
         </div>

<div className="flex-1 flex flex-col shrink-0 mb-8">
<h2 className="text-xl font-bold text-slate-900 mb-6">Customer Support Tickets</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 shrink-0">
              <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col">
                <div className="text-sm text-slate-500 font-medium mb-3">Total Tickets</div>
                <div className="text-3xl font-bold text-emerald-500">342</div>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col">
                <div className="text-sm text-slate-500 font-medium mb-3">Open</div>
                <div className="text-3xl font-bold text-red-500">28</div>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col">
                <div className="text-sm text-slate-500 font-medium mb-3">In Progress</div>
                <div className="text-3xl font-bold text-orange-400">16</div>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col">
                <div className="text-sm text-slate-500 font-medium mb-3">Resolved</div>
                <div className="text-3xl font-bold text-emerald-500">298</div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6 shrink-0">
               <div className="w-full max-w-2xl bg-slate-50/50 rounded-lg">
                  <Input icon={<Search className="w-4 h-4"/>} placeholder="Search tickets..." className="h-12 bg-transparent border-slate-200" />
               </div>
               
               <div className="relative ml-4">
                  <button 
                    className="px-5 py-3 h-12 bg-white border border-slate-200 rounded-lg flex items-center shadow-sm text-sm font-medium text-slate-700"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                     {filterStatus} <ChevronDown className="w-4 h-4 ml-3 text-slate-400" />
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl w-48 py-2 z-20">
                       {filterOptions.map(opt => (
                         <button 
                            key={opt}
                            className={`w-full text-left px-5 py-2.5 text-sm hover:bg-slate-50 border-b border-slate-50 last:border-0 font-medium`}
                            style={{
                               color: opt === 'New' ? '#ef4444' : 
                                      opt === 'In Progress' ? '#f59e0b' : 
                                      opt === 'Resolved' ? '#10b981' : '#1e293b'
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

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex-1 shrink-0 mb-8">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-white border-b border-slate-200 text-xs text-slate-900 tracking-wide font-bold">
                    <tr>
                      <th className="px-6 py-5">Support ID</th>
                      <th className="px-6 py-5">User</th>
                      <th className="px-6 py-5">Message</th>
                      <th className="px-6 py-5">Status</th>
                      <th className="px-6 py-5">Date</th>
                      <th className="px-6 py-5 border-l border-slate-100 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {mockTickets.map((ticket, i) => (
                       <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                         <td className="px-6 py-4 font-medium text-emerald-500">{ticket.id}</td>
                         <td className="px-6 py-4">
                            <div className="flex items-center">
                               <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs mr-3 ${ticket.color}`}>
                                 {ticket.avatar}
                               </div>
                               <span className="text-slate-700 font-medium">{ticket.user}</span>
                            </div>
                         </td>
                         <td className="px-6 py-4 text-slate-600">{ticket.message}</td>
                         <td className="px-6 py-4 font-medium" style={{color: ticket.status === 'New' ? '#ef4444' : ticket.status === 'In Progress' ? '#f59e0b' : '#10b981'}}>
                            {ticket.status}
                         </td>
                         <td className="px-6 py-4 text-slate-500">{ticket.date}</td>
                         <td className="px-6 py-4 border-l border-slate-100 text-center">
                            <button 
                               onClick={() => setActiveTicket(ticket)}
                               className="px-5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-full text-xs shadow-sm transition-colors"
                            >
                               Reply
                            </button>
                         </td>
                       </tr>
                     ))}
                  </tbody>
                </table>
              </div>
            </div>
         </div>
    </div>
  );
}
