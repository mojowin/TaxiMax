CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE payment_status AS ENUM ('created', 'pending', 'paid', 'failed', 'cancelled');

CREATE TABLE customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text,
  company_name text,
  address text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id),
  plan_code text NOT NULL,
  device_code text NOT NULL,
  amount_cents integer NOT NULL CHECK (amount_cents > 0),
  currency char(3) NOT NULL DEFAULT 'EUR',
  payment_provider text NOT NULL,
  provider_transaction_id text,
  status payment_status NOT NULL DEFAULT 'created',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  registration_number text NOT NULL,
  software_license text NOT NULL,
  vehicle_type text,
  operating_city text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX orders_provider_transaction_id_idx
  ON orders(provider_transaction_id)
  WHERE provider_transaction_id IS NOT NULL;
