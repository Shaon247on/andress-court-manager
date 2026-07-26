import React from 'react';
import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Section - Forms */}
      <div className="flex w-full xl:w-[50%] items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-sm">
          {children}
        </div>
      </div>
      
      {/* Right Section - Image */}
      <div className="hidden xl:block xl:w-[50%] relative bg-slate-900">
        <Image
          src="/assets/login_image.png"
          alt="Court view"
          fill
          className="object-cover opacity-80"
          priority
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
}