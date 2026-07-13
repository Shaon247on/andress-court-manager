"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Pencil, MapPin, Star, Users, Layers, DollarSign, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { CourtDetail } from '@/types/CourtManagerCourt.type';
import { format } from 'date-fns';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface CourtDetailsProps {
  court: CourtDetail;
}

const StatusBadge = ({ status }: { status: string }) => {
  const statusMap: Record<string, { label: string; className: string }> = {
    active: { label: 'Active', className: 'bg-green-100 text-green-700 border-green-200' },
    under_maintenance: { label: 'Maintenance', className: 'bg-orange-100 text-orange-700 border-orange-200' },
    closed: { label: 'Closed', className: 'bg-red-100 text-red-700 border-red-200' },
  };
  const { label, className } = statusMap[status] || statusMap.active;
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${className}`}>
      {label}
    </span>
  );
};

const GameFormatBadge = ({ format }: { format: string }) => {
  return (
    <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
      {format}
    </span>
  );
};

export default function CourtDetails({ court }: CourtDetailsProps) {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Parse images_url if it's a string (could be a JSON array or a single URL)
  const getImageUrls = (): string[] => {
    if (!court.images_url) return [];
    
    // If it's already an array
    if (Array.isArray(court.images_url)) {
      return court.images_url;
    }
    
    // If it's a string, try to parse as JSON
    if (typeof court.images_url === 'string') {
      try {
        const parsed = JSON.parse(court.images_url);
        if (Array.isArray(parsed)) {
          return parsed;
        }
        // If it's a single URL string
        return [court.images_url];
      } catch {
        // If it's a single URL string
        return [court.images_url];
      }
    }
    
    return [];
  };

  const images = getImageUrls();
  const hasImages = images.length > 0;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-y-auto">
      <div className="p-4 sm:p-6 lg:p-8 pb-16 max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center">
            <Link
              href="/dashboard/courts"
              className="p-2 hover:bg-slate-100 rounded-full mr-4 text-slate-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
            <div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{court.name}</h1>
                <StatusBadge status={court.status} />
              </div>
              {/* <p className="text-slate-500 flex items-center gap-1 mt-1 text-sm">
                <MapPin className="w-3.5 h-3.5" />
                {court.location}
              </p> */}
            </div>
          </div>
          <Link href={`/dashboard/courts/${court.id}/edit`} className="w-full sm:w-auto">
            <Button variant="primary" className="h-10 w-full sm:w-auto">
              <Pencil className="w-4 h-4 mr-2" />
              Edit Court
            </Button>
          </Link>
        </div>

        {/* Image Gallery */}
        <div className="relative border border-slate-200 rounded-lg bg-slate-50 h-48 sm:h-64 mb-8 overflow-hidden">
          {hasImages ? (
            <>
              <Image
                src={images[currentImageIndex]}
                alt={`${court.name} - Image ${currentImageIndex + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                priority
                onError={(e) => {
                  // If image fails to load, show placeholder
                  e.currentTarget.style.display = 'none';
                }}
              />
              
              {/* Image counter */}
              <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full">
                {currentImageIndex + 1} / {images.length}
              </div>

              {/* Navigation arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={previousImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Image dots indicator */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={cn(
                        "w-2 h-2 rounded-full transition-colors",
                        index === currentImageIndex
                          ? "bg-white"
                          : "bg-white/50 hover:bg-white/75"
                      )}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-slate-400">
              <div className="text-4xl mb-2">🏟️</div>
              <p className="text-sm font-medium">No images available</p>
            </div>
          )}
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Card className="border border-slate-200 shadow-none">
            <CardContent className="p-4 sm:p-6">
              <div className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                Price / hr
              </div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900">
                ${court.price_per_hour}
              </div>
            </CardContent>
          </Card>
          <Card className="border border-slate-200 shadow-none">
            <CardContent className="p-4 sm:p-6">
              <div className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Bookings
              </div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900">{court.bookings}</div>
            </CardContent>
          </Card>
          <Card className="border border-slate-200 shadow-none">
            <CardContent className="p-4 sm:p-6">
              <div className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                Revenue
              </div>
              <div className="text-xl sm:text-2xl font-bold text-green-600">
                ${parseFloat(court.revenue).toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card className="border border-slate-200 shadow-none">
            <CardContent className="p-4 sm:p-6">
              <div className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-1">
                <Star className="w-4 h-4" />
                Rating
              </div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-1">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 fill-amber-400" />
                {court.rating.average.toFixed(1)}
                <span className="text-sm font-medium text-slate-400 ml-1">({court.rating.count})</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Details */}
        <div className="border border-slate-200 rounded-xl p-4 sm:p-8 bg-white mb-8">
          <h3 className="font-bold text-slate-900 mb-4">Court Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Type</div>
              <div className="font-medium text-slate-900 capitalize">{court.court_type}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Surface</div>
              <div className="font-medium text-slate-900 capitalize">{court.surface}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Environment</div>
              <div className="font-medium text-slate-900 flex items-center gap-1.5 capitalize">
                <Layers className="w-4 h-4 text-slate-400" />
                {court.court_type}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Game Formats</div>
              <div className="flex flex-wrap gap-1.5">
                {court.game_formats.map((format) => (
                  <GameFormatBadge key={format} format={format} />
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Sport</div>
              <div className="font-medium text-slate-900 capitalize">{court.sport}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Created</div>
              <div className="font-medium text-slate-900">{formatDate(court.created_at)}</div>
            </div>
          </div>
          {court.description && (
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Description</div>
              <p className="text-sm text-slate-700 leading-relaxed">{court.description}</p>
            </div>
          )}
        </div>

        {/* Pricing Preview */}
        {court.pricing_preview && court.pricing_preview.length > 0 && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-6">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Pricing Preview</div>
            <div className="flex flex-wrap gap-4">
              {court.pricing_preview.map((pricing, index) => (
                <div key={index} className="bg-white rounded-xl p-4 sm:p-6 flex flex-col items-center justify-center flex-1 min-w-[120px] shadow-sm border border-slate-100">
                  <span className="text-xs sm:text-sm font-medium text-slate-500 mb-2">{pricing.duration} session</span>
                  <span className="text-xl sm:text-2xl font-black text-primary">${pricing.price}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}