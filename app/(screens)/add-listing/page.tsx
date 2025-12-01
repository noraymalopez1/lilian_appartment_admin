"use client";
import React from "react";
import { ChevronRight, Trash2, Plus } from "lucide-react";
// --- Third-Party Libraries ---
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldError } from "react-hook-form"; // Import FieldError type

// --- 1. ZOD SCHEMA DEFINITION ---

// Schema for Price and No. of Days row
const PriceRowSchema = z.object({
  price: z.string().min(1, "Price is required"),
  days: z.string().min(1, "Days selection is required"),
});

// Schema for Price and Type of Person row
const PersonPriceRowSchema = z.object({
  price: z.string().min(1, "Price is required"),
  personType: z.string().min(1, "Person type selection is required"),
});

// Regex to validate a standard coordinate format (optional sign, digits, dot, digits)
const coordinateRegex = /^-?\d+(\.\d+)?$/;

const listingSchema = z.object({
  // Basic Info Section
  basicInfo: z.object({
    mainTitle: z.string().min(5, "Listing title is required (min 5 chars)"),
    category: z.string().min(5, "Category is required (min 5 chars)"),
    keywords: z.string().min(5, "Keywords are required (min 5 chars)"),
    description: z.string().min(20, "Description is required (min 20 chars)"),
  }),

  // Price Section (using field arrays)
  priceSection: z.object({
    priceRows: z
      .array(PriceRowSchema)
      .min(1, "At least one Price/Day entry is required."),
    personPriceRows: z
      .array(PersonPriceRowSchema)
      .min(1, "At least one Price/Person entry is required."),
  }),

  // Location Section (including new lat/lng fields)
  location: z.object({
    street: z.string().min(5, "Street is required"),
    city: z.string().min(1, "City/State selection is required"),
    address: z.string().min(5, "Address is required"),
    zipCode: z.string().min(4, "Zip Code is required"),
    // NEW FIELDS: Latitude and Longitude validation
    latitude: z
      .string()
      .regex(coordinateRegex, "Invalid latitude format")
      .min(1, "Latitude is required"),
    longitude: z
      .string()
      .regex(coordinateRegex, "Invalid longitude format")
      .min(1, "Longitude is required"),
  }),

  // Media Section
  media: z.object({
    videoLink: z
      .string()
      .url("Must be a valid URL")
      .optional()
      .or(z.literal("")),
    images: z.any().optional(), // File handling is often complex; z.any() is used here for simplicity.
  }),

  // Overview Section
  overview: z.object({
    bathroom: z.string().min(1, "Bathroom count is required"),
    bedroom: z.string().min(1, "Bedroom count is required"),
    livingArea: z.string().min(1, "Living Area size is required"),
    parking: z.string().min(1, "Parking selection is required"),
  }),

  // Features Section (checkboxes)
  features: z.array(z.string()).optional(),
});

// Type definition for form data
export type ListingFormType = z.infer<typeof listingSchema>;

// Static data for features and dropdowns
const allFeatures = [
  "Pool",
  "Hot Tub",
  "Gym",
  "Bar",
  "Family Room",
  "Smoking Allowed",
  "Breakfast included",
  "Coffee Maker",
  "Security System",
  "Wifi Access",
  "Pet Friendly",
  "Balcony",
];
const daysOptions = ["1 Day", "2 Days", "3 Days", "7 Days", "30 Days"];
const personTypeOptions = ["Adult", "Child", "Infant", "Senior"];
const cityOptions = ["New York", "California", "Texas", "Florida"];
const overviewOptions = {
  bathroom: ["1", "2", "3", "4+"],
  bedroom: ["1", "2", "3", "4+"],
  livingArea: ["500 sq ft", "1000 sq ft", "1500 sq ft", "2000+ sq ft"],
  parking: ["Yes", "No"],
};

// --- 2. INPUT FIELD COMPONENT (to simplify rendering and error display) ---
interface InputFieldProps {
  label: string;
  id: string;
  placeholder: string;
  error: string | FieldError | undefined;
  type?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, id, placeholder, error, type = "text", ...props }, ref) => (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        id={id}
        ref={ref}
        placeholder={placeholder}
        className={`w-full p-2 border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150`}
        {...props}
      />
      {/* Type-safe error message rendering */}
      {typeof error === "string" && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
      {error && typeof error !== "string" && (
        <p className="mt-1 text-xs text-red-500">
          {(error as FieldError).message}
        </p>
      )}
    </div>
  )
);
InputField.displayName = "InputField";

