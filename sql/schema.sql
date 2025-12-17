-- DROP TABLE IF EXISTS labels;
-- DROP TABLE IF EXISTS user_configs;

-- Required for UUID generation (Supabase/Railway already have this)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    linnworks_unique_identifier UUID NOT NULL UNIQUE,
    email TEXT NOT NULL,
    account_name TEXT NOT NULL,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE auth_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,

    token TEXT NOT NULL UNIQUE,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_auth_tokens_token ON auth_tokens(token);


-- ACCOUNT CONFIGURATION (WIZARD STATE)
-- UI metadata lives in code, values live here
CREATE TABLE account_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,

    is_config_active BOOLEAN NOT NULL DEFAULT FALSE,
    config_status TEXT NOT NULL DEFAULT 'INITIAL',

    config JSONB,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE shipping_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    service_code TEXT NOT NULL UNIQUE,
    service_name TEXT NOT NULL,
    service_tag TEXT,
    service_group TEXT,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TYPE label_status AS ENUM (
    'NEW',
    'ASSIGNED',
    'USED',
    'CANCELLED'
);

CREATE TABLE labels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,

    reference TEXT NOT NULL UNIQUE,

    tracking_number TEXT,
    pdf_path TEXT NOT NULL,

    status label_status NOT NULL DEFAULT 'NEW',

    assigned_at TIMESTAMPTZ,
    used_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_labels_reference ON labels(reference);
CREATE INDEX idx_labels_status ON labels(status);


-- MANIFESTS (STUB, BUT CORRECT)
-- Required by Linnworks even if fake
CREATE TABLE manifests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,

    manifest_reference TEXT NOT NULL UNIQUE,

    -- Order IDs grouped in this manifest
    orders JSONB NOT NULL,

    pdf_path TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- INTEGRATION EVENTS (AUDIT / DEBUG)
-- Absolutely critical for production support
CREATE TABLE integration_events (
    id BIGSERIAL PRIMARY KEY,

    account_id UUID REFERENCES accounts(id),

    event_type TEXT NOT NULL,
    payload JSONB,
    error_message TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- SEED REQUIRED SERVICE (RUN ONCE)
-- INSERT INTO shipping_services (
--     service_code,
--     service_name,
--     service_tag,
--     service_group
-- )
-- VALUES (
--     'FEDEX_PREPAID',
--     'FedEx Prepaid (PDF Match)',
--     'PREPAID',
--     'FedEx'
-- )
-- ON CONFLICT (service_code) DO NOTHING;
