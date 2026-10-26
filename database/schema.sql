CREATE TABLE IF NOT EXISTS restaurants (
  id text PRIMARY KEY,
  name text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  image text NOT NULL,
  rating numeric NOT NULL DEFAULT 4.8,
  minutes integer NOT NULL DEFAULT 25,
  fee numeric NOT NULL DEFAULT 6
);

CREATE TABLE IF NOT EXISTS products (
  id text PRIMARY KEY,
  restaurant_id text NOT NULL REFERENCES restaurants(id),
  name text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  image text NOT NULL,
  category text NOT NULL,
  active boolean NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS profiles (
  user_id text PRIMARY KEY,
  name text NOT NULL,
  phone text NOT NULL DEFAULT '',
  addresses jsonb NOT NULL DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS store_settings (
  restaurant_id text PRIMARY KEY REFERENCES restaurants(id),
  data jsonb NOT NULL
);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  restaurant_id text NOT NULL REFERENCES restaurants(id),
  items jsonb NOT NULL,
  subtotal numeric NOT NULL,
  discount numeric NOT NULL DEFAULT 0,
  fee numeric NOT NULL,
  total numeric NOT NULL CHECK (total >= 0),
  status text NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled')),
  address text NOT NULL,
  payment text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  idempotency_key uuid NOT NULL,
  UNIQUE (user_id, idempotency_key)
);

CREATE INDEX IF NOT EXISTS orders_user_created_idx ON orders(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS products_restaurant_idx ON products(restaurant_id);
