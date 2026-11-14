# Rwanda Logistics Hub - Supabase setup

## 1. Create the database
Open Supabase -> SQL Editor and run `supabase-schema.sql`.

## 2. Add the project credentials
Open `supabase-config.js` and replace:

- `https://YOUR-PROJECT-REF.supabase.co`
- `YOUR_SUPABASE_ANON_KEY`

Use the Supabase **Project URL** and **anon/public key**. Never use the `service_role` key in browser code.

## 3. Run the website
Keep these files together:

- `welcome-final.html`
- `main-final.html`
- `supabase-config.js`
- `supabase-integration.js`

The website uses the Supabase JavaScript client from jsDelivr.

## 4. What is connected
- Carrier registration -> `carriers`
- Shipper registration -> `shippers` + `cargos`
- Delivery request -> `delivery_requests`
- Customs declaration -> `customs_declarations`
- Marketplace data -> loaded from Supabase on page load

## 5. Security
The browser should only contain the Supabase anon/public key. Do not publish a service-role key.
