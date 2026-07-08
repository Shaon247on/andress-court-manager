'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const router = useRouter();
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard');
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Form Section */}
      <div className="flex w-full xl:w-[50%] items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-sm space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Forgot Password?</h1>
            <p className="mt-2 text-slate-500">No worries! Enter your email and we'll send you reset instructions.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Email address</label>
                <Input type="email" placeholder="Enter your email" required />
              </div>
            </div>


            <Button type="submit" className="w-full h-12 text-base">
              Send Reset Instructions
            </Button>
          </form>

        </div>
      </div>

      {/* Right Image Section */}
      <div className="hidden xl:block xl:w-[50%] relative bg-slate-900">
        <Image
          src="/assets/login_image.png"
          alt="Court view"
          fill
          className="object-cover opacity-80"
          priority
          referrerPolicy="no-referrer"
        />
        {/* Overlay a subtle dark gradient if needed or just logo center */}
        {/* <div className="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none">
           <h2 className="text-white text-7xl font-black drop-shadow-2xl tracking-tighter italic opacity-95 flex items-center">
             Athlon<span className="text-blue-500 ml-1">Go</span>
           </h2>
        </div> */}
      </div>
    </div>
  );
}
