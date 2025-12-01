// hooks/useAddListing.ts
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient"; // make sure you have supabase client configured
import { ListingFormType } from "@/components/AddListing"; // adjust path

export const useAddListing = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const addListing = async (data: ListingFormType) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      // Example: Insert listing into "listings" table
      const { data: insertedData, error: supabaseError } = await supabase
        .from("listings")
        .insert([
          {
            main_title: data.basicInfo.mainTitle,
            category: data.basicInfo.category,
            keywords: data.basicInfo.keywords,
            description: data.basicInfo.description,
            price_rows: data.priceSection.priceRows,
            person_price_rows: data.priceSection.personPriceRows,
            location: {
              street: data.location.street,
              city: data.location.city,
              address: data.location.address,
              zip_code: data.location.zipCode,
              latitude: data.location.latitude,
              longitude: data.location.longitude,
            },
            media: data.media,
            overview: data.overview,
            features: data.features,
          },
        ])
        .select();

      if (supabaseError) {
        setError(supabaseError.message);
        return;
      }

      setSuccess(true);
      console.log("Listing added:", insertedData);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return { addListing, loading, error, success };
};
