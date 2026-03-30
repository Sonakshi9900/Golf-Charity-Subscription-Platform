-- Run this in your Supabase SQL editor to create the necessary tables.

-- ENABLE UUID IF NOT ALREADY
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS PROFILE EXTENSION
CREATE TABLE profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  full_name TEXT NOT NULL,
  charity_selected TEXT DEFAULT 'Cancer Foundation',
  total_donated NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. SUBSCRIPTIONS (Dummy data, just storing status)
CREATE TABLE subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  plan_type TEXT NOT NULL, -- 'monthly' or 'yearly'
  status TEXT DEFAULT 'active', -- 'active' or 'inactive'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. GOLF SCORES
CREATE TABLE scores (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  score INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note: We only keep 5 scores per user. We will handle the "max 5 delete oldest" logic in the application code, but it could be a trigger too.
CREATE OR REPLACE FUNCTION delete_old_scores() RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM scores 
  WHERE user_id = NEW.user_id 
  AND id NOT IN (
    SELECT id FROM scores 
    WHERE user_id = NEW.user_id 
    ORDER BY created_at DESC 
    LIMIT 5
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER maintain_five_scores
AFTER INSERT ON scores
FOR EACH ROW
EXECUTE FUNCTION delete_old_scores();

-- 4. DRAWS
CREATE TABLE draws (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  winning_numbers INTEGER[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

-- Allow users to see their own data
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own subscriptions" ON subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own scores" ON scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own scores" ON scores FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Everyone can view draws
CREATE POLICY "Draws viewable by everyone" ON draws FOR SELECT USING (true);