interface SelectFieldProps {
  label: string;
  id: string;
  options: string[];
  error: string | FieldError | undefined;
  defaultValue: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const SelectField = React.forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, id, options, error, defaultValue, ...props }, ref) => (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          ref={ref}
          defaultValue="" // Set defaultValue to empty string and use placeholder for display
          className={`w-full appearance-none px-4 py-2 border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white pr-10`}
          {...props}
        >
          <option value="" disabled>
            {defaultValue}
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
          <svg
            className="h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
      {/* Type-safe error message rendering */}
      {typeof error === "string" && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
      {error && typeof error !== "string" && (
        <p className="mt-1 text-xs text-red-500">
          {(error as FieldError).message}
        </p>
      )}
    </div>
  )
);
SelectField.displayName = "SelectField";

// --- 3. MAIN COMPONENT ---
const AddListing = () => {
  // RHF Initialization
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ListingFormType>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      basicInfo: { mainTitle: "", category: "", keywords: "", description: "" },
      priceSection: {
        priceRows: [{ price: "", days: "" }],
        personPriceRows: [{ price: "", personType: "" }],
      },
      location: {
        street: "",
        city: "",
        address: "",
        zipCode: "",
        latitude: "",
        longitude: "",
      },
      media: { videoLink: "", images: undefined }, // images should be undefined or null for file input
      overview: { bathroom: "", bedroom: "", livingArea: "", parking: "" },
      features: [],
    },
  });

  // useFieldArray for Price Rows (Price/Days)
  const {
    fields: priceFields,
    append: appendPriceRow,
    remove: removePriceRow,
  } = useFieldArray({
    control,
    name: "priceSection.priceRows",
  });

  // useFieldArray for Person Price Rows (Price/Person)
  const {
    fields: personPriceFields,
    append: appendPersonPriceRow,
    remove: removePersonPriceRow,
  } = useFieldArray({
    control,
    name: "priceSection.personPriceRows",
  });

  // Handle Form Submission
  const onSubmit = (data: ListingFormType) => {
    console.log("Form Data Submitted:", data);
    // Here you would integrate Firestore or your backend API call
  };

  // Corrected error access logic:
  // For array min-length error, the message is directly on the array field.
  const priceRowsError = errors.priceSection?.priceRows?.message;
  const personPriceRowsError = errors.priceSection?.personPriceRows?.message;

  return (
    <div className="w-full max-w-3xl mx-auto pt-12 px-4 md:px-0">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold">Add Listing</h2>
        <p className="flex items-center gap-2">
          <a href="/" className="text-blue-600 hover:underline">
            Managment
          </a>{" "}
          <ChevronRight size={16} /> Add Listing <ChevronRight size={16} />
        </p>
      </div>
<<<<<<< HEAD

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-6">
        {/* === 1. BASIC INFORMATION === */}
        <div className="rounded-2xl border border-gray-200 bg-white py-4 px-2 md:px-20">
          <h2 className="text-center text-3xl font-bold pt-4 text-gray-800">
            Basic Information
          </h2>

          <div className="mt-6 space-y-6">
            <InputField
              label="Main Listing Title"
              id="mainTitle"
              placeholder="Type a main title for the listing"
              error={errors.basicInfo?.mainTitle?.message}
              {...register("basicInfo.mainTitle")}
=======
      <div className="rounded-2xl border border-gray-200 bg-white py-4 px-4 md:px-20 mt-4">
        <h2 className="text-center text-3xl font-bold pt-4">
          Basic Information
        </h2>
        <form action="" className="mt-4 space-y-6">
          <div className="flex flex-col gap-1">
            <label htmlFor="">Listing Title</label>
            <input
              type="text"
              placeholder="type a title"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
>>>>>>> 88df24dad29c222f2b0a542ba6e2739840d97720
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectField
                label="Category"
                id="category"
                options={["apartment", "booking", "attraction"]}
                defaultValue="Select a category"
                error={errors.basicInfo?.category?.message}
                {...register("basicInfo.category")}
              />
              <InputField
                label="Keywords"
                id="keywords" // BUG FIX: Changed id from 'title2' to 'keywords' to match register
                placeholder="Type another subtitle (e.g., Category)"
                error={errors.basicInfo?.keywords?.message}
                {...register("basicInfo.keywords")}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={5}
                placeholder="Type a detailed description"
                className={`w-full p-2 border ${
                  errors.basicInfo?.description
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150`}
                {...register("basicInfo.description")}
              />
              {errors.basicInfo?.description && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.basicInfo.description.message}
                </p>
              )}
            </div>
          </div>
