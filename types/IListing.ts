export interface IListing {
  uid: string; // required

  title?: string;
  category?: string;
  tags?: string; // comma separated

  description?: string;

  price?: Record<string, number>;

  images?: string[];

  // location
  zipcode?: string;
  city?: string;
  location?: string;
  latitude?: number;
  longitude?: number;

  // apartment details
  guestCapacity?: number;
  bathroomsCount?: number;
  bedroomsCount?: number;
  livingArea?: number;
  isParkingAvailable?: boolean;

  // attraction
  distance?: number;
  accessibilityPoints?: string[];
  rules?: string[];

  status?: "open" | "closed";
  features?: string[];

  createdAt?: string;
  updatedAt?: string;
}
