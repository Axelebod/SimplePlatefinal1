-- ============================================
-- Remove example projects added for seeding
-- ============================================
-- This migration removes the 10 example projects that were added to populate the Studio

-- Delete all projects (since these were examples added for testing)
-- The CASCADE will automatically delete associated reviews and votes
DELETE FROM public.projects;

-- Note: This deletes ALL projects. If you have real user projects you want to keep,
-- you should first identify which projects are examples and delete only those.
-- You can do this by:
-- 1. Checking the projects table to see which ones are examples
-- 2. Deleting only those specific projects by ID or other criteria
-- Example: DELETE FROM public.projects WHERE id IN ('uuid1', 'uuid2', ...);

