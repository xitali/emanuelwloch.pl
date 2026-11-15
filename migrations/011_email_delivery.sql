CREATE TABLE IF NOT EXISTS email_deliveries (
  resend_id TEXT PRIMARY KEY,
  message_id TEXT NOT NULL REFERENCES contact_messages(id) ON DELETE CASCADE,
  kind TEXT NOT NULL,
  status TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS email_deliveries_message ON email_deliveries(message_id);
ALTER TABLE contact_messages ADD COLUMN review_requested_at TEXT;
