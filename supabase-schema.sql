create extension if not exists pgcrypto;

create table if not exists public.carriers (
 id uuid primary key default gen_random_uuid(), name text not null, phone text not null,
 vehicle_type text not null, plate_number text not null unique, capacity_tons numeric(10,2) not null,
 location text not null, photo_url text, status text not null default 'active', created_at timestamptz not null default now()
);

create table if not exists public.shippers (
 id uuid primary key default gen_random_uuid(), name text not null, phone text not null, tin text,
 created_at timestamptz not null default now()
);

create table if not exists public.cargos (
 id uuid primary key default gen_random_uuid(), shipper_id uuid references public.shippers(id) on delete set null,
 cargo_type text not null, weight_kg numeric(12,2) not null, origin text not null, destination text not null,
 photo_url text, status text not null default 'available', tracking_code text unique, created_at timestamptz not null default now()
);

create table if not exists public.delivery_requests (
 id uuid primary key default gen_random_uuid(), name text not null, phone text not null, cargo text not null,
 weight_kg numeric(12,2) not null, origin text not null, destination text not null,
 status text not null default 'open', created_at timestamptz not null default now()
);

create table if not exists public.transport_prices (
 id uuid primary key default gen_random_uuid(), carrier_id uuid references public.carriers(id) on delete set null,
 origin text not null, destination text not null, vehicle_type text not null, price_rwf numeric(14,2) not null,
 cargo_capacity_tons numeric(10,2), insurance_included boolean default false, rra_registered boolean default false,
 status text not null default 'active', created_at timestamptz not null default now()
);

create table if not exists public.bids (
 id uuid primary key default gen_random_uuid(), cargo_id uuid not null references public.cargos(id) on delete cascade,
 carrier_id uuid references public.carriers(id) on delete cascade, amount_rwf numeric(14,2) not null,
 message text, status text not null default 'pending', created_at timestamptz not null default now()
);

create table if not exists public.shipments (
 id uuid primary key default gen_random_uuid(), cargo_id uuid references public.cargos(id) on delete set null,
 carrier_id uuid references public.carriers(id) on delete set null, tracking_code text not null unique,
 origin text not null, destination text not null, current_location text, status text not null default 'registered',
 estimated_delivery date, created_at timestamptz not null default now()
);

create table if not exists public.tracking_events (
 id uuid primary key default gen_random_uuid(), shipment_id uuid not null references public.shipments(id) on delete cascade,
 location text not null, status text not null, description text, event_time timestamptz not null default now()
);

create table if not exists public.documents (
 id uuid primary key default gen_random_uuid(), shipment_id uuid references public.shipments(id) on delete cascade,
 document_type text not null, document_url text not null, uploaded_at timestamptz not null default now()
);

create table if not exists public.customs_declarations (
 id uuid primary key default gen_random_uuid(), tin text not null, company text not null, commodity text not null,
 cargo_value_rwf numeric(14,2) not null, border text not null, estimated_duty_rwf numeric(14,2) not null,
 status text not null default 'draft', created_at timestamptz not null default now()
);

create index if not exists idx_carriers_status on public.carriers(status);
create index if not exists idx_cargos_status on public.cargos(status);
create index if not exists idx_prices_route on public.transport_prices(origin, destination);
create index if not exists idx_shipments_tracking on public.shipments(tracking_code);
create index if not exists idx_tracking_shipment on public.tracking_events(shipment_id);

alter table public.carriers enable row level security;
alter table public.shippers enable row level security;
alter table public.cargos enable row level security;
alter table public.delivery_requests enable row level security;
alter table public.transport_prices enable row level security;
alter table public.bids enable row level security;
alter table public.shipments enable row level security;
alter table public.tracking_events enable row level security;
alter table public.documents enable row level security;
alter table public.customs_declarations enable row level security;

-- Public marketplace reads
create policy "public read active carriers" on public.carriers for select to anon, authenticated using (status = 'active');
create policy "public read available cargos" on public.cargos for select to anon, authenticated using (status = 'available');
create policy "public read open delivery requests" on public.delivery_requests for select to anon, authenticated using (status = 'open');
create policy "public read active prices" on public.transport_prices for select to anon, authenticated using (status = 'active');
create policy "public read shipments" on public.shipments for select to anon, authenticated using (true);
create policy "public read tracking events" on public.tracking_events for select to anon, authenticated using (true);

-- Public submissions used by the current website
create policy "public insert carriers" on public.carriers for insert to anon, authenticated with check (status = 'active');
create policy "public insert shippers" on public.shippers for insert to anon, authenticated with check (true);
create policy "public insert cargos" on public.cargos for insert to anon, authenticated with check (status = 'available');
create policy "public insert delivery requests" on public.delivery_requests for insert to anon, authenticated with check (status = 'open');
create policy "public insert bids" on public.bids for insert to anon, authenticated with check (status = 'pending');
create policy "public insert shipments" on public.shipments for insert to anon, authenticated with check (true);
create policy "public insert tracking events" on public.tracking_events for insert to anon, authenticated with check (true);
create policy "public insert documents" on public.documents for insert to anon, authenticated with check (true);
create policy "public insert customs declarations" on public.customs_declarations for insert to anon, authenticated with check (status = 'draft');
