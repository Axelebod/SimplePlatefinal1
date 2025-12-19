-- ============================================
-- PHASE 2: SimplePlate Studio - Migration
-- ============================================
-- Community platform for Micro-SaaS projects
-- ============================================

-- 1. UPDATE PROFILES TABLE (Unified Credits System)
-- ============================================
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS last_weekly_refill TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS daily_earned_credits INTEGER DEFAULT 0 NOT NULL,
  ADD COLUMN IF NOT EXISTS last_activity_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL;

-- 2. CREATE PROJECTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('saas', 'tool', 'app', 'website', 'other')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'rejected')),
  ai_score JSONB,
  is_audit_unlocked BOOLEAN DEFAULT FALSE NOT NULL,
  votes_count INTEGER DEFAULT 0 NOT NULL,
  boosted_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. CREATE REVIEWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) > 100),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  -- Prevent duplicate reviews from same author on same project
  UNIQUE(project_id, author_id)
);

-- 4. CREATE VOTES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  -- One vote per user per project
  UNIQUE(project_id, user_id)
);

-- 5. CREATE INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_votes_count ON public.projects(votes_count DESC);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_project_id ON public.reviews(project_id);
CREATE INDEX IF NOT EXISTS idx_reviews_author_id ON public.reviews(author_id);
CREATE INDEX IF NOT EXISTS idx_votes_project_id ON public.votes(project_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON public.votes(user_id);

-- 6. ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- 7. RLS POLICIES FOR PROJECTS
-- ============================================
-- Anyone can view published projects
DROP POLICY IF EXISTS "Anyone can view published projects" ON public.projects;
CREATE POLICY "Anyone can view published projects" ON public.projects
  FOR SELECT USING (status = 'published' OR auth.uid() = user_id);

-- Users can insert their own projects
DROP POLICY IF EXISTS "Users can insert own projects" ON public.projects;
CREATE POLICY "Users can insert own projects" ON public.projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own projects
DROP POLICY IF EXISTS "Users can update own projects" ON public.projects;
CREATE POLICY "Users can update own projects" ON public.projects
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own projects
DROP POLICY IF EXISTS "Users can delete own projects" ON public.projects;
CREATE POLICY "Users can delete own projects" ON public.projects
  FOR DELETE USING (auth.uid() = user_id);

-- 8. RLS POLICIES FOR REVIEWS
-- ============================================
-- Anyone can view reviews
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;
CREATE POLICY "Anyone can view reviews" ON public.reviews
  FOR SELECT USING (true);

-- Authenticated users can insert reviews
DROP POLICY IF EXISTS "Users can insert reviews" ON public.reviews;
CREATE POLICY "Users can insert reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Users can update their own reviews
DROP POLICY IF EXISTS "Users can update own reviews" ON public.reviews;
CREATE POLICY "Users can update own reviews" ON public.reviews
  FOR UPDATE USING (auth.uid() = author_id);

-- Users can delete their own reviews
DROP POLICY IF EXISTS "Users can delete own reviews" ON public.reviews;
CREATE POLICY "Users can delete own reviews" ON public.reviews
  FOR DELETE USING (auth.uid() = author_id);

-- 9. RLS POLICIES FOR VOTES
-- ============================================
-- Anyone can view votes
DROP POLICY IF EXISTS "Anyone can view votes" ON public.votes;
CREATE POLICY "Anyone can view votes" ON public.votes
  FOR SELECT USING (true);

-- Authenticated users can insert votes
DROP POLICY IF EXISTS "Users can insert votes" ON public.votes;
CREATE POLICY "Users can insert votes" ON public.votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete their own votes
DROP POLICY IF EXISTS "Users can delete own votes" ON public.votes;
CREATE POLICY "Users can delete own votes" ON public.votes
  FOR DELETE USING (auth.uid() = user_id);

-- 10. FUNCTIONS FOR VOTE COUNTING
-- ============================================
CREATE OR REPLACE FUNCTION public.update_project_votes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.projects
    SET votes_count = votes_count + 1
    WHERE id = NEW.project_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.projects
    SET votes_count = GREATEST(0, votes_count - 1)
    WHERE id = OLD.project_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update votes_count automatically
DROP TRIGGER IF EXISTS trigger_update_votes_count ON public.votes;
CREATE TRIGGER trigger_update_votes_count
  AFTER INSERT OR DELETE ON public.votes
  FOR EACH ROW EXECUTE FUNCTION public.update_project_votes_count();

-- 11. FUNCTION FOR WEEKLY REFILL
-- ============================================
CREATE OR REPLACE FUNCTION public.check_weekly_refill(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_last_refill TIMESTAMP WITH TIME ZONE;
  v_current_credits INTEGER;
  v_days_since_refill INTEGER;
BEGIN
  -- Get user's last refill and current credits
  SELECT last_weekly_refill, credits INTO v_last_refill, v_current_credits
  FROM public.profiles
  WHERE id = p_user_id;

  -- If no refill date, set it to now and give credits
  IF v_last_refill IS NULL THEN
    UPDATE public.profiles
    SET last_weekly_refill = timezone('utc'::text, now()),
        credits = GREATEST(5, credits)
    WHERE id = p_user_id;
    RETURN TRUE;
  END IF;

  -- Calculate days since last refill
  v_days_since_refill := EXTRACT(EPOCH FROM (timezone('utc'::text, now()) - v_last_refill)) / 86400;

  -- If 7+ days passed AND credits < 5, top up to 5
  IF v_days_since_refill >= 7 AND v_current_credits < 5 THEN
    UPDATE public.profiles
    SET last_weekly_refill = timezone('utc'::text, now()),
        credits = 5
    WHERE id = p_user_id;
    RETURN TRUE;
  END IF;

  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. FUNCTION FOR EARNING CREDITS FROM REVIEWS
-- ============================================
CREATE OR REPLACE FUNCTION public.earn_credits_from_review(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_daily_earned INTEGER;
  v_last_activity TIMESTAMP WITH TIME ZONE;
  v_credits_to_add INTEGER;
  v_max_daily_earnings INTEGER := 3; -- Max 3 credits per day from reviews
  v_review_credit_value NUMERIC := 0.5; -- 0.5 credits per review (6 reviews = 3 credits max per day)
BEGIN
  -- Get user's daily earnings and last activity
  SELECT daily_earned_credits, last_activity_date INTO v_daily_earned, v_last_activity
  FROM public.profiles
  WHERE id = p_user_id;

  -- Reset daily counter if it's a new day
  IF v_last_activity IS NULL OR v_last_activity::date < timezone('utc'::text, now())::date THEN
    UPDATE public.profiles
    SET daily_earned_credits = 0,
        last_activity_date = timezone('utc'::text, now())
    WHERE id = p_user_id;
    v_daily_earned := 0;
  END IF;

  -- Check if user has reached daily limit
  IF v_daily_earned >= v_max_daily_earnings THEN
    RETURN 0; -- Already at daily limit
  END IF;

  -- Calculate credits to add (0.5 per review, but cap at daily limit)
  v_credits_to_add := LEAST(
    v_review_credit_value,
    v_max_daily_earnings - v_daily_earned
  );

  -- Update credits and daily counter
  UPDATE public.profiles
  SET credits = credits + v_credits_to_add,
      daily_earned_credits = daily_earned_credits + v_credits_to_add,
      last_activity_date = timezone('utc'::text, now())
  WHERE id = p_user_id;

  RETURN v_credits_to_add;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 13. FUNCTION FOR UNLOCKING AI AUDIT
-- ============================================
CREATE OR REPLACE FUNCTION public.unlock_project_audit(p_project_id UUID, p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  v_project RECORD;
  v_user_credits INTEGER;
  v_audit_cost INTEGER := 50;
  v_result JSON;
BEGIN
  -- Get project and verify ownership
  SELECT * INTO v_project
  FROM public.projects
  WHERE id = p_project_id AND user_id = p_user_id;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Project not found or not owned by user');
  END IF;

  -- Check if already unlocked
  IF v_project.is_audit_unlocked THEN
    RETURN json_build_object('success', false, 'error', 'Audit already unlocked');
  END IF;

  -- Get user credits
  SELECT credits INTO v_user_credits
  FROM public.profiles
  WHERE id = p_user_id;

  -- Check if user has enough credits
  IF v_user_credits < v_audit_cost THEN
    RETURN json_build_object('success', false, 'error', 'Insufficient credits', 'required', v_audit_cost, 'available', v_user_credits);
  END IF;

  -- Deduct credits and unlock audit
  UPDATE public.profiles
  SET credits = credits - v_audit_cost
  WHERE id = p_user_id;

  -- Generate mock AI audit (replace with real AI later)
  UPDATE public.projects
  SET is_audit_unlocked = TRUE,
      ai_score = json_build_object(
        'overall_score', 75,
        'categories', json_build_array(
          json_build_object('name', 'Design', 'score', 80, 'issues', json_build_array('Consider adding more whitespace')),
          json_build_object('name', 'Copywriting', 'score', 70, 'issues', json_build_array('Headlines could be more compelling'), 'suggested_tools', json_build_array('business-plan-generator')),
          json_build_object('name', 'Technical', 'score', 85, 'issues', json_build_array('JSON structure could be optimized'), 'suggested_tools', json_build_array('formateur-json'))
        ),
        'generated_at', timezone('utc'::text, now())
      )
  WHERE id = p_project_id;

  RETURN json_build_object('success', true, 'credits_remaining', v_user_credits - v_audit_cost);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 14. FUNCTION FOR BOOSTING PROJECT (100 credits for 24h)
-- ============================================
CREATE OR REPLACE FUNCTION public.boost_project(p_project_id UUID, p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  v_project RECORD;
  v_user_credits INTEGER;
  v_boost_cost INTEGER := 100;
  v_boost_duration INTERVAL := '24 hours';
BEGIN
  -- Get project and verify ownership
  SELECT * INTO v_project
  FROM public.projects
  WHERE id = p_project_id AND user_id = p_user_id;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Project not found or not owned by user');
  END IF;

  -- Get user credits
  SELECT credits INTO v_user_credits
  FROM public.profiles
  WHERE id = p_user_id;

  -- Check if user has enough credits
  IF v_user_credits < v_boost_cost THEN
    RETURN json_build_object('success', false, 'error', 'Insufficient credits', 'required', v_boost_cost, 'available', v_user_credits);
  END IF;

  -- Check if already boosted and still active
  IF v_project.boosted_until IS NOT NULL AND v_project.boosted_until > timezone('utc'::text, now()) THEN
    RETURN json_build_object('success', false, 'error', 'Project is already boosted');
  END IF;

  -- Deduct credits
  UPDATE public.profiles
  SET credits = credits - v_boost_cost
  WHERE id = p_user_id;

  -- Boost project for 24 hours
  UPDATE public.projects
  SET boosted_until = timezone('utc'::text, now()) + v_boost_duration
  WHERE id = p_project_id;

  RETURN json_build_object('success', true, 'credits_remaining', v_user_credits - v_boost_cost, 'boosted_until', timezone('utc'::text, now()) + v_boost_duration);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 15. TRIGGER FOR UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

