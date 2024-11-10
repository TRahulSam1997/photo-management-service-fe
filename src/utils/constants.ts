// API endpoints
export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3001";
export const API_ENDPOINTS = {
  SNAPSHOTS: "/api/snapshots",
  UPLOADS: "/uploads",
} as const;

// Image settings
export const IMAGE_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB in bytes
  ACCEPTED_TYPES: ["image/jpeg", "image/png"],
  PREVIEW_SIZE: {
    width: 320,
    height: 240,
  },
} as const;

// Status related constants
export const STATUS_COLORS = {
  pending: "text-yellow-600",
  approved: "text-green-600",
  rejected: "text-red-600",
} as const;

// Query keys for React Query
export const QUERY_KEYS = {
  snapshots: ["snapshots"],
  snapshotDetails: (id: string) => ["snapshots", id],
} as const;
