// API endpoints
export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3001";
export const API_ENDPOINTS = {
  SNAPSHOTS: "/api/snapshots",
} as const;

// Status related constants
export const STATUS_COLORS = {
  pending: "text-yellow-600",
  approved: "text-green-600",
  rejected: "text-red-600",
} as const;
