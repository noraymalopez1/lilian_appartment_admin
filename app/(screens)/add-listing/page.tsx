"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChevronRight, Upload, X, Image as ImageIcon } from "lucide-react";
import { useListings } from "@/hooks/useListings";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";

const listingSchema = z.object({
  title: z.string().min(5, "Title is required (min 5 chars)"),
  category: z.enum(["apartment", "attraction"]),
  tags: z.string().min(1, "Tags are required (comma separated)"),
  description: z.string().min(20, "Description is required (min 20 chars)"),
  price_adult: z.number().min(0, "Adult price is required").optional(),
  price_child: z.number().min(0, "Child price is required").optional(),
  fee_per_person: z.number().min(0).optional(),
  fee_per_booking: z.number().min(0).optional(),
  whole_apartment_price: z.number().min(0).optional(),
  images: z.array(z.string()).optional(),
  zipcode: z.string().min(3, "Zipcode is required"),
  city: z.string().min(2, "City is required"),
  location: z.string().min(5, "Location/Address is required"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  guest_capacity: z.number().optional(),
  bathrooms_count: z.number().optional(),
  bedrooms_count: z.number().optional(),
  living_area: z.number().optional(),
  is_parking_available: z.boolean().optional(),
  distance: z.number().optional(),
  accessibility_points: z.array(z.string()).optional(),
  rules: z.array(z.string()).optional(),
  status: z.enum(["open", "closed"]).optional(),
  features: z.array(z.string()).optional(),
});

type ListingFormData = z.infer<typeof listingSchema>;

const allFeatures = [
  "Pool",
  "Hot Tub",
  "Gym",
  "Bar",
  "Family Room",
  "Smoking Allowed",
  "Breakfast Included",
  "Coffee Maker",
  "Security System",
  "Wifi Access",
  "Pet Friendly",
  "Balcony",
];

export default function AddListingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const { addListing, updateListing, loading } = useListings();

  const listingId = searchParams.get("id");
  const isEditMode = searchParams.get("edit") === "true";

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [adultPrice, setAdultPrice] = useState<string>("");
  const [childPrice, setChildPrice] = useState<string>("");
  const [feePerPerson, setFeePerPerson] = useState<string>("");
  const [feePerBooking, setFeePerBooking] = useState<string>("");
  const [wholeApartmentPrice, setWholeApartmentPrice] = useState<string>("");
  const [useWholeApartment, setUseWholeApartment] = useState(false);
  const [accessibilityPoints, setAccessibilityPoints] = useState<string[]>([""]);
  const [rules, setRules] = useState<string[]>([""]);
  const [submitting, setSubmitting] = useState(false);
  const [loadingListing, setLoadingListing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm<ListingFormData>({
    resolver: isEditMode ? undefined : zodResolver(listingSchema),
    defaultValues: {
      category: undefined,
      is_parking_available: false,
      status: "open",
      features: [],
    },
  });

  const category = watch("category");

  useEffect(() => {
    if (category) {
      setSelectedCategory(category);
    }
  }, [category]);

  const fetchListingData = useCallback(async () => {
    if (!isEditMode || !listingId) return;

    try {
      setLoadingListing(true);
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("uid", listingId)
        .single();

      if (error) {
        console.error("Error fetching listing:", error);
        alert("Failed to load listing data");
        return;
      }

      if (data) {
        reset({
          title: data.title,
          category: data.category,
          tags: data.tags,
          description: data.description,
          zipcode: data.zipcode,
          city: data.city,
          location: data.location,
          latitude: data.latitude,
          longitude: data.longitude,
          guest_capacity: data.guest_capacity,
          bathrooms_count: data.bathrooms_count,
          bedrooms_count: data.bedrooms_count,
          living_area: data.living_area,
          is_parking_available: data.is_parking_available,
          distance: data.distance,
          accessibility_points: data.accessibility_points,
          rules: data.rules,
          status: data.status,
          features: data.features,
        });

        setSelectedCategory(data.category);

        if (data.price) {
          setAdultPrice(data.price.adult?.toString() || "");
          setChildPrice(data.price.child?.toString() || "");
        }

        if (data.fees) {
          setFeePerPerson(data.fees.perPerson?.toString() || "");
          setFeePerBooking(data.fees.perBooking?.toString() || "");
        }

        if (data.whole_apartment_price) {
          setWholeApartmentPrice(data.whole_apartment_price.toString());
          setUseWholeApartment(true);
        }

        if (data.accessibility_points && data.accessibility_points.length > 0) {
          setAccessibilityPoints(data.accessibility_points);
        }

        if (data.rules && data.rules.length > 0) {
          setRules(data.rules);
        }

        if (data.images && data.images.length > 0) {
          setUploadedImageUrls(data.images);
          setImagePreviewUrls(data.images);
        }
      }
    } catch (error) {
      console.error("Error fetching listing:", error);
      alert("Failed to load listing data");
    } finally {
      setLoadingListing(false);
    }
  }, [isEditMode, listingId, supabase, reset]);

  useEffect(() => {
    fetchListingData();
  }, [fetchListingData]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    setSelectedFiles((prev) => [...prev, ...fileArray]);

    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrls((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    // Remove from preview URLs
    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index));

    // Remove from uploaded URLs (for existing images)
    setUploadedImageUrls((prev) => prev.filter((_, i) => i !== index));

    // Only remove from selectedFiles if this is a newly selected file
    // Check if we have more preview URLs than selected files (means we have existing images)
    const existingImageCount = uploadedImageUrls.length;
    if (index >= existingImageCount) {
      // This is a newly selected file
      const fileIndex = index - existingImageCount;
      setSelectedFiles((prev) => prev.filter((_, i) => i !== fileIndex));
    }
  };

  const uploadImagesToSupabase = async (): Promise<string[]> => {
    if (selectedFiles.length === 0) return [];

    setUploadingImages(true);
    const urls: string[] = [];

    try {
      for (const file of selectedFiles) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `listings/${fileName}`;

        const { data, error } = await supabase.storage
          .from("lillians")
          .upload(filePath, file);

        if (error) {
          console.error("Upload error:", error);
          throw new Error(`Failed to upload ${file.name}: ${error.message}`);
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("lillians").getPublicUrl(filePath);

        urls.push(publicUrl);
      }

      setUploadedImageUrls(urls);
      return urls;
    } catch (error) {
      console.error("Error uploading images:", error);
      throw error;
    } finally {
      setUploadingImages(false);
    }
  };

  const onSubmit = async (data: ListingFormData) => {
    console.log("Form submitted!", data);
    console.log("Form errors:", errors);
    console.log("Is Edit Mode:", isEditMode);
    console.log("Listing ID:", listingId);
    try {
      setSubmitting(true);

      let imageUrls: string[] = [...uploadedImageUrls];

      if (selectedFiles.length > 0) {
        const newlyUploadedUrls = await uploadImagesToSupabase();
        imageUrls = [...uploadedImageUrls, ...newlyUploadedUrls];
      }

      const priceObject = (adultPrice || childPrice) ? {
        adult: parseFloat(adultPrice) || 0,
        child: parseFloat(childPrice) || 0,
      } : undefined;

      const feesObject = (feePerPerson || feePerBooking) ? {
        perPerson: parseFloat(feePerPerson) || 0,
        perBooking: parseFloat(feePerBooking) || 0,
      } : undefined;

      const { price_adult, price_child, fee_per_person, fee_per_booking, whole_apartment_price, ...restData } = data;
      const formattedData = {
        ...restData,
        price: priceObject,
        fees: feesObject,
        whole_apartment_price: useWholeApartment && wholeApartmentPrice ? parseFloat(wholeApartmentPrice) : undefined,
        images: imageUrls.length > 0 ? imageUrls : undefined,
        accessibility_points: accessibilityPoints.filter((point) => point.trim() !== ""),
        rules: rules.filter((rule) => rule.trim() !== ""),
      };

      if (isEditMode && listingId) {
        await updateListing(listingId, formattedData);
        alert("Listing updated successfully!");
      } else {
        await addListing(formattedData);
        alert("Listing added successfully!");
      }

      router.push("/dashboard");
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'adding'} listing:`, error);
      alert(`Failed to ${isEditMode ? 'update' : 'add'} listing. Please try again.`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingListing) {
    return (
      <div className="w-full max-w-5xl mx-auto pt-12 px-4 pb-12 flex justify-center items-center h-64">
        <p className="text-gray-600">Loading listing data...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto pt-12 px-4 pb-12">
      <div>
        <h2 className="text-3xl font-bold">{isEditMode ? "Edit Listing" : "Add Listing"}</h2>
        <p className="flex items-center gap-2 text-gray-600">
          <a href="/dashboard" className="text-blue-600 hover:underline">
            Management
          </a>
          <ChevronRight size={16} /> {isEditMode ? "Edit Listing" : "Add Listing"}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit, (errors) => {
        console.log("Form validation failed!", errors);
        alert("Form has validation errors. Check console for details.");
      })} className="mt-8 space-y-6">
        {/* Basic Information */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-10">
          <h2 className="text-2xl font-bold mb-6">Basic Information</h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Listing Title *
              </label>
              <input
                type="text"
                id="title"
                {...register("title")}
                placeholder="Enter listing title"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  id="category"
                  {...register("category")}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a category</option>
                  <option value="apartment">Apartment</option>
                  <option value="attraction">Attraction</option>
                </select>
                {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>}
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma separated) *
                </label>
                <input
                  type="text"
                  id="tags"
                  {...register("tags")}
                  placeholder="e.g. luxury, modern, downtown"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.tags && <p className="text-xs text-red-500 mt-1">{errors.tags.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                {...register("description")}
                rows={4}
                placeholder="Enter detailed description"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.description && (
                <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                {...register("status")}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-10">
          <h2 className="text-2xl font-bold mb-6">Location</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Street Address *
              </label>
              <input
                type="text"
                id="location"
                {...register("location")}
                placeholder="e.g. 123 Main Street"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location.message}</p>}
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                id="city"
                {...register("city")}
                placeholder="e.g. New York"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
            </div>

            <div>
              <label htmlFor="zipcode" className="block text-sm font-medium text-gray-700 mb-1">
                Zip Code *
              </label>
              <input
                type="text"
                id="zipcode"
                {...register("zipcode")}
                placeholder="e.g. 10001"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.zipcode && <p className="text-xs text-red-500 mt-1">{errors.zipcode.message}</p>}
            </div>

            <div>
              <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1">
                Latitude (optional)
              </label>
              <input
                type="number"
                step="any"
                id="latitude"
                {...register("latitude", { valueAsNumber: true })}
                placeholder="e.g. 40.7128"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1">
                Longitude (optional)
              </label>
              <input
                type="number"
                step="any"
                id="longitude"
                {...register("longitude", { valueAsNumber: true })}
                placeholder="e.g. -74.0060"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Price Information */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-10">
          <h2 className="text-2xl font-bold mb-6">Pricing</h2>
          <p className="text-sm text-gray-600 mb-4">
            Set the price for adults and children
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price_adult" className="block text-sm font-medium text-gray-700 mb-1">
                Adult Price ($)
              </label>
              <input
                type="number"
                id="price_adult"
                step="0.01"
                min="0"
                value={adultPrice}
                onChange={(e) => setAdultPrice(e.target.value)}
                placeholder="e.g. 150"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="price_child" className="block text-sm font-medium text-gray-700 mb-1">
                Child Price ($)
              </label>
              <input
                type="number"
                id="price_child"
                step="0.01"
                min="0"
                value={childPrice}
                onChange={(e) => setChildPrice(e.target.value)}
                placeholder="e.g. 75"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Fees Configuration */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-10">
          <h2 className="text-2xl font-bold mb-6">Fees</h2>
          <p className="text-sm text-gray-600 mb-4">
            Configure additional fees for this listing
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fee_per_person" className="block text-sm font-medium text-gray-700 mb-1">
                Fee Per Person ($)
              </label>
              <input
                type="number"
                id="fee_per_person"
                step="0.01"
                min="0"
                value={feePerPerson}
                onChange={(e) => setFeePerPerson(e.target.value)}
                placeholder="e.g. 10"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Applied per guest</p>
            </div>
            <div>
              <label htmlFor="fee_per_booking" className="block text-sm font-medium text-gray-700 mb-1">
                Fee Per Booking ($)
              </label>
              <input
                type="number"
                id="fee_per_booking"
                step="0.01"
                min="0"
                value={feePerBooking}
                onChange={(e) => setFeePerBooking(e.target.value)}
                placeholder="e.g. 50"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Applied once per booking</p>
            </div>
          </div>
        </div>

        {/* Images Upload */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-10">
          <h2 className="text-2xl font-bold mb-6">Images</h2>
          <p className="text-sm text-gray-600 mb-4">Upload images from your device (max 10MB per image)</p>

          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-12 h-12 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, WEBP (MAX. 10MB per image)</p>
                </div>
                <input
                  id="image-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </label>
            </div>

            {imagePreviewUrls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                {imagePreviewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition shadow-lg"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {selectedFiles.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-blue-800">
                  <ImageIcon size={16} />
                  <span className="text-sm font-medium">
                    {selectedFiles.length} image(s) selected
                    {uploadedImageUrls.length > 0 && " (Uploaded ✓)"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Apartment Specific Fields */}
        {selectedCategory === "apartment" && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-10">
            <h2 className="text-2xl font-bold mb-6">Apartment Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="guest_capacity" className="block text-sm font-medium text-gray-700 mb-1">
                  Guest Capacity
                </label>
                <input
                  type="number"
                  id="guest_capacity"
                  {...register("guest_capacity", { valueAsNumber: true })}
                  placeholder="e.g. 4"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="bedrooms_count" className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Bedrooms
                </label>
                <input
                  type="number"
                  id="bedrooms_count"
                  {...register("bedrooms_count", { valueAsNumber: true })}
                  placeholder="e.g. 2"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="bathrooms_count" className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Bathrooms
                </label>
                <input
                  type="number"
                  id="bathrooms_count"
                  {...register("bathrooms_count", { valueAsNumber: true })}
                  placeholder="e.g. 2"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="living_area" className="block text-sm font-medium text-gray-700 mb-1">
                  Living Area (square feet)
                </label>
                <input
                  type="number"
                  id="living_area"
                  {...register("living_area", { valueAsNumber: true })}
                  placeholder="e.g. 1200"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("is_parking_available")}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Parking Available</span>
                </label>
              </div>

              <div className="md:col-span-2 border-t border-gray-200 pt-4 mt-4">
                <label className="flex items-center gap-2 cursor-pointer mb-3">
                  <input
                    type="checkbox"
                    checked={useWholeApartment}
                    onChange={(e) => setUseWholeApartment(e.target.checked)}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Enable Whole Apartment Pricing
                  </span>
                </label>
                {useWholeApartment && (
                  <div>
                    <label htmlFor="whole_apartment_price" className="block text-sm font-medium text-gray-700 mb-1">
                      Whole Apartment Price ($) *
                    </label>
                    <input
                      type="number"
                      id="whole_apartment_price"
                      step="0.01"
                      min="0"
                      value={wholeApartmentPrice}
                      onChange={(e) => setWholeApartmentPrice(e.target.value)}
                      placeholder="e.g. 500"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Fixed price for entire apartment regardless of number of guests
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4 mt-6 border-t border-gray-200 pt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Accessibility Points</label>
                <p className="text-xs text-gray-500 mb-2">
                  Add information about accessibility features (wheelchair access, elevators, etc.)
                </p>
                {accessibilityPoints.map((point, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={point}
                      onChange={(e) => {
                        const newPoints = [...accessibilityPoints];
                        newPoints[index] = e.target.value;
                        setAccessibilityPoints(newPoints);
                      }}
                      placeholder="e.g. Wheelchair accessible entrance"
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {index === accessibilityPoints.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => setAccessibilityPoints([...accessibilityPoints, ""])}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                      >
                        +
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          const newPoints = accessibilityPoints.filter((_, i) => i !== index);
                          setAccessibilityPoints(newPoints);
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                      >
                        −
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rules</label>
                <p className="text-xs text-gray-500 mb-2">
                  Add rules or restrictions (no smoking, no pets, check-in/out  times, etc.)
                </p>
                {rules.map((rule, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={rule}
                      onChange={(e) => {
                        const newRules = [...rules];
                        newRules[index] = e.target.value;
                        setRules(newRules);
                      }}
                      placeholder="e.g. No smoking allowed"
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {index === rules.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => setRules([...rules, ""])}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                      >
                        +
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          const newRules = rules.filter((_, i) => i !== index);
                          setRules(newRules);
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                      >
                        −
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Attraction Specific Fields */}
        {selectedCategory === "attraction" && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-10">
            <h2 className="text-2xl font-bold mb-6">Attraction Details</h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="distance" className="block text-sm font-medium text-gray-700 mb-1">
                  Distance (km from city center)
                </label>
                <input
                  type="number"
                  step="0.1"
                  id="distance"
                  {...register("distance", { valueAsNumber: true })}
                  placeholder="e.g. 5.2"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Accessibility Points</label>
                <p className="text-xs text-gray-500 mb-2">
                  Add information about accessibility features (wheelchair access, elevators, etc.)
                </p>
                {accessibilityPoints.map((point, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={point}
                      onChange={(e) => {
                        const newPoints = [...accessibilityPoints];
                        newPoints[index] = e.target.value;
                        setAccessibilityPoints(newPoints);
                      }}
                      placeholder="e.g. Wheelchair accessible entrance"
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {index === accessibilityPoints.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => setAccessibilityPoints([...accessibilityPoints, ""])}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                      >
                        +
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          const newPoints = accessibilityPoints.filter((_, i) => i !== index);
                          setAccessibilityPoints(newPoints);
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                      >
                        −
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rules</label>
                <p className="text-xs text-gray-500 mb-2">
                  Add rules or restrictions (no smoking, no pets, opening hours, etc.)
                </p>
                {rules.map((rule, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={rule}
                      onChange={(e) => {
                        const newRules = [...rules];
                        newRules[index] = e.target.value;
                        setRules(newRules);
                      }}
                      placeholder="e.g. No smoking allowed"
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {index === rules.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => setRules([...rules, ""])}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                      >
                        +
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          const newRules = rules.filter((_, i) => i !== index);
                          setRules(newRules);
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
                      >
                        −
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Features */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-10">
          <h2 className="text-2xl font-bold mb-6">Features & Amenities</h2>
          <p className="text-sm text-gray-600 mb-4">Select all applicable features</p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allFeatures.map((feature) => (
              <label key={feature} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  value={feature}
                  {...register("features")}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{feature}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            disabled={submitting || uploadingImages || loadingListing}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || uploadingImages || loadingListing}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploadingImages
              ? "Uploading Images..."
              : submitting
                ? isEditMode ? "Updating Listing..." : "Adding Listing..."
                : isEditMode ? "Update Listing" : "Add Listing"}
          </button>
        </div>
      </form>
    </div>
  );
}
