create table if not exists public.listings (
    uid text primary key,

    title text,
    category text,
    tags text,                       -- comma separated string

    description text,

    price jsonb,                     -- { personType: price }

    images text[],                   -- array of strings

    -- location
    zipcode text,
    city text,
    location text,
    latitude numeric,
    longitude numeric,

    -- apartment details
    guest_capacity int,
    bathrooms_count int,
    bedrooms_count int,
    living_area int,                 -- sqft
    is_parking_available boolean,

    -- attraction
    distance numeric,                -- km
    accessibility_points text[],     -- array of strings
    rules text[],                    -- array of strings

    status text check (status in ('open', 'closed')),
    features text[],                 -- array of strings

    created_at timestamptz,
    updated_at timestamptz
);

