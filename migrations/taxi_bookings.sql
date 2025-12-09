create table if not exists public.taxi_bookings (
	uid text primary key,
  taxi_uid text DEFAULT '',
  pickup text not null,  -- airport or hotel
  destination text not null, -- airport or hotel
  flight_no text not null,
  airline text not null,
  arrival_date text not null,
  arrival_time text not null,
  booking_type text not null, -- "pickup" or "dropoff"
  first_name text not null,
  last_name text not null,
  phone text not null,
  alternate_phone text,
  email text not null,
  luggage_quantity text not null,
  instruction text not null,
  car_type text not null, -- "standard_sedan", "premium_sedan", "suv", "mini_bus"
  status text not null, -- "pending", "active" ,  "completed", "cancelled"
  created_at timestamptz default now()
  price numeric not null,
);
