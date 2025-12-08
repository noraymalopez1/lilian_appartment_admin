create table if not exists public.taxis (
	uid text primary key,
  name text not null,
  luggage_quantity numeric not null,
  carry_on_luggage numeric not null,
  passenger_seats numeric not null,
  car_type text not null, -- "standard_sedan", "premium_sedan", "suv", "mini_bus"
  status text not null, -- "active" or "closed"
  created_at timestamptz default now()
  price numeric not null,
);
