
-- 003_add_timetable_finance_messaging.sql

-- 0. Users (Public Profile)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  name TEXT,
  role TEXT, -- 'Admin', 'Teacher', 'Student', 'Parent'
  department TEXT,
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1. Schedule / Timetable
CREATE TABLE IF NOT EXISTS schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day TEXT NOT NULL,
  time TEXT NOT NULL,
  subject TEXT NOT NULL,
  room TEXT,
  teacher_id UUID REFERENCES users(id), -- Assuming users table exists
  teacher_name TEXT, -- Denormalized for simpler fetching
  grade TEXT, -- e.g. "12-A"
  grade_level TEXT, -- e.g. "Senior High"
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Finance (Transactions) - Invoices already created in 002
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE DEFAULT CURRENT_DATE,
  type TEXT CHECK (type IN ('Credit', 'Debit')),
  category TEXT,
  account_code TEXT,
  amount NUMERIC NOT NULL,
  description TEXT,
  entity_name TEXT,
  status TEXT DEFAULT 'Settled',
  method TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Messaging
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT CHECK (type IN ('Direct', 'Group', 'Broadcast', 'Institutional')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS conversation_participants (
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE,
  channel TEXT DEFAULT 'Native' -- 'Native', 'WhatsApp'
);

-- Enable RLS
ALTER TABLE schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Demoware Policies (Public Read/Write)
CREATE POLICY "Public schedule access" ON schedule FOR ALL USING (true);
CREATE POLICY "Public transactions access" ON transactions FOR ALL USING (true);
CREATE POLICY "Public conversations access" ON conversations FOR ALL USING (true);
CREATE POLICY "Public participants access" ON conversation_participants FOR ALL USING (true);
CREATE POLICY "Public messages access" ON messages FOR ALL USING (true);
