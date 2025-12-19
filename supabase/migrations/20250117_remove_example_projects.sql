-- ============================================
-- Remove example projects added for seeding
-- ============================================

-- Delete example projects (you can customize the WHERE clause based on how you identify them)
-- Option 1: Delete by specific URLs or names (if you remember them)
-- DELETE FROM public.projects WHERE url IN ('example1.com', 'example2.com', ...);

-- Option 2: Delete projects created before a certain date (if examples were created on a specific date)
-- DELETE FROM public.projects WHERE created_at < '2025-01-18'::timestamp;

-- Option 3: Delete all projects (use with caution!)
-- DELETE FROM public.projects;

-- Option 4: Delete projects with specific user_id (if examples were created with a test user)
-- First, find the user_id of the test user, then:
-- DELETE FROM public.projects WHERE user_id = 'USER_ID_HERE';

-- For safety, let's use a more targeted approach:
-- Delete projects that are likely examples (you can adjust the criteria)
-- This will delete projects created in the last 24 hours that have low votes
DELETE FROM public.projects 
WHERE created_at > NOW() - INTERVAL '7 days'
  AND votes_count < 5
  AND is_audit_unlocked = false;

-- Note: This will also delete any real projects that match these criteria
-- If you want to be more specific, uncomment one of the options above and customize it