<<<<<<< HEAD
=======
          <div className="flex flex-col gap-1">
            <label htmlFor="">Listing Title</label>
            <textarea
              cols={10}
              rows={5}
              placeholder="type a title"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
            />
          </div>
        </form>
      </div>

      {/* price */}
      <div className="rounded-2xl border border-gray-200 bg-white py-4 px-4 md:px-20 mt-4">
        <h2 className="text-center text-3xl font-bold pt-4">Price</h2>
        {/* Form Container */}
        <div className="space-y-6 mt-4">
          {/* First Row: Price and No of Days */}
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-grow w-full">
              {/* Price Field 1 */}
              <div>
                <label
                  htmlFor="price1"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Price
                </label>
                <input
                  type="text"
                  id="price1"
                  placeholder="Enter Price"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* No of Days Field */}
              <div>
                <label
                  htmlFor="days"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  No of Days
                </label>
                <div className="relative">
                  <select
                    id="days"
                    defaultValue="Select"
                    className="w-full appearance-none px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white pr-8"
                  >
                    <option disabled>Select</option>
                    <option>1 Day</option>
                    <option>2 Days</option>
                  </select>
                  {/* Custom Arrow */}
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Plus Button 1 */}
            <button className="p-1 border border-gray-400 text-gray-600 rounded-full hover:bg-gray-50 focus:outline-none transition duration-150 ease-in-out">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </button>
          </div>

          {/* Second Row: Price and Type of Person */}
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-grow w-full">
              {/* Price Field 2 */}
              <div>
                <label
                  htmlFor="price2"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Price
                </label>
                <input
                  type="text"
                  id="price2"
                  placeholder="Enter Price"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Type of Person Field */}
              <div>
                <label
                  htmlFor="personType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Type of Person
                </label>
                <div className="relative">
                  <select
                    id="personType"
                    defaultValue="Select"
                    className="w-full appearance-none px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white pr-8"
                  >
                    <option disabled>Select</option>
                    <option>Adult</option>
                    <option>Child</option>
                  </select>
                  {/* Custom Arrow */}
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Plus Button 2 */}
            <button className="p-1 border border-gray-400 text-gray-600 rounded-full hover:bg-gray-50 focus:outline-none transition duration-150 ease-in-out">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </button>
          </div>
