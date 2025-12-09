create table if not exists public.blocked_dates (
    uid text primary key,
    listing_id text references public.listings(uid) on delete cascade,
    listing_type text check (listing_type in ('apartment', 'attraction')),
    blocked_date date not null,
    reason text,
    created_at timestamptz default now(),
    
    unique(listing_id, blocked_date)
);
