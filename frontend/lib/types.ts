export interface AdminUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  role: "player" | "organizer" | "admin";
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminTeam {
  _id: string;
  name: string;
  organizerId: string;
  city: string;
  description?: string;
  skillLevel: "beginner" | "intermediate" | "advanced" | "mixed";
  maxMembers: number;
  isOpen: boolean;
  logoUrl?: string;
  members: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminMatch {
  _id: string;
  title: string;
  organizerId: string;
  venue: string;
  city: string;
  matchDate: string;
  matchTime: string;
  maxPlayers: number;
  skillLevel: "beginner" | "intermediate" | "advanced" | "any";
  matchType: "friendly" | "competitive" | "tournament";
  description?: string;
  status: "open" | "full" | "ongoing" | "completed" | "cancelled";
  entryFee: number;
  players: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  size: number;
  total: number;
  totalPages: number;
}

export interface DashboardStats {
  totalUsers: number;
  totalMatches: number;
  totalTeams: number;
  totalPlayers: number;
  usersByRole: { players: number; organizers: number; admins: number };
  openMatches: number;
  openTeams: number;
}
