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
  teamA: string[];
  teamB: string[];
  teamsAssigned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  size: number;
  total: number;
  totalPages: number;
}

// Meta shape returned by the player/organizer-facing endpoints
// (/players/search, /matches/search, /teams/search) — flatter than
// the admin PaginationMeta above.
export interface SearchMeta {
  page: number;
  limit: number;
  total: number;
}

export interface PlayerStats {
  matchesPlayed: number;
  wins: number;
  losses: number;
  goals: number;
  assists: number;
}

export interface PlayerProfile {
  _id: string;
  userId: string;
  position: "goalkeeper" | "defender" | "midfielder" | "forward" | "any";
  skillLevel: "beginner" | "intermediate" | "advanced" | "professional";
  preferredFoot: "left" | "right" | "both";
  age: number;
  city: string;
  bio?: string;
  availability: string[];
  stats: PlayerStats;
  lookingFor: "teammate" | "opponent" | "both";
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  role: "player" | "organizer" | "admin";
  isVerified: boolean;
  isActive: boolean;
  profilePhoto?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type PostType = "team_recruit" | "player_seeking_team" | "opponent_request";
export type PostStatus = "open" | "filled" | "closed";

export interface Post {
  _id: string;
  postType: PostType;
  authorId: string;
  authorRole: "player" | "organizer";
  title: string;
  description?: string;
  city: string;
  skillLevel: "beginner" | "intermediate" | "advanced" | "any";
  teamId?: string;
  position: "goalkeeper" | "defender" | "midfielder" | "forward" | "any";
  slotsNeeded: number;
  venue?: string;
  matchDate?: string;
  matchTime?: string;
  maxPlayers?: number;
  status: PostStatus;
  createdAt: string;
  updatedAt: string;
}

export type ApplicationStatus = "pending" | "accepted" | "rejected" | "withdrawn";

export interface Application {
  _id: string;
  postId: string;
  applicantId: string;
  applicantRole: "player" | "organizer";
  teamId?: string;
  message?: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalMatches: number;
  totalTeams: number;
  totalPlayers: number;
  totalFutsals: number;
  totalBookings: number;
  totalChallenges: number;
  usersByRole: { players: number; organizers: number; admins: number };
  openMatches: number;
  openTeams: number;
  unverifiedFutsals: number;
  pendingBookings: number;
}

export type BookingStatus = "pending" | "approved" | "rejected" | "cancelled" | "completed";

export interface Booking {
  _id: string;
  futsalId: string;
  playerId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  challengeId?: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface AvailabilitySlot {
  start: string;
  end: string;
  status: "available" | "booked";
}

export interface Earnings {
  total: number;
  today: number;
  week: number;
  month: number;
  totalBookings: number;
}

export interface Notification {
  _id: string;
  userId: string;
  type: string;
  message: string;
  relatedId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Review {
  _id: string;
  futsalId: string;
  playerId: string;
  bookingId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export type ReportStatus = "pending" | "resolved" | "dismissed";

export interface Report {
  _id: string;
  reporterId: string;
  reportedUserId: string;
  reason: string;
  status: ReportStatus;
  createdAt: string;
}

export interface Analytics {
  mostBookedFutsals: { futsalId: string; name: string; count: number }[];
  mostActivePlayers: { playerId: string; count: number }[];
  revenueByMonth: { month: string; revenue: number }[];
  userGrowthByMonth: { month: string; count: number }[];
  totalRevenue: number;
}

export type ChallengeStatus = "pending" | "accepted" | "rejected" | "countered" | "withdrawn";

export interface Challenge {
  _id: string;
  challengerTeamId: string;
  challengerPlayerId: string;
  opponentTeamId: string;
  proposedDate: string;
  proposedTime: string;
  preferredFutsalId?: string;
  message?: string;
  status: ChallengeStatus;
  counterDate?: string;
  counterTime?: string;
  counterFutsalId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Futsal {
  _id: string;
  organizerId: string;
  name: string;
  description?: string;
  district: string;
  municipality?: string;
  nearbyLandmark?: string;
  latitude: number;
  longitude: number;
  contactNumber: string;
  pricePerHour: number;
  openingTime: string;
  closingTime: string;
  facilities: string[];
  images: string[];
  isVerified: boolean;
  isActive: boolean;
  holidays: string[];
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export const FUTSAL_FACILITIES = [
  "Parking",
  "Cafeteria",
  "Changing Room",
  "Washroom",
  "Flood Lights",
] as const;
