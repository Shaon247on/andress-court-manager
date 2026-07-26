"use server";

interface GeocodeResult {
  success: boolean;
  latitude?: number;
  longitude?: number;
  formattedAddress?: string;
  message?: string;
}

export async function geocodeAddressAction(address: string): Promise<GeocodeResult> {
  if (!address || !address.trim()) {
    return { success: false, message: "Address is empty" };
  }

  try {
    // Get the API key from environment
    const apiKey = process.env.GOOGLE_MAP_API || process.env.NEXT_PUBLIC_GOOGLE_MAP_API;
    
    if (!apiKey) {
      console.error("Google Maps API key is missing");
      return { 
        success: false, 
        message: "Google Maps API key is not configured" 
      };
    }

    // Encode the address for URL
    const encodedAddress = encodeURIComponent(address.trim());
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;

    console.log("Geocoding address:", address);
    console.log("Using API key:", apiKey.substring(0, 5) + "..."); // Log partial key for debugging

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      console.error("Geocoding API response not OK:", res.status, res.statusText);
      return { 
        success: false, 
        message: `Geocoding service error: ${res.status}` 
      };
    }

    const data = await res.json();
    console.log("Geocoding response status:", data.status);

    if (data.status === "OK" && data.results && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry.location;
      return {
        success: true,
        latitude: lat,
        longitude: lng,
        formattedAddress: data.results[0].formatted_address || address,
      };
    } else if (data.status === "ZERO_RESULTS") {
      return { 
        success: false, 
        message: "Address not found. Please check the address and try again." 
      };
    } else if (data.status === "REQUEST_DENIED") {
      console.error("Geocoding request denied:", data.error_message);
      return { 
        success: false, 
        message: "API key is invalid or not authorized for geocoding" 
      };
    } else if (data.status === "INVALID_REQUEST") {
      console.error("Invalid geocoding request:", data.error_message);
      return { 
        success: false, 
        message: "Invalid address format. Please check the address." 
      };
    } else if (data.status === "OVER_QUERY_LIMIT") {
      return { 
        success: false, 
        message: "Too many requests. Please try again later." 
      };
    } else {
      console.error("Geocoding error:", data.status, data.error_message);
      return { 
        success: false, 
        message: data.error_message || "Failed to geocode address" 
      };
    }
  } catch (error) {
    console.error("Geocoding exception:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Geocoding request failed" 
    };
  }
}

export async function reverseGeocodeAction(lat: number, lng: number): Promise<GeocodeResult> {
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return { success: false, message: "Invalid coordinates" };
  }

  try {
    const apiKey = process.env.GOOGLE_MAP_API || process.env.NEXT_PUBLIC_GOOGLE_MAP_API;
    
    if (!apiKey) {
      console.error("Google Maps API key is missing");
      return { 
        success: false, 
        message: "Google Maps API key is not configured" 
      };
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      return { 
        success: false, 
        message: `Geocoding service error: ${res.status}` 
      };
    }

    const data = await res.json();

    if (data.status === "OK" && data.results && data.results.length > 0) {
      return {
        success: true,
        latitude: lat,
        longitude: lng,
        formattedAddress: data.results[0].formatted_address,
      };
    } else {
      return { 
        success: false, 
        message: data.error_message || "Could not reverse geocode location" 
      };
    }
  } catch (error) {
    console.error("Reverse geocoding exception:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Reverse geocoding failed" 
    };
  }
}