>>>>>>> 88df24dad29c222f2b0a542ba6e2739840d97720
        </div>

        {/* --- */}

        {/* === 2. PRICE SECTION === */}
        <div className="rounded-2xl border border-gray-200 bg-white py-4 px-2 md:px-20 mt-4">
          <h2 className="text-center text-3xl font-bold pt-4 text-gray-800">
            Price
          </h2>

          {/* BUG FIX: Corrected error access for minimum array length validation */}
          {priceRowsError && (
            <p className="text-sm text-red-500 mt-4 text-center">
              {priceRowsError}
            </p>
          )}

          {/* Price/Days dynamic array */}
          {priceFields.map((field, index) => (
            <div key={field.id} className="flex items-center space-x-4 mt-6">
              <div className="grid grid-cols-2 gap-4 flex-grow">
                {/* Price Field */}
                <InputField
                  label={`Price ${index + 1}`}
                  id={`price${index}`}
                  placeholder="Enter Price"
                  error={
                    errors.priceSection?.priceRows?.[index]?.price?.message
                  }
                  {...register(`priceSection.priceRows.${index}.price`)}
                />
                {/* No of Days Field */}
                <SelectField
                  label="No of Days"
                  id={`days${index}`}
                  options={daysOptions}
                  defaultValue="Select"
                  error={errors.priceSection?.priceRows?.[index]?.days?.message}
                  {...register(`priceSection.priceRows.${index}.days`)}
                />
              </div>

              {/* Action Button: Remove or Add */}
              {index === priceFields.length - 1 ? (
                <button
                  type="button"
                  onClick={() => appendPriceRow({ price: "", days: "" })}
                  className="p-1 border border-blue-400 text-blue-600 rounded-full hover:bg-blue-50 focus:outline-none transition duration-150 ease-in-out self-end mb-1 h-10 w-10 flex items-center justify-center"
                >
                  <Plus size={20} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => removePriceRow(index)}
                  className="p-1 border border-red-400 text-red-600 rounded-full hover:bg-red-50 focus:outline-none transition duration-150 ease-in-out self-end mb-1 h-10 w-10 flex items-center justify-center"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          ))}

          <p className="mt-8 text-xl font-semibold border-t pt-4 text-gray-700">
            Price Per Person
          </p>

          {/* BUG FIX: Corrected error access for minimum array length validation */}
          {personPriceRowsError && (
            <p className="text-sm text-red-500 mt-2 text-center">
              {personPriceRowsError}
            </p>
          )}

          {/* Price/Person dynamic array */}
          {personPriceFields.map((field, index) => (
            <div key={field.id} className="flex items-center space-x-4 mt-6">
              <div className="grid grid-cols-2 gap-4 flex-grow">
                {/* Price Field */}
                <InputField
                  label={`Price ${index + 1}`}
                  id={`personPrice${index}`}
                  placeholder="Enter Price"
                  error={
                    errors.priceSection?.personPriceRows?.[index]?.price
                      ?.message
                  }
                  {...register(`priceSection.personPriceRows.${index}.price`)}
                />
                {/* Type of Person Field */}
                <SelectField
                  label="Type of Person"
                  id={`personType${index}`}
                  options={personTypeOptions}
                  defaultValue="Select"
                  error={
                    errors.priceSection?.personPriceRows?.[index]?.personType
                      ?.message
                  }
                  {...register(
                    `priceSection.personPriceRows.${index}.personType`
                  )}
                />
              </div>

              {/* Action Button: Remove or Add */}
              {index === personPriceFields.length - 1 ? (
                <button
                  type="button"
                  onClick={() =>
                    appendPersonPriceRow({ price: "", personType: "" })
                  }
                  className="p-1 border border-blue-400 text-blue-600 rounded-full hover:bg-blue-50 focus:outline-none transition duration-150 ease-in-out self-end mb-1 h-10 w-10 flex items-center justify-center"
                >
                  <Plus size={20} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => removePersonPriceRow(index)}
                  className="p-1 border border-red-400 text-red-600 rounded-full hover:bg-red-50 focus:outline-none transition duration-150 ease-in-out self-end mb-1 h-10 w-10 flex items-center justify-center"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* --- */}

        {/* === 3. LOCATIONS === */}
        <div className="w-full bg-white p-6 sm:p-10 rounded-lg shadow-xl mt-4">
          <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">
            Locations
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
            {/* 1. Road or Street */}
            <InputField
              label="Road or Street"
              id="street"
              placeholder="e.g 12 San Pedro Street"
              error={errors.location?.street?.message}
              {...register("location.street")}
            />

            {/* 2. City or state (Dropdown) */}
            <SelectField
              label="City or State"
              id="city"
              options={cityOptions}
              defaultValue="Select a City or State"
              error={errors.location?.city?.message}
              {...register("location.city")}
            />

            {/* 3. Address (Input with down arrow style) */}
            <InputField
              label="Address"
              id="address"
              placeholder="e.g Bloom"
              error={errors.location?.address?.message}
              {...register("location.address")}
            />

            {/* 4. Zip Code */}
            <InputField
              label="Zip Code"
              id="zipCode"
              placeholder="e.g ACBI258"
              error={errors.location?.zipCode?.message}
              {...register("location.zipCode")}
            />

            {/* NEW FIELD: 5. Latitude */}
            <InputField
              label="Latitude"
              id="latitude"
              placeholder="e.g. 34.0522"
              error={errors.location?.latitude?.message}
              {...register("location.latitude")}
            />

            {/* NEW FIELD: 6. Longitude */}
            <InputField
              label="Longitude"
              id="longitude"
              placeholder="e.g. -118.2437"
              error={errors.location?.longitude?.message}
              {...register("location.longitude")}
            />
          </div>
        </div>

        {/* --- */}

        {/* === 4. MEDIA & ATTACHMENT === */}
        <div className="w-full bg-white p-6 sm:p-10 rounded-lg shadow-xl mt-4">
          <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">
            Media and Attachment
          </h1>

          <div className="space-y-6">
            {/* 1. Upload Video Link */}
            <InputField
              label="Upload video link (Optional)"
              id="videoLink"
              placeholder="e.g YouTube link"
              error={errors.media?.videoLink?.message}
              {...register("media.videoLink")}
            />

            {/* 2. Photos or Images Drop Zone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photos or images
              </label>

<<<<<<< HEAD
              <div className="w-full p-16 border border-dashed border-gray-300 rounded-lg bg-gray-50 flex flex-col items-center justify-center text-center space-y-4 shadow-inner min-h-[300px]">
                <p className="text-gray-600 text-lg">Drag and Drop images</p>
                <label
                  htmlFor="imageUpload"
                  className="px-6 py-3 text-white font-medium rounded-lg shadow-md cursor-pointer transition duration-150 hover:opacity-90"
                  style={{ backgroundColor: "#A0522D" }}
                >
                  Browse images
                  <input
                    type="file"
                    id="imageUpload"
                    multiple
                    className="hidden"
                    {...register("media.images")}
                  />
                </label>
              </div>
              {errors.media?.images && (
                // BUG FIX: The image error will be an object if z.any() is used, display a generic message.
                <p className="mt-1 text-xs text-red-500">Image upload error</p>
              )}
=======
            <div className="w-full p-8 md:p-16 border border-gray-300 rounded-lg bg-gray-50 flex flex-col items-center justify-center text-center space-y-4 shadow-inner min-h-[200px] md:min-h-[300px]">
              <p className="text-gray-600 text-lg">Drag and Drop images</p>
              <button
                type="button"
                className="px-6 py-3 text-white font-medium rounded-lg shadow-md transition duration-150"
                style={{ backgroundColor: "#A0522D", borderColor: "#A0522D" }}
              >
                Browse images
              </button>
>>>>>>> 88df24dad29c222f2b0a542ba6e2739840d97720
            </div>
          </div>
        </div>

        {/* --- */}

        {/* === 5. OVERVIEW (Dropdowns) === */}
        <div className="w-full bg-white p-6 sm:p-10 rounded-lg shadow-xl mt-4">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Overview
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
            {/* 1. Bathroom Dropdown */}
            <SelectField
              label="Bathroom"
              id="bathroom"
              options={overviewOptions.bathroom}
              defaultValue="How many bathrooms?"
              error={errors.overview?.bathroom?.message}
              {...register("overview.bathroom")}
            />

            {/* 2. Bedroom Dropdown */}
            <SelectField
              label="Bedroom"
              id="bedroom"
              options={overviewOptions.bedroom}
              defaultValue="How many bedrooms?"
              error={errors.overview?.bedroom?.message}
              {...register("overview.bedroom")}
            />

            {/* 3. Living Area Dropdown */}
            <SelectField
              label="Living Area"
              id="livingArea"
              options={overviewOptions.livingArea}
              defaultValue="How many feet?"
              error={errors.overview?.livingArea?.message}
              {...register("overview.livingArea")}
            />

            {/* 4. Garage or Parking Slot Dropdown */}
            <SelectField
              label="Garage or Parking Slot"
              id="parking"
              options={overviewOptions.parking}
              defaultValue="Is parking available"
              error={errors.overview?.parking?.message}
              {...register("overview.parking")}
            />
          </div>
        </div>

        {/* --- */}

        {/* === 6. FEATURES (Checkboxes) === */}
        <div className="w-full bg-white p-6 sm:p-10 rounded-lg shadow-xl mt-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Features
          </h2>

<<<<<<< HEAD
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-4">
            {allFeatures.map((feature, index) => (
              <div key={feature} className="flex items-center">
                <input
                  id={`feature-${index}`}
                  type="checkbox"
                  value={feature}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  {...register("features")}
                />
                <label
                  htmlFor={`feature-${index}`}
                  className="ml-3 text-sm font-medium text-gray-700 select-none cursor-pointer"
                >
                  {feature}
                </label>
=======
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-4">
            {[
              ["Pool", "Hot Tub", "Gym", "Bar"],
              [
                "Family Room",
                "Smoking Allowed",
                "Breakfast included",
                "Coffee Maker",
              ],
              [
                "Family Room",
                "Smoking Allowed",
                "Breakfast included",
                "Coffee Maker",
              ],
            ].map((column, colIndex) => (
              <div key={colIndex} className="space-y-3">
                {column.map((feature, featureIndex) => (
                  <div
                    key={featureIndex}
                    className="flex items-start md:items-center"
                  >
                    <input
                      id={`feature-${colIndex}-${featureIndex}`}
                      name={`feature-${colIndex}-${featureIndex}`}
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`feature-${colIndex}-${featureIndex}`}
                      className="ml-3 text-sm font-medium text-gray-700 select-none"
                    >
                      {feature}
                    </label>
                  </div>
                ))}
>>>>>>> 88df24dad29c222f2b0a542ba6e2739840d97720
              </div>
            ))}
          </div>
        </div>

        {/* --- */}

        {/* === ACTION BUTTONS === */}
        <div className="flex justify-end pt-6 space-x-4 border-t border-gray-200 mt-6">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition duration-150 shadow-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 text-white font-medium rounded-lg shadow-md transition duration-150 hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: "#A0522D" }}
          >
            ADD LISTING
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddListing;
