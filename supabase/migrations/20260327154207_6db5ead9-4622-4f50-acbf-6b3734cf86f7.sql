
-- Fix: Remove the partial index with now() predicate, use a regular index instead
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(session_token);
