create table if not exists public.taxes (
	uid text primary key,

	name text not null,                   -- tax name/description (e.g., "VAT", "Tourist Tax")
	rate numeric not null,                -- tax rate (e.g., 20 for 20%, or 5 for $5)
	type text not null check (type in ('percentage', 'fixed')),
	per_head boolean default false,       -- true = per person, false = per booking
	applicability text not null check (applicability in ('attraction', 'apartment', 'airport_taxi', 'all')),

	created_at timestamptz default now(),
	updated_at timestamptz default now()
);
