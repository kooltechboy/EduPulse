-- Migration: 005_complete_rls_policies.sql
-- Purpose: Enforce Row Level Security (RLS) on all remaining application tables

-- 1. Courses Table
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view courses from their school" ON courses
  FOR SELECT
  USING (
    school_id = (SELECT school_id FROM users WHERE users.id = auth.uid()) OR
    auth.uid() IN (SELECT id FROM users WHERE is_super_admin = TRUE)
  );

CREATE POLICY "Users can insert courses for their school" ON courses
  FOR INSERT
  WITH CHECK (
    school_id = (SELECT school_id FROM users WHERE users.id = auth.uid())
  );

CREATE POLICY "Users can update courses from their school" ON courses
  FOR UPDATE
  USING (
    school_id = (SELECT school_id FROM users WHERE users.id = auth.uid())
  );

CREATE POLICY "Users can delete courses from their school" ON courses
  FOR DELETE
  USING (
    school_id = (SELECT school_id FROM users WHERE users.id = auth.uid())
  );


-- 2. Schedule Table
ALTER TABLE schedule ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view schedule from their school" ON schedule
  FOR SELECT
  USING (
    school_id = (SELECT school_id FROM users WHERE users.id = auth.uid()) OR
    auth.uid() IN (SELECT id FROM users WHERE is_super_admin = TRUE)
  );

CREATE POLICY "Users can manage schedule for their school" ON schedule
  FOR ALL
  USING (
    school_id = (SELECT school_id FROM users WHERE users.id = auth.uid())
  );


-- 3. Finance Tables (Transactions & Invoices)
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view transactions from their school" ON transactions
  FOR SELECT
  USING (
    school_id = (SELECT school_id FROM users WHERE users.id = auth.uid())
  );

CREATE POLICY "Users can manage transactions for their school" ON transactions
  FOR ALL
  USING (
    school_id = (SELECT school_id FROM users WHERE users.id = auth.uid())
  );

CREATE POLICY "Users can view invoices from their school" ON invoices
  FOR SELECT
  USING (
    school_id = (SELECT school_id FROM users WHERE users.id = auth.uid())
  );

CREATE POLICY "Users can manage invoices for their school" ON invoices
  FOR ALL
  USING (
    school_id = (SELECT school_id FROM users WHERE users.id = auth.uid())
  );


-- 4. Messaging Tables
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;

-- Conversations: linked via participants usually, but let's add school_id for easier scoping if not present
-- Assuming conversations have school_id or we rely on participant checks. 
-- Ideally, conversations should have a school_id if they are school-wide. 
-- However, for direct messages, it's about the participants.
-- Let's assume strict silo: Users can only talk to users in their school.

-- Simple Policy for Messages:
-- A user can see a message if they are a participant in the conversation
CREATE POLICY "Users can see messages in their conversations" ON messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants cp
      WHERE cp.conversation_id = messages.conversation_id
      AND cp.user_id = auth.uid()
    )
  );

-- A user can insert a message if they are a participant
CREATE POLICY "Users can send messages to their conversations" ON messages
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversation_participants cp
      WHERE cp.conversation_id = messages.conversation_id
      AND cp.user_id = auth.uid()
    )
  );

-- Conversation Participants RLS
CREATE POLICY "Users can see their own participant entries" ON conversation_participants
  FOR SELECT
  USING (
    user_id = auth.uid() OR
    -- Also see other participants in conversations they are in (to know who they are talking to)
    conversation_id IN (
      SELECT conversation_id FROM conversation_participants WHERE user_id = auth.uid()
    )
  );

-- Note: We are relying on the Application Layer (messagingService) to ensure 
-- that when creating a conversation, only users from the same school are added.
-- RLS here makes sure you can't read messages of convos you aren't in.
