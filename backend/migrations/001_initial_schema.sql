-- ============================================================
-- FinAI Nexus — Initial Database Schema
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ============================================================

-- 1. Users
CREATE TABLE IF NOT EXISTS users (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email           TEXT UNIQUE NOT NULL,
    password_hash   TEXT NOT NULL,
    name            TEXT,
    country         TEXT DEFAULT 'Pakistan',
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- 2. Risk Profiles
CREATE TABLE IF NOT EXISTS risk_profiles (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    risk_level      TEXT,          -- Conservative / Moderate / Aggressive
    risk_score      INT,           -- 0–100
    quiz_answers    JSONB,
    created_at      TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id)
);

-- 3. Virtual Wallets
CREATE TABLE IF NOT EXISTS virtual_wallets (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    balance_pkr     NUMERIC DEFAULT 0,
    balance_usd     NUMERIC DEFAULT 0,
    updated_at      TIMESTAMPTZ DEFAULT now()
);

-- 4. Virtual Holdings
CREATE TABLE IF NOT EXISTS virtual_holdings (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    symbol          TEXT NOT NULL,
    quantity        NUMERIC DEFAULT 0,
    avg_buy_price   NUMERIC DEFAULT 0,
    weight          NUMERIC DEFAULT 0,
    esg_score       NUMERIC,
    market          TEXT DEFAULT 'INTL',    -- PSX or INTL
    currency        TEXT DEFAULT 'USD',
    created_at      TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, symbol)
);

-- 5. Virtual Transactions
CREATE TABLE IF NOT EXISTS virtual_transactions (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    symbol          TEXT,
    type            TEXT NOT NULL,           -- BUY / SELL / DEPOSIT / WITHDRAW / TAX_HARVEST
    amount_pkr      NUMERIC,
    quantity        NUMERIC,
    notes           TEXT,
    simulated_tax_saved NUMERIC,
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- 6. SHAP Cache
CREATE TABLE IF NOT EXISTS shap_cache (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    symbol          TEXT NOT NULL,
    confidence      NUMERIC,
    factors         JSONB,
    summary_en      TEXT,
    summary_ur      TEXT,
    what_if         JSONB,
    allocation      TEXT,
    name            TEXT,
    price_at_calculation NUMERIC,
    sentiment       TEXT,
    quiz_version    INT DEFAULT 1,
    cached_at       TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, symbol)
);

-- 7. Monte Carlo Results
CREATE TABLE IF NOT EXISTS monte_carlo_results (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    p10             NUMERIC,
    p50             NUMERIC,
    p90             NUMERIC,
    paths           JSONB,
    params          JSONB,
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- 8. Goals
CREATE TABLE IF NOT EXISTS goals (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    target_pkr      NUMERIC,
    current_pkr     NUMERIC DEFAULT 0,
    deadline        DATE,
    icon            TEXT,
    priority        TEXT DEFAULT 'medium',
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- 9. Error Logs
CREATE TABLE IF NOT EXISTS error_logs (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    severity        TEXT,
    module          TEXT,
    message         TEXT,
    stack_trace     TEXT,
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- 10. Admin Audit Log
CREATE TABLE IF NOT EXISTS admin_audit_log (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id        UUID,
    action          TEXT,
    parameter       TEXT,
    old_value       TEXT,
    new_value       TEXT,
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- Row Level Security (RLS) — users can only see their own data
-- ============================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE virtual_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE virtual_holdings ENABLE ROW LEVEL SECURITY;
ALTER TABLE virtual_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE shap_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE monte_carlo_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- For now, allow all operations via the service role (our Flask backend
-- uses the anon key, but we handle auth at the application layer with JWT).
-- In production, tighten these policies.

CREATE POLICY "Allow all for authenticated" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated" ON risk_profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated" ON virtual_wallets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated" ON virtual_holdings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated" ON virtual_transactions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated" ON shap_cache FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated" ON monte_carlo_results FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated" ON goals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated" ON error_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated" ON admin_audit_log FOR ALL USING (true) WITH CHECK (true);
