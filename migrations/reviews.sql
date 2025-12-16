create table if not exists public.reviews (
	uid text primary key,
	title text not null DEFAULT '',
	listing_id text not null,
	booking_id text not null,
	description text not null,
	rating numeric check (rating >= 1 and rating <= 5),
	name text not null,
	created_at timestamptz default now()
);
