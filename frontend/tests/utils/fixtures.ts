import type {
  Futsal,
  PlayerProfile,
  Post,
  PaginationMeta,
} from "@/lib/types";

/**
 * Factory helpers used across the test suite.
 * Each factory returns a fully-valid object matching the app's TypeScript
 * types, with sensible defaults that can be overridden per-test.
 */

export function makeFutsal(overrides: Partial<Futsal> = {}): Futsal {
  return {
    _id: "futsal-1",
    organizerId: "org-1",
    name: "Greenfield Futsal Arena",
    description: "A great place to play",
    district: "Kathmandu",
    municipality: "Baneshwor",
    nearbyLandmark: "Near City Mall",
    latitude: 27.7,
    longitude: 85.3,
    contactNumber: "9800000000",
    pricePerHour: 1200,
    openingTime: "06:00",
    closingTime: "22:00",
    facilities: ["Parking", "Cafeteria", "Changing Room", "Washroom"],
    images: [],
    isVerified: true,
    isActive: true,
    holidays: [],
    rating: 4.5,
    reviewCount: 10,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    ...overrides,
  };
}

export function makePlayerProfile(
  overrides: Partial<PlayerProfile> = {}
): PlayerProfile {
  return {
    _id: "player-1",
    userId: "user-1",
    position: "forward",
    skillLevel: "intermediate",
    preferredFoot: "right",
    age: 24,
    city: "Lalitpur",
    bio: "Loves playing on weekends",
    availability: ["Saturday", "Sunday"],
    stats: {
      matchesPlayed: 12,
      wins: 7,
      losses: 5,
      goals: 9,
      assists: 3,
    },
    lookingFor: "both",
    isAvailable: true,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    ...overrides,
  };
}

export function makePost(overrides: Partial<Post> = {}): Post {
  return {
    _id: "post-1",
    postType: "team_recruit",
    authorId: "author-1",
    authorRole: "player",
    title: "Looking for a striker",
    description: "Need one more player for Saturday match",
    city: "Kathmandu",
    skillLevel: "intermediate",
    position: "forward",
    slotsNeeded: 1,
    status: "open",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    ...overrides,
  };
}

export function makePagination(
  overrides: Partial<PaginationMeta> = {}
): PaginationMeta {
  return {
    page: 1,
    size: 10,
    total: 0,
    totalPages: 0,
    ...overrides,
  };
}
