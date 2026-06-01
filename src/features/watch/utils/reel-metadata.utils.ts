import type { ClimbAttemptListApiEntry } from "@/src/types/api";

const DEFAULT_REEL_TITLES = [
  "Sesja na ściance",
  "Problem boulderowy",
  "Przejście na klamkach",
  "Crux na sloperze",
  "Nowa linia na V?",
];

export const REEL_TITLE_PLACEHOLDER = "Np. Flash na żółtym sloperze";

export function getDefaultReelTitle(index: number) {
  return DEFAULT_REEL_TITLES[index % DEFAULT_REEL_TITLES.length] ?? "Przejście boulderowe";
}

export function formatReelUploadDate(uploadedAt: string | null | undefined) {
  if (!uploadedAt) {
    return null;
  }

  const date = new Date(uploadedAt);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return "Dzisiaj";
  }

  if (diffDays === 1) {
    return "Wczoraj";
  }

  if (diffDays < 7) {
    return `${diffDays} dni temu`;
  }

  return date.toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "short",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

export function formatAttemptDuration(durationSeconds: number | null | undefined) {
  if (durationSeconds == null || durationSeconds <= 0) {
    return null;
  }

  const totalSeconds = Math.round(durationSeconds);

  if (totalSeconds < 60) {
    return `${totalSeconds} s`;
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes < 60) {
    return seconds > 0 ? `${minutes} min ${seconds} s` : `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours} h ${remainingMinutes} min` : `${hours} h`;
}

export function formatAttemptType(type: string | null | undefined) {
  if (!type?.trim()) {
    return null;
  }

  const normalized = type.trim().toLowerCase();

  if (normalized === "flash") {
    return "Flash";
  }

  if (normalized === "top") {
    return "Top";
  }

  if (normalized === "zone") {
    return "Zone";
  }

  return type.trim();
}

export function isClimbAttemptAdminVerified(attempt: ClimbAttemptListApiEntry | undefined) {
  if (!attempt) {
    return false;
  }

  const adminDecision = attempt.adminDecision ?? attempt.admin_decision;
  const reviewedByAdminId = attempt.reviewedByAdminId ?? attempt.reviewed_by_admin_id;

  return adminDecision === true && Boolean(reviewedByAdminId);
}

export function getAttemptDateLabel(attempt: ClimbAttemptListApiEntry | undefined) {
  const rawDate = attempt?.attemptDate ?? attempt?.attempt_date;
  if (!rawDate) {
    return null;
  }

  const date = new Date(rawDate);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "short",
  });
}
