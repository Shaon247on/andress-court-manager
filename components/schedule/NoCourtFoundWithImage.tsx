"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { PlusCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface NoCourtFoundWithImageProps {
  title?: string;
  description?: string;
  buttonText?: string;
  redirectUrl?: string;
  imageSrc?: string;
}

export function NoCourtFoundWithImage({
  title = "No Courts Found",
  description = "You haven't added any courts yet. Get started by creating your first court.",
  buttonText = "Add Your First Court",
  redirectUrl = "/dashboard/courts/new",
  imageSrc = "/assets/empty-court.svg",
}: NoCourtFoundWithImageProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50 hover:border-slate-300 transition-colors max-w-2xl w-full p-12">
        <div className="flex flex-col items-center">
          <h3 className="text-2xl font-bold text-slate-900">
            {title}
          </h3>
          
          <p className="text-base text-slate-500 max-w-md mx-auto mt-2">
            {description}
          </p>

          <Button
            onClick={() => router.push(redirectUrl)}
            className="mt-6 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-sm"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            {buttonText}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  );
}