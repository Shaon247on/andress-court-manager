// app/dashboard/support/CreateTicketForm.tsx

"use client";

import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createTicketAction } from '@/actions/manager-support.action';
import type { SupportCategory } from '@/types/ManagerSupport.type';
import { toast } from 'sonner';

interface CreateTicketFormProps {
  categories: SupportCategory[];
}

export default function CreateTicketForm({ categories }: CreateTicketFormProps) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('other');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim()) {
      toast.error('Please enter a subject');
      return;
    }
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setLoading(true);
    const res = await createTicketAction({ subject, message, category });
    if (res.success) {
      toast.success(res.data.message);
      setSubject('');
      setMessage('');
      setCategory('other');
      // Refresh the page to show new ticket
      window.location.reload();
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center mr-3">
          <Send className="w-4 h-4 text-emerald-500" />
        </div>
        <h2 className="text-base sm:text-lg font-bold text-slate-900">Contact Admin Support</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">Subject</label>
          <Input
            placeholder="Brief description of your issue"
            className="h-12 bg-white"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">Category</label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-12 bg-white">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">Your Message</label>
          <textarea
            placeholder="Describe your issue or question..."
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent h-32 resize-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          className="h-12 px-6 rounded-lg font-bold text-sm shadow-md mt-2 w-full sm:w-auto"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" /> Send to Admin
            </>
          )}
        </Button>
      </div>
    </form>
  );
}