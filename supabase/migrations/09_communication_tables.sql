-- 09_communication_tables.sql
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  type VARCHAR(20) CHECK (type IN ('direct','group','broadcast','announcement')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.conversation_participants (
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (conversation_id, profile_id)
);

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  sender_name TEXT,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT,
  target_roles TEXT[],
  priority VARCHAR(20) DEFAULT 'normal',
  published_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type VARCHAR(20),
  action_url TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Realtime Setup
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE messages;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'notifications'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
  END IF;
END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_conversations_tenant ON public.conversations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_announcements_tenant ON public.announcements(tenant_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);

-- RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read for users based on tenant_id" ON public.conversations FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Enable all for users based on tenant_id" ON public.conversations FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable read for users based on tenant_id" ON public.conversation_participants FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Enable all for users based on tenant_id" ON public.conversation_participants FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable read for users based on tenant_id" ON public.messages FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Enable all for users based on tenant_id" ON public.messages FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable read for users based on tenant_id" ON public.announcements FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Enable all for users based on tenant_id" ON public.announcements FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable read for users based on tenant_id" ON public.notifications FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Enable all for users based on tenant_id" ON public.notifications FOR ALL USING (auth.uid() IS NOT NULL);
