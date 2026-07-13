// app/dashboard/courts/[id]/edit/EditCourt.tsx

"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, Check, Users, X, Loader2, Info, Settings, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateCourtAction } from "@/actions/court-manager-court.action";
import type { CourtDetail } from "@/types/CourtManagerCourt.type";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Image from "next/image";

const gameFormats = [
  { title: "5v5", desc: "10 players" },
  { title: "6v6", desc: "12 players" },
  { title: "7v7", desc: "14 players" },
  { title: "8v8", desc: "16 players" },
  { title: "11v11", desc: "22 players" },
];

interface EditCourtProps {
  court: CourtDetail;
}

export default function EditCourt({ court }: EditCourtProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"basic" | "setup" | "pricing">("basic");

  // Form state - with proper fallback values
  const [name, setName] = useState(court?.name || "");
  const [description, setDescription] = useState(court?.description || "");
  const [courtType, setCourtType] = useState<"indoor" | "outdoor" | "both">(
    court?.court_type || "indoor"
  );
  const [selectedFormats, setSelectedFormats] = useState<string[]>(court?.game_formats || []);
  const [price, setPrice] = useState(court?.price_per_hour || "");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(court?.images_url || null);

  // Debug logging
  useEffect(() => {
    console.log("EditCourt - Court data:", court);
    console.log("EditCourt - Court ID:", court?.id);
  }, [court]);

  const toggleFormat = (format: string) => {
    setSelectedFormats((prev) =>
      prev.includes(format)
        ? prev.filter((f) => f !== format)
        : [...prev, format]
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be less than 10MB");
      return;
    }

    setImage(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeNewImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeExistingImage = () => {
    setExistingImage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Court name is required");
      return;
    }
    if (selectedFormats.length === 0) {
      toast.error("At least one game format is required");
      return;
    }
    if (!price) {
      toast.error("Price per hour is required");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("court_type", courtType);
    formData.append("game_formats", JSON.stringify(selectedFormats));
    formData.append("price_per_hour", price);

    if (image) {
      formData.append("image", image);
    }

    // Log the court ID being used
    console.log("Updating court with ID:", court.id);
    
    const res = await updateCourtAction(court.id, formData);
    if (res.success) {
      toast.success(res.data.message);
      router.push(`/dashboard/courts/${court.id}`);
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case "basic":
        return <Info className="w-4 h-4 mr-1.5" />;
      case "setup":
        return <Settings className="w-4 h-4 mr-1.5" />;
      case "pricing":
        return <DollarSign className="w-4 h-4 mr-1.5" />;
      default:
        return null;
    }
  };

  const getTabLabel = (tab: string) => {
    switch (tab) {
      case "basic":
        return "Basic Info";
      case "setup":
        return "Court Setup";
      case "pricing":
        return "Pricing";
      default:
        return tab;
    }
  };

  // If court data is missing, show error
  if (!court) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Court Not Found</h2>
          <p className="text-slate-500 mb-4">The court you&apos;re trying to edit doesn&apos;t exist.</p>
          <Link href="/dashboard/courts">
            <Button variant="primary">Back to Courts</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white overflow-y-auto">
      <div className="p-4 sm:p-6 lg:p-8 pb-32 max-w-5xl mx-auto w-full">
        <div className="flex items-center mb-6 sm:mb-8">
          <Link
            href={`/dashboard/courts/${court.id}`}
            className="p-2 hover:bg-slate-100 rounded-full mr-3 sm:mr-4 text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Edit Court
            </h1>
            <p className="text-slate-500 text-sm">
              Update {court.name}&apos;s listing
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Image Upload Area - Single Image */}
          <div className="mb-6 sm:mb-8">
            <h3 className="font-semibold text-sm mb-3 flex items-center text-slate-800">
              <span className="w-4 h-4 bg-primary/20 text-primary rounded flex items-center justify-center mr-2 text-[10px]">
                🖼
              </span>
              Court Image
            </h3>
            <div className="border border-slate-200 rounded-lg bg-slate-50 p-4 sm:p-6">
              {(imagePreview || existingImage) ? (
                <div className="relative aspect-video max-h-64 rounded-lg overflow-hidden border border-slate-200 bg-white">
                  <Image
                    src={imagePreview || existingImage || ""}
                    alt="Court preview"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <button
                    type="button"
                    onClick={imagePreview ? removeNewImage : removeExistingImage}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-video max-h-64 rounded-lg border-2 border-dashed border-slate-300 bg-white flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <Upload className="w-10 h-10 mb-2" />
                  <span className="text-sm font-medium">Upload Image</span>
                  <p className="text-xs text-slate-400 mt-1">
                    JPG, PNG or GIF • Max 10MB
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif"
                onChange={handleImageUpload}
                className="hidden"
              />
              <p className="text-xs text-slate-500 mt-3">
                {imagePreview
                  ? "New image will replace existing"
                  : existingImage
                  ? "Current image displayed"
                  : "Upload a cover image for your court"}
              </p>
            </div>
          </div>

          {/* Tabs - Now with three tabs */}
          <div className="flex rounded-full bg-slate-50 border border-slate-200 p-1 mb-6 sm:mb-8 max-w-2xl">
            {["basic", "setup", "pricing"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab as "basic" | "setup" | "pricing")}
                className={cn(
                  "flex-1 rounded-full py-2 text-sm font-medium transition-colors flex items-center justify-center",
                  activeTab === tab
                    ? "bg-primary text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                {getTabIcon(tab)}
                {getTabLabel(tab)}
              </button>
            ))}
          </div>

          {/* Forms */}
          <div className="border border-slate-200 rounded-xl p-4 sm:p-6 lg:p-8 bg-white max-w-4xl">
            {/* Basic Info Tab */}
            {activeTab === "basic" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    Court Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-md border border-slate-200 p-3 sm:p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[100px] sm:min-h-[120px] resize-none"
                    placeholder="Describe your court, facilities, and any special features..."
                  />
                </div>

                <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
                  <Link
                    href={`/dashboard/courts/${court.id}`}
                    className="sm:flex-1 max-w-xs"
                  >
                    <Button
                      variant="outline"
                      className="w-full h-12 rounded-full font-bold"
                    >
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    type="button"
                    variant="primary"
                    className="sm:flex-1 max-w-xs h-12 rounded-full font-bold flex items-center justify-center"
                    onClick={() => setActiveTab("setup")}
                  >
                    <Check className="w-5 h-5 mr-2" />
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {/* Court Setup Tab */}
            {activeTab === "setup" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    Court Type <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2 border border-slate-200 rounded-full p-1 max-w-md">
                    <button
                      type="button"
                      onClick={() => setCourtType("indoor")}
                      className={cn(
                        "flex-1 rounded-full py-2.5 text-sm font-bold transition-colors min-w-[60px]",
                        courtType === "indoor"
                          ? "bg-primary text-white"
                          : "text-slate-500 hover:text-slate-900"
                      )}
                    >
                      Indoor
                    </button>
                    <button
                      type="button"
                      onClick={() => setCourtType("outdoor")}
                      className={cn(
                        "flex-1 rounded-full py-2.5 text-sm font-bold transition-colors min-w-[60px]",
                        courtType === "outdoor"
                          ? "bg-primary text-white"
                          : "text-slate-500 hover:text-slate-900"
                      )}
                    >
                      Outdoor
                    </button>
                    <button
                      type="button"
                      onClick={() => setCourtType("both")}
                      className={cn(
                        "flex-1 rounded-full py-2.5 text-sm font-bold transition-colors min-w-[60px]",
                        courtType === "both"
                          ? "bg-primary text-white"
                          : "text-slate-500 hover:text-slate-900"
                      )}
                    >
                      Both
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    Select whether the court is indoors, outdoors, or both
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    Game Format <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
                    {gameFormats.map((format) => (
                      <button
                        key={format.title}
                        type="button"
                        onClick={() => toggleFormat(format.title)}
                        className={cn(
                          "flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border transition-all",
                          selectedFormats.includes(format.title)
                            ? "border-blue-400 bg-blue-50 ring-1 ring-blue-400"
                            : "border-slate-200 hover:border-blue-300"
                        )}
                      >
                        <Users
                          className={cn(
                            "w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2",
                            selectedFormats.includes(format.title)
                              ? "text-slate-800"
                              : "text-slate-400"
                          )}
                        />
                        <div className="font-bold text-slate-900 text-sm sm:text-base">
                          {format.title}
                        </div>
                        <div className="text-xs text-slate-500">
                          {format.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 mt-3">
                    Select the game format supported by this court
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="sm:flex-1 max-w-xs h-12 rounded-full font-bold"
                    onClick={() => setActiveTab("basic")}
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    className="sm:flex-1 max-w-xs h-12 rounded-full font-bold flex items-center justify-center"
                    onClick={() => setActiveTab("pricing")}
                  >
                    <Check className="w-5 h-5 mr-2" />
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {/* Pricing Tab */}
            {activeTab === "pricing" && (
              <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-2">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    Price per Hour ($) <span className="text-red-500">*</span>
                  </label>
                  <div className="max-w-xs">
                    <div className="relative flex items-center">
                      <div className="absolute left-4 font-bold text-slate-400">
                        $
                      </div>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        step="0.01"
                        min="0"
                        className="flex h-12 w-full rounded-full border border-slate-200 bg-white pl-8 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-6">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                    Pricing Preview
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <div className="bg-white rounded-xl p-4 sm:p-6 flex flex-col items-center justify-center flex-1 min-w-[120px] shadow-sm border border-slate-100">
                      <span className="text-sm font-medium text-slate-500 mb-2">
                        1h session
                      </span>
                      <span className="text-2xl sm:text-3xl font-black text-primary">
                        ${price || "0.00"}
                      </span>
                    </div>
                    <div className="bg-white rounded-xl p-4 sm:p-6 flex flex-col items-center justify-center flex-1 min-w-[120px] shadow-sm border border-slate-100">
                      <span className="text-sm font-medium text-slate-500 mb-2">
                        1.5h session
                      </span>
                      <span className="text-2xl sm:text-3xl font-black text-primary">
                        ${price ? (parseFloat(price) * 1.5).toFixed(2) : "0.00"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="sm:flex-1 max-w-xs h-12 rounded-full font-bold"
                    onClick={() => setActiveTab("setup")}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="sm:flex-1 max-w-xs h-12 rounded-full font-bold bg-emerald-400 hover:bg-emerald-500"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}