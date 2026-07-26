// components/settings/ClubInfo.tsx

"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { 
  Building2, 
  X, 
  Loader2, 
  Upload,
  Star
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateVenueSettingsAction } from "@/actions/settings.action";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { VenueImage } from "@/types/Settings.type";
import { MapLocationPicker } from "@/app/register/MapLocationPicker";

interface ClubInfoProps {
  clubName: string;
  streetAddress: string;
  city: string;
  latitude: number;
  longitude: number;
  images: VenueImage[];
  onUpdate: () => void;
}

export function ClubInfo({
  clubName: initialClubName,
  streetAddress: initialStreetAddress,
  city: initialCity,
  latitude: initialLatitude,
  longitude: initialLongitude,
  images: initialImages,
  onUpdate,
}: ClubInfoProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // ── State ──
  const [clubName, setClubName] = useState(initialClubName || "");
  const [streetAddress, setStreetAddress] = useState(initialStreetAddress || "");
  const [city, setCity] = useState(initialCity || "");
  const [latitude, setLatitude] = useState(initialLatitude || 40.7128);
  const [longitude, setLongitude] = useState(initialLongitude || -74.006);
  const [images, setImages] = useState<VenueImage[]>(initialImages || []);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // ── Compute cover image ID directly (no useEffect needed) ──
  const coverImageId = images.find(img => img.is_cover)?.id || null;

  // ── Location handler ──
  const handleLocationChange = (lat: number, lng: number, formattedAddress?: string) => {
    setLatitude(lat);
    setLongitude(lng);
    
    if (formattedAddress) {
      const parts = formattedAddress.split(',');
      if (parts.length >= 2) {
        setStreetAddress(parts[0].trim());
        setCity(parts[1].trim());
      }
    }
  };

  // ── Image handlers ──
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const validFiles: File[] = [];
    const previews: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`Image ${file.name} must be less than 5MB`);
        continue;
      }
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.includes(file.type)) {
        toast.error(`Image ${file.name} must be JPG, PNG, GIF, or WEBP format`);
        continue;
      }
      validFiles.push(file);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        previews.push(event.target?.result as string);
        if (previews.length === validFiles.length) {
          setImagePreviews((prev) => [...prev, ...previews]);
        }
      };
      reader.readAsDataURL(file);
    }

    setNewImages((prev) => [...prev, ...validFiles]);
    setUploading(false);
  };

  const handleRemoveNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = async (imageId: string) => {
    // Optimistically remove from UI
    setImages((prev) => prev.filter((img) => img.id !== imageId));
    toast.info("Image will be removed when you save");
  };

  const handleSetCoverImage = (imageId: string) => {
    setImages((prev) =>
      prev.map((img) => ({
        ...img,
        is_cover: img.id === imageId,
      }))
    );
  };

  // ── Submit handler ──
  const handleSubmit = async () => {
    setLoading(true);

    const formData = new FormData();
    if (clubName) formData.append("club_name", clubName);
    if (streetAddress) formData.append("street_address", streetAddress);
    if (city) formData.append("city", city);
    if (latitude) formData.append("latitude", latitude.toString());
    if (longitude) formData.append("longitude", longitude.toString());
    
    // Add new images
    for (const image of newImages) {
      formData.append("images", image);
    }

    // Add cover image ID if set
    if (coverImageId) {
      formData.append("cover_image_id", coverImageId);
    }

    const res = await updateVenueSettingsAction(formData);

    if (res.success) {
      toast.success(res.data.message);
      if (res.data.images) {
        setImages(res.data.images);
        setNewImages([]);
        setImagePreviews([]);
      }
      onUpdate();
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  };

  const getFullAddress = () => {
    const parts = [streetAddress, city].filter(Boolean);
    return parts.join(', ');
  };

  return (
    <div className="border border-slate-200 rounded-2xl p-4 sm:p-6 lg:p-8 bg-white shadow-sm">
      <div className="flex items-center mb-6">
        <Building2 className="w-5 h-5 text-emerald-500 mr-3" />
        <h2 className="text-base sm:text-lg font-bold text-slate-900">
          Club Information
        </h2>
      </div>

      <div className="space-y-6">
        {/* Club Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Club Name
          </label>
          <Input
            value={clubName}
            onChange={(e) => setClubName(e.target.value)}
            placeholder="Enter club name"
            className="h-12"
          />
        </div>

        {/* Club Images */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Club Images
          </label>
          
          {/* Existing Images */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
              {images.map((image) => (
                <div 
                  key={image.id} 
                  className={cn(
                    "relative group aspect-square rounded-lg overflow-hidden border-2 bg-slate-50 transition-all",
                    image.is_cover ? "border-emerald-500 shadow-lg shadow-emerald-100" : "border-slate-200"
                  )}
                >
                  <Image
                    src={image.url}
                    alt={`Club image`}
                    fill
                    className="object-cover"
                  />
                  
                  {/* Cover Badge */}
                  {image.is_cover && (
                    <div className="absolute top-2 left-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 fill-white" />
                      Cover
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {!image.is_cover && (
                      <button
                        type="button"
                        onClick={() => handleSetCoverImage(image.id)}
                        className="p-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-colors"
                        title="Set as cover"
                      >
                        <Star className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(image.id)}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Order indicator */}
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                    #{image.order + 1}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* New Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
              {imagePreviews.map((preview, index) => (
                <div key={`preview-${index}`} className="relative group aspect-square rounded-lg overflow-hidden border-2 border-dashed border-emerald-300 bg-slate-50">
                  <Image
                    src={preview}
                    alt={`New image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveNewImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-emerald-500 text-white text-xs text-center py-1">
                    New
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              className="h-12 px-4"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Images
                </>
              )}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleImageSelect}
              multiple
              className="hidden"
            />
            <span className="text-xs text-slate-400">
              JPG, PNG, GIF, WEBP. Max 5MB each
            </span>
          </div>
          {images.length > 0 && (
            <p className="text-xs text-slate-400 mt-2">
              {images.length} image{images.length > 1 ? 's' : ''} • Click the star to set as cover
            </p>
          )}
        </div>

        {/* Location */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Street Address
            </label>
            <Input
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              placeholder="Enter street address"
              className="h-12"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              City
            </label>
            <Input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city"
              className="h-12"
            />
          </div>

          {/* Map Location Picker */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Pin Location on Map
            </label>
            <MapLocationPicker
              latitude={latitude}
              longitude={longitude}
              addressQuery={getFullAddress()}
              onLocationChange={handleLocationChange}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <Button
            type="button"
            variant="primary"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Club Information"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}