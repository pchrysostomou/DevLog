-- Create logs table
CREATE TABLE logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text,
  hours numeric DEFAULT 0,
  tags text[] DEFAULT '{}',
  is_public boolean DEFAULT false,
  log_date date NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create skills table
CREATE TABLE skills (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  category text,
  color text,
  target_hours numeric DEFAULT 0,
  started_at date DEFAULT CURRENT_DATE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create log_skills junction table
CREATE TABLE log_skills (
  log_id uuid REFERENCES public.logs(id) ON DELETE CASCADE NOT NULL,
  skill_id uuid REFERENCES public.skills(id) ON DELETE CASCADE NOT NULL,
  hours_spent numeric DEFAULT 0,
  PRIMARY KEY (log_id, skill_id)
);

-- Enable RLS
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE log_skills ENABLE ROW LEVEL SECURITY;

-- Policies for logs
CREATE POLICY "Users can manage their own logs." ON logs
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Public logs are viewable by everyone." ON logs
  FOR SELECT USING (is_public = true);

-- Policies for skills
CREATE POLICY "Users can manage their own skills." ON skills
  FOR ALL USING (auth.uid() = user_id);

-- Policies for log_skills (Inherits implicitly since you have to own the log/skill to relate them usually, but we define explicit policy)
CREATE POLICY "Users can manage log_skills if they own the log" ON log_skills
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM logs WHERE logs.id = log_skills.log_id AND logs.user_id = auth.uid()
    )
  );
