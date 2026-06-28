-- AnomaFix Hyperlocal Civic Issue Platform - Database Schema
-- Compatible with PostgreSQL and Supabase
-- SPDX-License-Identifier: Apache-2.0

-- Create custom role/user status types
CREATE TYPE user_role AS ENUM ('Citizen', 'Volunteer', 'Government Officer', 'Admin');
CREATE TYPE report_status AS ENUM ('Pending', 'AI Reviewed', 'Community Verified', 'Assigned', 'In Progress', 'Resolved', 'Closed');
CREATE TYPE report_severity AS ENUM ('Low', 'Medium', 'High', 'Critical');

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  avatar TEXT,
  role user_role DEFAULT 'Citizen' NOT NULL,
  points INTEGER DEFAULT 0 NOT NULL,
  level INTEGER DEFAULT 1 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 2. REPORTS TABLE
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  severity report_severity DEFAULT 'Medium' NOT NULL,
  status report_status DEFAULT 'Pending' NOT NULL,
  department VARCHAR(100) NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  address VARCHAR(500),
  confidence DOUBLE PRECISION DEFAULT 1.0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 3. REPORT IMAGES TABLE
CREATE TABLE IF NOT EXISTS report_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 4. COMMENTS TABLE
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 5. VOTES TABLE
-- Stores community verification upvotes or duplicate labels
CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  vote VARCHAR(50) DEFAULT 'upvote' NOT NULL, -- 'upvote' (verify) or 'duplicate'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  UNIQUE(report_id, user_id, vote)
);

-- 6. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 7. ACHIEVEMENTS TABLE
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  badge VARCHAR(100) NOT NULL,
  points INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- -----------------------------------------------------------------
-- SEED DATA
-- -----------------------------------------------------------------

-- Seed initial mock users (Admin, Officer, Volunteer, Citizen)
INSERT INTO users (id, name, email, avatar, role, points, level) VALUES
('d11c1e5a-73d7-4009-848e-f14bfca932cb', 'Amara Vance', 'amara@anomafix.org', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', 'Admin', 4500, 15),
('e22c1e5a-73d7-4009-848e-f14bfca932cb', 'Officer David Miller', 'david.m@citygov.us', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'Government Officer', 1200, 5),
('f33c1e5a-73d7-4009-848e-f14bfca932cb', 'Liam Carter', 'liam@greenvolunteers.org', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 'Volunteer', 2450, 9),
('a44c1e5a-73d7-4009-848e-f14bfca932cb', 'Sarah Jenkins', 'sarah.j@gmail.com', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', 'Citizen', 350, 2);

-- Seed initial reports
INSERT INTO reports (id, user_id, title, description, category, severity, status, department, latitude, longitude, address, confidence) VALUES
('b11a1e5a-73d7-4009-848e-f14bfca932ca', 'a44c1e5a-73d7-4009-848e-f14bfca932cb', 'Massive road pothole on main commercial crossing', 'A severe pothole approximately 1 meter wide and 15cm deep has formed at the center of the intersection, causing sudden braking and severe minor collisions.', 'Potholes', 'Critical', 'Assigned', 'Public Works', 37.7749, -122.4194, '845 Market St, San Francisco, CA 94103', 0.96),
('b22a1e5a-73d7-4009-848e-f14bfca932ca', 'f33c1e5a-73d7-4009-848e-f14bfca932cb', 'Broken park streetlight causing complete dark zones', 'Streetlight #104 is completely unlit. The surrounding walking trails are Pitch Black, posing a severe safety risk to evening runners.', 'Streetlights', 'Medium', 'AI Reviewed', 'Traffic & Transit', 37.7801, -122.4225, 'Jefferson Square Park, San Francisco, CA 94102', 0.94),
('b33a1e5a-73d7-4009-848e-f14bfca932ca', 'a44c1e5a-73d7-4009-848e-f14bfca932cb', 'Burst water main spilling thousands of gallons', 'High pressure fresh water is spraying out from the sidewalk expansion joint, creating massive flows of muddy water pooling near standard sewers.', 'Water Leakage', 'High', 'In Progress', 'Water & Sewerage', 37.7699, -122.4468, '1800 Haight St, San Francisco, CA 94117', 0.98),
('b44a1e5a-73d7-4009-848e-f14bfca932ca', 'f33c1e5a-73d7-4009-848e-f14bfca932cb', 'Illegal commercial electronic waste dumping', 'Multiple CRT monitors, obsolete commercial printers, and damaged server parts have been dumped directly behind the green waste bins overnight.', 'Illegal Dumping', 'Medium', 'Community Verified', 'Sanitation', 37.7599, -122.4348, '4041 24th St, San Francisco, CA 94114', 0.91);

-- Seed report images
INSERT INTO report_images (report_id, image_url) VALUES
('b11a1e5a-73d7-4009-848e-f14bfca932ca', 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=600'),
('b22a1e5a-73d7-4009-848e-f14bfca932ca', 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=600'),
('b33a1e5a-73d7-4009-848e-f14bfca932ca', 'https://images.unsplash.com/photo-1542060748-10c28b629f6f?w=600'),
('b44a1e5a-73d7-4009-848e-f14bfca932ca', 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=600');

-- Seed comments
INSERT INTO comments (report_id, user_id, comment) VALUES
('b11a1e5a-73d7-4009-848e-f14bfca932ca', 'f33c1e5a-73d7-4009-848e-f14bfca932cb', 'Can verify! Almost damaged my bike wheel riding past this yesterday. Very dangerous at night!'),
('b11a1e5a-73d7-4009-848e-f14bfca932ca', 'e22c1e5a-73d7-4009-848e-f14bfca932cb', 'Work order has been dispatched to team Bravo. Scheduled for repair on Monday morning.'),
('b33a1e5a-73d7-4009-848e-f14bfca932ca', 'e22c1e5a-73d7-4009-848e-f14bfca932cb', 'Emergency water control valve closed. Crew is on-site repairing the pipe collar.');

-- Seed votes
INSERT INTO votes (report_id, user_id, vote) VALUES
('b11a1e5a-73d7-4009-848e-f14bfca932ca', 'f33c1e5a-73d7-4009-848e-f14bfca932cb', 'upvote'),
('b11a1e5a-73d7-4009-848e-f14bfca932ca', 'd11c1e5a-73d7-4009-848e-f14bfca932cb', 'upvote'),
('b22a1e5a-73d7-4009-848e-f14bfca932ca', 'a44c1e5a-73d7-4009-848e-f14bfca932cb', 'upvote');

-- Seed achievements
INSERT INTO achievements (user_id, badge, points) VALUES
('f33c1e5a-73d7-4009-848e-f14bfca932cb', 'Pothole Patrol', 500),
('f33c1e5a-73d7-4009-848e-f14bfca932cb', 'Street Guardian', 800),
('a44c1e5a-73d7-4009-848e-f14bfca932cb', 'First Responder', 150);
