CREATE TABLE labels (
  id SERIAL PRIMARY KEY,
  reference TEXT UNIQUE NOT NULL,
  tracking_number TEXT,
  pdf_path TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'NEW',
  created_at TIMESTAMP DEFAULT now(),
  assigned_at TIMESTAMP
);

CREATE TABLE user_configs (
  id SERIAL PRIMARY KEY,
  linnworks_account_id TEXT UNIQUE NOT NULL,
  api_key TEXT NOT NULL,
  config JSONB,
  created_at TIMESTAMP DEFAULT now()
);