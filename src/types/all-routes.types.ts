import type { RecommendedRoute } from "@/src/types/discover";
import type { LucideIcon } from "lucide-react-native";

export type SortId = "latest" | "grade-asc" | "grade-desc" | "popular" | "rating";

export type UserRouteStatus = "untouched" | "project" | "top" | "flash";

export type WallProfile = "Połóg" | "Pion" | "Przewieszenie";

export type HoldColorKey = "yellow" | "blue" | "black" | "red" | "green" | "white";

export type HoldColor = {
  label: string;
  dotClassName: string;
  surfaceClassName: string;
  textClassName: string;
};

export type RouteViewModel = {
  route: RecommendedRoute;
  color: HoldColor;
  routeSetter: string;
  personalStatus: UserRouteStatus;
  wallProfile: WallProfile;
  rating: number;
  communityGrade: string;
  popularity: number;
  setDaysAgo: number;
  isExpiringSoon: boolean;
  removalDays: number;
};

export type PersonalStatusConfig = {
  label: string;
  icon: LucideIcon;
  className: string;
  textClassName: string;
};
