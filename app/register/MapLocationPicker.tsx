"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  APIProvider,
  Map,
  Marker,
  useMap,
  type MapMouseEvent,
} from "@vis.gl/react-google-maps";
import { MapPin, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { geocodeAddressAction, reverseGeocodeAction } from "@/actions/geocode.action";

interface MapLocationPickerProps {
  latitude: number;
  longitude: number;
  addressQuery: string;
  onLocationChange: (lat: number, lng: number, formattedAddress?: string) => void;
}

const DEFAULT_CENTER = { lat: 40.7128, lng: -74.006 };

function MapController({ target }: { target: { lat: number; lng: number } | null }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !target) return;
    map.panTo(target);
    map.setZoom(16);
  }, [map, target]);

  return null;
}

export function MapLocationPicker({
  latitude,
  longitude,
  addressQuery,
  onLocationChange,
}: MapLocationPickerProps) {
  const [markerPos, setMarkerPos] = useState({ lat: latitude, lng: longitude });
  const [panTarget, setPanTarget] = useState<{ lat: number; lng: number } | null>(null);
  const [resolvedAddress, setResolvedAddress] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasSearched = useRef(false);
  const previousAddress = useRef<string>("");

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_API;

  const applyPosition = useCallback(
    async (lat: number, lng: number, skipReverseGeocode = false) => {
      setMarkerPos({ lat, lng });
      onLocationChange(lat, lng);

      if (skipReverseGeocode) return;

      setIsResolving(true);
      const result = await reverseGeocodeAction(lat, lng);
      setIsResolving(false);

      if (result.success && result.formattedAddress) {
        setResolvedAddress(result.formattedAddress);
        onLocationChange(lat, lng, result.formattedAddress);
      } else {
        setResolvedAddress(null);
      }
    },
    [onLocationChange]
  );

  const handleSearch = useCallback(async () => {
    if (!addressQuery.trim()) {
      setError("Please fill in the address fields first");
      return;
    }

    setError(null);
    setIsSearching(true);
    const result = await geocodeAddressAction(addressQuery);
    setIsSearching(false);

    if (!result.success || result.latitude === undefined || result.longitude === undefined) {
      setError(result.message || "Could not find this address. Please check the location details or drag the pin manually.");
      return;
    }

    const formattedAddress = result.formattedAddress || addressQuery;
    setResolvedAddress(formattedAddress);
    setPanTarget({ lat: result.latitude, lng: result.longitude });
    
    // Set marker position and update parent
    await applyPosition(result.latitude, result.longitude, true);
    onLocationChange(result.latitude, result.longitude, formattedAddress);
    
    previousAddress.current = addressQuery;
  }, [addressQuery, applyPosition, onLocationChange]);

  // Auto-search when address changes
  useEffect(() => {
    // Check if address has changed and is not empty
    if (!addressQuery.trim()) return;
    if (addressQuery === previousAddress.current) return;
    
    // Debounce the search
    const timer = setTimeout(() => {
      handleSearch();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [addressQuery, handleSearch]);

  // Initialize marker position from props
  useEffect(() => {
    setMarkerPos({ lat: latitude, lng: longitude });
  }, [latitude, longitude]);

  const handleMapClick = useCallback(
    (event: MapMouseEvent) => {
      const lat = event.detail.latLng?.lat;
      const lng = event.detail.latLng?.lng;
      if (lat === undefined || lng === undefined) return;
      setError(null);
      applyPosition(lat, lng);
    },
    [applyPosition]
  );

  const handleMarkerDragEnd = useCallback(
    (event: google.maps.MapMouseEvent) => {
      const lat = event.latLng?.lat();
      const lng = event.latLng?.lng();
      if (lat === undefined || lng === undefined) return;
      setError(null);
      applyPosition(lat, lng);
    },
    [applyPosition]
  );

  if (!apiKey) {
    return (
      <div className="w-full h-80 rounded-xl bg-red-50 border-2 border-dashed border-red-300 flex flex-col items-center justify-center text-sm text-red-600 font-medium p-4">
        <AlertCircle className="w-8 h-8 mb-2 text-red-400" />
        <p>Missing Google Maps API key</p>
        <p className="text-xs text-red-400 mt-1">Please check your environment variables</p>
      </div>
    );
  }

  return (
    <div>
      <Button
        type="button"
        onClick={handleSearch}
        disabled={isSearching}
        className="w-full mb-4 bg-emerald-500 hover:bg-emerald-600 h-14 rounded-xl text-lg font-bold shadow-sm"
      >
        {isSearching ? (
          <span className="flex items-center">
            <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Searching...
          </span>
        ) : (
          <>
            <MapPin className="mr-2 w-6 h-6" /> Update Location on Map
          </>
        )}
      </Button>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="w-full h-80 rounded-xl overflow-hidden border border-slate-200 mb-4">
        <APIProvider apiKey={apiKey}>
          <Map
            center={markerPos}
            defaultZoom={15}
            onClick={handleMapClick}
            gestureHandling="greedy"
            disableDefaultUI={false}
            className="w-full h-full"
          >
            <Marker position={markerPos} draggable onDragEnd={handleMarkerDragEnd} />
            <MapController target={panTarget} />
          </Map>
        </APIProvider>
      </div>

      <div className="p-4 border border-emerald-400 rounded-xl bg-white mb-2 flex items-start text-sm gap-2">
        <span className="font-bold text-emerald-500 shrink-0">📍 Pinned:</span>
        <span className="text-emerald-500 font-medium">
          {isResolving ? (
            "Resolving address..."
          ) : resolvedAddress ? (
            resolvedAddress
          ) : (
            `${markerPos.lat.toFixed(6)}, ${markerPos.lng.toFixed(6)}`
          )}
        </span>
      </div>
      <p className="text-xs text-slate-400">
        Lat: {markerPos.lat.toFixed(6)} · Lng: {markerPos.lng.toFixed(6)} — drag the pin or click the map to adjust
      </p>
    </div>
  );
}