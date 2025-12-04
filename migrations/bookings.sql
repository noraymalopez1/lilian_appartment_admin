create table if not exists public.bookings (
    uid text primary key,
    listing_id text references public.listings(uid),
    listing_type text check (listing_type in ('apartment', 'attraction', 'taxi')),
    first_name text,
    last_name text,
    email text,
    phone text,

    check_in timestamptz,
    check_out timestamptz,

    guests int,
    status text check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
    
    total_price numeric,
    nights int,
    taxes numeric,

    created_at timestamptz default now()
);
