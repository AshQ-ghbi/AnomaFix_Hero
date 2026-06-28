/**
 * Supabase SDK Mocking & State Engine
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Dynamic credentials store supporting runtime update and env variables
let cachedUrl = ((import.meta as any).env?.VITE_SUPABASE_URL) || localStorage.getItem('anomafix_supabase_url') || '';
let cachedKey = ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY) || localStorage.getItem('anomafix_supabase_anon_key') || '';


export function getSupabaseCredentials() {
  return {
    url: cachedUrl,
    key: cachedKey,
    isConfigured: !!(cachedUrl && cachedKey)
  };
}

export function setSupabaseCredentials(url: string, key: string) {
  cachedUrl = url;
  cachedKey = key;
  if (url && key) {
    localStorage.setItem('anomafix_supabase_url', url);
    localStorage.setItem('anomafix_supabase_anon_key', key);
    realSupabaseClient = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    });
  } else {
    localStorage.removeItem('anomafix_supabase_url');
    localStorage.removeItem('anomafix_supabase_anon_key');
    realSupabaseClient = null;
  }
  // Reinitialize the engine structure to listen or fetch from real client
  supabase.init();
}

export let realSupabaseClient: SupabaseClient | null = cachedUrl && cachedKey
  ? createClient(cachedUrl, cachedKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    })
  : null;

// Define standard types conforming to our schema.sql definition
export type UserRole = 'Citizen' | 'Volunteer' | 'Government Officer' | 'Admin';

export type ReportSeverity = 'Low' | 'Medium' | 'High' | 'Critical';
export type ReportStatus = 'Pending' | 'AI Reviewed' | 'Community Verified' | 'Assigned' | 'In Progress' | 'Resolved' | 'Closed';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  points: number;
  level: number;
  created_at: string;
}

export interface Report {
  id: string;
  user_id: string;
  user?: User;
  title: string;
  description: string;
  category: string;
  severity: ReportSeverity;
  status: ReportStatus;
  department: string;
  latitude: number;
  longitude: number;
  address: string;
  confidence: number;
  created_at: string;
  image_url?: string;
  upvotes_count?: number;
  comments_count?: number;
  is_upvoted_by_me?: boolean;
}

export interface Comment {
  id: string;
  report_id: string;
  user_id: string;
  user?: User;
  comment: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface Achievement {
  id: string;
  user_id: string;
  badge: string;
  points: number;
  created_at: string;
}

// Default Seed Data
const DEFAULT_USERS: User[] = [
  {
    id: 'd11c1e5a-73d7-4009-848e-f14bfca932cb',
    name: 'Amara Vance',
    email: 'amara@anomafix.org',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    role: 'Admin',
    points: 4500,
    level: 15,
    created_at: new Date('2026-01-15').toISOString(),
  },
  {
    id: 'e22c1e5a-73d7-4009-848e-f14bfca932cb',
    name: 'Officer David Miller',
    email: 'david.m@citygov.us',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    role: 'Government Officer',
    points: 1200,
    level: 5,
    created_at: new Date('2026-03-22').toISOString(),
  },
  {
    id: 'f33c1e5a-73d7-4009-848e-f14bfca932cb',
    name: 'Liam Carter',
    email: 'liam@greenvolunteers.org',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    role: 'Volunteer',
    points: 2450,
    level: 9,
    created_at: new Date('2026-02-10').toISOString(),
  },
  {
    id: 'a44c1e5a-73d7-4009-848e-f14bfca932cb',
    name: 'Sarah Jenkins',
    email: 'sarah.j@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    role: 'Citizen',
    points: 350,
    level: 2,
    created_at: new Date('2026-05-18').toISOString(),
  }
];

const DEFAULT_REPORTS: Report[] = [
  {
    id: 'b11a1e5a-73d7-4009-848e-f14bfca932ca',
    user_id: 'a44c1e5a-73d7-4009-848e-f14bfca932cb',
    title: 'Massive road pothole on main commercial crossing',
    description: 'A severe pothole approximately 1 meter wide and 15cm deep has formed at the center of the intersection, causing sudden braking and severe minor collisions.',
    category: 'Potholes',
    severity: 'Critical',
    status: 'Assigned',
    department: 'Public Works',
    latitude: 28.6304,
    longitude: 77.2177,
    address: 'Connaught Place, New Delhi, Delhi 110001, India',
    confidence: 0.96,
    image_url: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=600',
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'b22a1e5a-73d7-4009-848e-f14bfca932ca',
    user_id: 'f33c1e5a-73d7-4009-848e-f14bfca932cb',
    title: 'Broken park streetlight causing complete dark zones',
    description: 'Streetlight #104 is completely unlit. The surrounding walking trails are Pitch Black, posing a severe safety risk to evening runners.',
    category: 'Streetlights',
    severity: 'Medium',
    status: 'AI Reviewed',
    department: 'Traffic & Transit',
    latitude: 12.9716,
    longitude: 77.5946,
    address: 'Indiranagar, Bengaluru, Karnataka 560038, India',
    confidence: 0.94,
    image_url: 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=600',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'b33a1e5a-73d7-4009-848e-f14bfca932ca',
    user_id: 'a44c1e5a-73d7-4009-848e-f14bfca932cb',
    title: 'Burst water main spilling thousands of gallons',
    description: 'High pressure fresh water is spraying out from the sidewalk expansion joint, creating massive flows of muddy water pooling near standard sewers.',
    category: 'Water Leakage',
    severity: 'High',
    status: 'In Progress',
    department: 'Water & Sewerage',
    latitude: 19.0600,
    longitude: 72.8250,
    address: 'Bandra West, Mumbai, Maharashtra 400050, India',
    confidence: 0.98,
    image_url: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?w=600',
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'b44a1e5a-73d7-4009-848e-f14bfca932ca',
    user_id: 'f33c1e5a-73d7-4009-848e-f14bfca932cb',
    title: 'Illegal commercial electronic waste dumping',
    description: 'Multiple CRT monitors, obsolete commercial printers, and damaged server parts have been dumped directly behind the green waste bins overnight.',
    category: 'Illegal Dumping',
    severity: 'Medium',
    status: 'Community Verified',
    department: 'Sanitation',
    latitude: 22.5726,
    longitude: 88.4345,
    address: 'Salt Lake Sector V, Kolkata, West Bengal 700091, India',
    confidence: 0.91,
    image_url: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=600',
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'b55a1e5a-73d7-4009-848e-f14bfca932ca',
    user_id: 'a44c1e5a-73d7-4009-848e-f14bfca932cb',
    title: 'Pedestrian safety barrier damaged',
    description: 'Heavy vehicular impact has broken the safety barriers on the sidewalk crossing. Pedestrians are forced to step onto the active road.',
    category: 'Others',
    severity: 'High',
    status: 'Pending',
    department: 'Public Works',
    latitude: 51.5074,
    longitude: -0.1278,
    address: 'Central London, United Kingdom',
    confidence: 0.89,
    image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'b66a1e5a-73d7-4009-848e-f14bfca932ca',
    user_id: 'f33c1e5a-73d7-4009-848e-f14bfca932cb',
    title: 'Defaced public building and broken windows',
    description: 'Vandalism and structural damage discovered on the historical community library front. Glass shards are scattered on the entrance walkway.',
    category: 'Others',
    severity: 'Low',
    status: 'AI Reviewed',
    department: 'Administration',
    latitude: 40.7831,
    longitude: -73.9654,
    address: 'Central Park, Manhattan, New York, USA',
    confidence: 0.93,
    image_url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=600',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

const DEFAULT_COMMENTS: Comment[] = [
  {
    id: 'c11',
    report_id: 'b11a1e5a-73d7-4009-848e-f14bfca932ca',
    user_id: 'f33c1e5a-73d7-4009-848e-f14bfca932cb',
    comment: 'Can verify! Almost damaged my bike wheel riding past this yesterday. Very dangerous at night!',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'c22',
    report_id: 'b11a1e5a-73d7-4009-848e-f14bfca932ca',
    user_id: 'e22c1e5a-73d7-4009-848e-f14bfca932cb',
    comment: 'Work order has been dispatched to team Bravo. Scheduled for repair on Monday morning.',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'c33',
    report_id: 'b33a1e5a-73d7-4009-848e-f14bfca932ca',
    user_id: 'e22c1e5a-73d7-4009-848e-f14bfca932cb',
    comment: 'Emergency water control valve closed. Crew is on-site repairing the pipe collar.',
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  }
];

const DEFAULT_VOTES = [
  { report_id: 'b11a1e5a-73d7-4009-848e-f14bfca932ca', user_id: 'f33c1e5a-73d7-4009-848e-f14bfca932cb', vote: 'upvote' },
  { report_id: 'b11a1e5a-73d7-4009-848e-f14bfca932ca', user_id: 'd11c1e5a-73d7-4009-848e-f14bfca932cb', vote: 'upvote' },
  { report_id: 'b22a1e5a-73d7-4009-848e-f14bfca932ca', user_id: 'a44c1e5a-73d7-4009-848e-f14bfca932cb', vote: 'upvote' }
];

const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: 'n11',
    user_id: 'a44c1e5a-73d7-4009-848e-f14bfca932cb',
    title: 'Report Assigned',
    message: 'Your report "Massive road pothole on main commercial crossing" has been reviewed by AI and assigned to the Public Works department.',
    read: false,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'n22',
    user_id: 'a44c1e5a-73d7-4009-848e-f14bfca932cb',
    title: 'Resolution In Progress',
    message: 'Your report "Burst water main spilling thousands of gallons" is currently being worked on by Water & Sewerage technicians.',
    read: true,
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  }
];

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'a1',
    user_id: 'f33c1e5a-73d7-4009-848e-f14bfca932cb',
    badge: 'Pothole Patrol',
    points: 500,
    created_at: new Date('2026-05-01').toISOString(),
  },
  {
    id: 'a2',
    user_id: 'f33c1e5a-73d7-4009-848e-f14bfca932cb',
    badge: 'Street Guardian',
    points: 800,
    created_at: new Date('2026-05-15').toISOString(),
  },
  {
    id: 'a3',
    user_id: 'a44c1e5a-73d7-4009-848e-f14bfca932cb',
    badge: 'First Responder',
    points: 150,
    created_at: new Date('2026-06-20').toISOString(),
  }
];

class SupabaseStateEngine {
  private users: User[] = [];
  private reports: Report[] = [];
  private comments: Comment[] = [];
  private votes: { report_id: string; user_id: string; vote: string }[] = [];
  private notifications: Notification[] = [];
  private achievements: Achievement[] = [];
  private currentUser: User | null = null;
  private listeners: (() => void)[] = [];

  constructor() {
    this.init();
  }

  public init() {
    // Load existing or seed
    const storedUsers = localStorage.getItem('anomafix_users');
    const storedReports = localStorage.getItem('anomafix_reports');
    const storedComments = localStorage.getItem('anomafix_comments');
    const storedVotes = localStorage.getItem('anomafix_votes');
    const storedNotifications = localStorage.getItem('anomafix_notifications');
    const storedAchievements = localStorage.getItem('anomafix_achievements');
    const storedCurrentUserId = localStorage.getItem('anomafix_current_user_id');

    if (storedUsers) {
      this.users = JSON.parse(storedUsers);
    } else {
      this.users = [...DEFAULT_USERS];
      this.saveUsers();
    }

    if (storedReports) {
      try {
        const parsed = JSON.parse(storedReports) as Report[];
        this.reports = parsed.map(r => {
          if (r.title === 'Burst water main spilling thousands of gallons') {
            r.image_url = 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?w=600';
          }
          return r;
        });
        this.saveReports();
      } catch (e) {
        console.error("Failed to parse cached reports", e);
        this.reports = [...DEFAULT_REPORTS];
        this.saveReports();
      }
    } else {
      this.reports = [...DEFAULT_REPORTS];
      this.saveReports();
    }

    if (storedComments) {
      this.comments = JSON.parse(storedComments);
    } else {
      this.comments = [...DEFAULT_COMMENTS];
      this.saveComments();
    }

    if (storedVotes) {
      this.votes = JSON.parse(storedVotes);
    } else {
      this.votes = [...DEFAULT_VOTES];
      this.saveVotes();
    }

    if (storedNotifications) {
      this.notifications = JSON.parse(storedNotifications);
    } else {
      this.notifications = [...DEFAULT_NOTIFICATIONS];
      this.saveNotifications();
    }

    if (storedAchievements) {
      this.achievements = JSON.parse(storedAchievements);
    } else {
      this.achievements = [...DEFAULT_ACHIEVEMENTS];
      this.saveAchievements();
    }

    // Set initial user (default to Sarah the Citizen)
    const activeId = storedCurrentUserId || 'a44c1e5a-73d7-4009-848e-f14bfca932cb';
    this.currentUser = this.users.find(u => u.id === activeId) || this.users[0] || null;

    // Listen to Real Supabase Auth state changes if live client is active
    if (realSupabaseClient) {
      realSupabaseClient.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const meta = session.user.user_metadata || {};
          const email = session.user.email || '';
          const phone = session.user.phone || '';
          const name = meta.name || meta.full_name || email.split('@')[0] || phone || 'Supabase User';
          
          // Map user role safely
          let role: UserRole = 'Citizen';
          if (meta.role === 'Admin' || meta.role === 'Volunteer' || meta.role === 'Government Officer') {
            role = meta.role;
          } else if (email.endsWith('@anomafix.org') && email.startsWith('amara')) {
            role = 'Admin';
          } else if (email.endsWith('@greenvolunteers.org') || email.startsWith('liam')) {
            role = 'Volunteer';
          } else if (email.endsWith('@citygov.us') || email.startsWith('david')) {
            role = 'Government Officer';
          }

          const avatar = meta.avatar || meta.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
          
          const existingUserIdx = this.users.findIndex(u => u.id === session.user.id || u.email === email);
          let matchedUser: User;
          
          if (existingUserIdx > -1) {
            this.users[existingUserIdx] = {
              ...this.users[existingUserIdx],
              id: session.user.id,
              name,
              role,
              avatar
            };
            matchedUser = this.users[existingUserIdx];
          } else {
            matchedUser = {
              id: session.user.id,
              name,
              email,
              avatar,
              role,
              points: role === 'Admin' ? 5000 : role === 'Government Officer' ? 1200 : role === 'Volunteer' ? 2450 : 350,
              level: role === 'Admin' ? 15 : role === 'Government Officer' ? 5 : role === 'Volunteer' ? 9 : 2,
              created_at: session.user.created_at || new Date().toISOString()
            };
            this.users.push(matchedUser);
          }
          this.currentUser = matchedUser;
          localStorage.setItem('anomafix_current_user_id', matchedUser.id);
          this.saveUsers();
          
          // Try to sync database records in the background!
          this.syncWithRealSupabase().catch(err => console.warn("Initial DB sync failed:", err));
        } else {
          // Keep current mock user or fallback
          const defaultActive = this.users.find(u => u.id === 'a44c1e5a-73d7-4009-848e-f14bfca932cb');
          if (defaultActive) {
            this.currentUser = defaultActive;
            localStorage.setItem('anomafix_current_user_id', defaultActive.id);
          }
          this.notify();
        }
      });
      
      // Initial trigger
      this.syncWithRealSupabase().catch(err => console.warn("Initial sync failed:", err));
    }
  }

  // Sync real database tables if they exist in Supabase console
  public async syncWithRealSupabase() {
    if (!realSupabaseClient) return;
    try {
      // 1. Sync User Profiles
      const { data: dbUsers, error: usersErr } = await realSupabaseClient.from('users').select('*');
      if (!usersErr && dbUsers && dbUsers.length > 0) {
        this.users = dbUsers.map(u => ({
          id: u.id,
          name: u.name,
          email: u.email,
          avatar: u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.name)}`,
          role: u.role as UserRole,
          points: u.points ?? 0,
          level: u.level ?? 1,
          created_at: u.created_at || new Date().toISOString()
        }));
        this.saveUsers();
      }

      // 2. Sync Reports
      const { data: dbReports, error: reportsErr } = await realSupabaseClient.from('reports').select('*');
      if (!reportsErr && dbReports && dbReports.length > 0) {
        this.reports = dbReports.map(r => ({
          id: r.id,
          user_id: r.user_id,
          title: r.title,
          description: r.description,
          category: r.category,
          severity: r.severity as ReportSeverity,
          status: r.status as ReportStatus,
          department: r.department,
          latitude: Number(r.latitude),
          longitude: Number(r.longitude),
          address: r.address || 'Street address undetected',
          confidence: Number(r.confidence ?? 1.0),
          created_at: r.created_at || new Date().toISOString(),
          image_url: r.image_url || 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=600'
        }));
        this.saveReports();
      }

      // 3. Sync Comments
      const { data: dbComments, error: commentsErr } = await realSupabaseClient.from('comments').select('*');
      if (!commentsErr && dbComments && dbComments.length > 0) {
        this.comments = dbComments.map(c => ({
          id: c.id,
          report_id: c.report_id,
          user_id: c.user_id,
          comment: c.comment,
          created_at: c.created_at || new Date().toISOString()
        }));
        this.saveComments();
      }

      // 4. Sync Votes
      const { data: dbVotes, error: votesErr } = await realSupabaseClient.from('votes').select('*');
      if (!votesErr && dbVotes && dbVotes.length > 0) {
        this.votes = dbVotes.map(v => ({
          report_id: v.report_id,
          user_id: v.user_id,
          vote: v.vote
        }));
        this.saveVotes();
      }

      // 5. Sync Notifications
      if (this.currentUser) {
        const { data: dbNotifs, error: notifsErr } = await realSupabaseClient
          .from('notifications')
          .select('*')
          .eq('user_id', this.currentUser.id);
        if (!notifsErr && dbNotifs) {
          this.notifications = dbNotifs.map(n => ({
            id: n.id,
            user_id: n.user_id,
            title: n.title,
            message: n.message,
            read: !!n.read,
            created_at: n.created_at || new Date().toISOString()
          }));
          this.saveNotifications();
        }
      }

      this.notify();
    } catch (e) {
      console.warn("Real database sync caught exception:", e);
    }
  }


  // --- SAVE HELPERS ---
  private saveUsers() { localStorage.setItem('anomafix_users', JSON.stringify(this.users)); this.notify(); }
  private saveReports() { localStorage.setItem('anomafix_reports', JSON.stringify(this.reports)); this.notify(); }
  private saveComments() { localStorage.setItem('anomafix_comments', JSON.stringify(this.comments)); this.notify(); }
  private saveVotes() { localStorage.setItem('anomafix_votes', JSON.stringify(this.votes)); this.notify(); }
  private saveNotifications() { localStorage.setItem('anomafix_notifications', JSON.stringify(this.notifications)); this.notify(); }
  private saveAchievements() { localStorage.setItem('anomafix_achievements', JSON.stringify(this.achievements)); this.notify(); }

  // --- REALTIME EVENT BROADCASTING ---
  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  // --- AUTH METHODS ---
  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public switchRole(role: UserRole) {
    const matchedUser = this.users.find(u => u.role === role);
    if (matchedUser) {
      this.currentUser = matchedUser;
      localStorage.setItem('anomafix_current_user_id', matchedUser.id);
      this.notify();
    } else {
      // Create a new user with that role
      const newUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        name: `New ${role}`,
        email: `${role.toLowerCase().replace(/ /g, '')}@anomafix.org`,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${role}`,
        role: role,
        points: role === 'Admin' ? 5000 : role === 'Government Officer' ? 1500 : role === 'Volunteer' ? 800 : 0,
        level: role === 'Admin' ? 10 : role === 'Government Officer' ? 5 : role === 'Volunteer' ? 3 : 1,
        created_at: new Date().toISOString()
      };
      this.users.push(newUser);
      this.saveUsers();
      this.currentUser = newUser;
      localStorage.setItem('anomafix_current_user_id', newUser.id);
      this.notify();
    }
  }

  public register(name: string, email: string, role: UserRole = 'Citizen') {
    const existing = this.users.find(u => u.email === email);
    if (existing) {
      this.currentUser = existing;
      localStorage.setItem('anomafix_current_user_id', existing.id);
      this.notify();
      return existing;
    }

    const newUser: User = {
      id: Math.random().toString(36).substring(2, 11),
      name: name,
      email: email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      role: role,
      points: 100, // starting gift
      level: 1,
      created_at: new Date().toISOString()
    };

    this.users.push(newUser);
    this.saveUsers();
    this.currentUser = newUser;
    localStorage.setItem('anomafix_current_user_id', newUser.id);
    this.notify();
    return newUser;
  }

  public logout() {
    this.currentUser = null;
    localStorage.removeItem('anomafix_current_user_id');
    this.notify();
  }

  // --- REPORTS DATABASE ---
  public getReports(): Report[] {
    return this.reports.map(report => {
      const user = this.users.find(u => u.id === report.user_id) || DEFAULT_USERS[3];
      const votesForReport = this.votes.filter(v => v.report_id === report.id);
      const commentsForReport = this.comments.filter(c => c.report_id === report.id);
      const isUpvotedByMe = this.currentUser ? this.votes.some(v => v.report_id === report.id && v.user_id === this.currentUser?.id && v.vote === 'upvote') : false;

      return {
        ...report,
        user,
        upvotes_count: votesForReport.filter(v => v.vote === 'upvote').length,
        comments_count: commentsForReport.length,
        is_upvoted_by_me: isUpvotedByMe
      };
    }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public getReportById(id: string): Report | null {
    const report = this.reports.find(r => r.id === id);
    if (!report) return null;
    const user = this.users.find(u => u.id === report.user_id);
    const votesForReport = this.votes.filter(v => v.report_id === report.id);
    const commentsForReport = this.comments.filter(c => c.report_id === report.id);
    const isUpvotedByMe = this.currentUser ? this.votes.some(v => v.report_id === report.id && v.user_id === this.currentUser?.id && v.vote === 'upvote') : false;

    return {
      ...report,
      user,
      upvotes_count: votesForReport.filter(v => v.vote === 'upvote').length,
      comments_count: commentsForReport.length,
      is_upvoted_by_me: isUpvotedByMe
    };
  }

  public createReport(reportData: Partial<Report>): Report {
    const authorId = this.currentUser?.id || 'a44c1e5a-73d7-4009-848e-f14bfca932cb';
    const newReport: Report = {
      id: Math.random().toString(36).substring(2, 11),
      user_id: authorId,
      title: reportData.title || 'Untitled Issue',
      description: reportData.description || '',
      category: reportData.category || 'Others',
      severity: reportData.severity || 'Medium',
      status: reportData.status || 'Pending',
      department: reportData.department || 'Administration',
      latitude: reportData.latitude || 37.7749,
      longitude: reportData.longitude || -122.4194,
      address: reportData.address || 'Street address undetected',
      confidence: reportData.confidence || 1.0,
      image_url: reportData.image_url || 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=600',
      created_at: new Date().toISOString()
    };

    this.reports.push(newReport);
    this.saveReports();

    // Reward citizen points for report filing
    if (this.currentUser) {
      this.addPointsToUser(this.currentUser.id, 100);
      this.createNotification(this.currentUser.id, 'Report Submitted', `Excellent work! Your report "${newReport.title}" was submitted successfully. You've earned 100 points!`);
    }

    return newReport;
  }

  public updateReportStatus(reportId: string, status: ReportStatus, officerNotes?: string) {
    this.reports = this.reports.map(r => {
      if (r.id === reportId) {
        // Trigger notification to reporter
        this.createNotification(r.user_id, 'Status Update', `Your report "${r.title}" has moved to status: [${status}].`);
        
        // If status becomes In Progress or Resolved, award bonus points to the volunteer or reporter
        if (status === 'Resolved') {
          this.addPointsToUser(r.user_id, 250);
          this.createNotification(r.user_id, 'Achievement Earned!', `Your reported issue "${r.title}" has been RESOLVED! You've received a 250 point community bounty.`);
        }
        return { ...r, status };
      }
      return r;
    });
    this.saveReports();

    if (officerNotes && this.currentUser) {
      this.addComment(reportId, `[Municipal Action Update]: ${officerNotes}`);
    }
  }

  public updateReportDepartment(reportId: string, department: string) {
    this.reports = this.reports.map(r => {
      if (r.id === reportId) {
        return { ...r, department };
      }
      return r;
    });
    this.saveReports();
  }

  // --- COMMENTS ---
  public getComments(reportId: string): Comment[] {
    return this.comments
      .filter(c => c.report_id === reportId)
      .map(c => ({
        ...c,
        user: this.users.find(u => u.id === c.user_id) || DEFAULT_USERS[3]
      }))
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }

  public addComment(reportId: string, text: string): Comment {
    const commenterId = this.currentUser?.id || 'a44c1e5a-73d7-4009-848e-f14bfca932cb';
    const newComment: Comment = {
      id: Math.random().toString(36).substring(2, 11),
      report_id: reportId,
      user_id: commenterId,
      comment: text,
      created_at: new Date().toISOString()
    };

    this.comments.push(newComment);
    this.saveComments();

    // Reward points for engagement
    if (this.currentUser) {
      this.addPointsToUser(this.currentUser.id, 20);
    }

    // Notify the creator of the report
    const r = this.reports.find(rep => rep.id === reportId);
    if (r && r.user_id !== commenterId) {
      this.createNotification(r.user_id, 'New Comment', `Someone commented on your report: "${text.substring(0, 40)}..."`);
    }

    return newComment;
  }

  // --- VOTING & COMMUNITY VERIFICATION ---
  public toggleVote(reportId: string, voteType: 'upvote' | 'duplicate' = 'upvote') {
    if (!this.currentUser) return;
    const userId = this.currentUser.id;

    const existingIndex = this.votes.findIndex(v => v.report_id === reportId && v.user_id === userId && v.vote === voteType);

    if (existingIndex > -1) {
      // Retract vote
      this.votes.splice(existingIndex, 1);
    } else {
      // Add vote
      this.votes.push({ report_id: reportId, user_id: userId, vote: voteType });
      
      // Earn points for verification!
      this.addPointsToUser(userId, 10);

      // Dynamically auto-verify status if a report gets 3+ verifications
      const totalVerifications = this.votes.filter(v => v.report_id === reportId && v.vote === 'upvote').length;
      const report = this.reports.find(r => r.id === reportId);
      if (report && totalVerifications >= 3 && report.status === 'AI Reviewed') {
        report.status = 'Community Verified';
        this.saveReports();
        this.createNotification(report.user_id, 'Report Verified', `Congratulations! Your report "${report.title}" has been verified by the community and is ready for city dispatch.`);
      }
    }
    this.saveVotes();
  }

  // --- NOTIFICATIONS ---
  public getNotifications(): Notification[] {
    if (!this.currentUser) return [];
    return this.notifications
      .filter(n => n.user_id === this.currentUser?.id)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public createNotification(userId: string, title: string, message: string) {
    const newNotif: Notification = {
      id: Math.random().toString(36).substring(2, 11),
      user_id: userId,
      title,
      message,
      read: false,
      created_at: new Date().toISOString()
    };
    this.notifications.push(newNotif);
    this.saveNotifications();
  }

  public markNotificationRead(notifId: string) {
    this.notifications = this.notifications.map(n => n.id === notifId ? { ...n, read: true } : n);
    this.saveNotifications();
  }

  public markAllNotificationsRead() {
    if (!this.currentUser) return;
    this.notifications = this.notifications.map(n => n.user_id === this.currentUser?.id ? { ...n, read: true } : n);
    this.saveNotifications();
  }

  // --- ACHIEVEMENTS & GAMIFICATION ---
  public getAchievements(): Achievement[] {
    if (!this.currentUser) return [];
    return this.achievements.filter(a => a.user_id === this.currentUser?.id);
  }

  public getLeaderboard(): User[] {
    return [...this.users].sort((a, b) => b.points - a.points);
  }

  private addPointsToUser(userId: string, pts: number) {
    this.users = this.users.map(u => {
      if (u.id === userId) {
        const newPoints = u.points + pts;
        const newLevel = Math.floor(newPoints / 500) + 1; // 500 points per level
        
        if (newLevel > u.level) {
          // Level up trigger!
          setTimeout(() => {
            this.createNotification(userId, 'Level Up! 🌟', `Incredible! You have reached Level ${newLevel}! Keep protecting your community.`);
            
            // Allocate a shiny level badge
            const badges = ['Guardian Rookie', 'Street Vigilante', 'Hyperlocal Hero', 'City Mayor Assistant', 'Metropolitan Legend'];
            const badge = badges[Math.min(newLevel - 1, badges.length - 1)];
            this.achievements.push({
              id: Math.random().toString(36).substring(2, 11),
              user_id: userId,
              badge,
              points: pts,
              created_at: new Date().toISOString()
            });
            this.saveAchievements();
          }, 100);
        }
        return { ...u, points: newPoints, level: newLevel };
      }
      return u;
    });
    this.saveUsers();
  }
}

// Global Singleton Instance
export const supabase = new SupabaseStateEngine();
