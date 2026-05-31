import type { RecommendedRoute } from "@/src/types/discover";
import type { LucideIcon } from "lucide-react-native";
import type { TextStyle, ViewStyle } from "react-native";

export type SortId = "latest" | "grade-asc" | "grade-desc" | "popular" | "rating";

export type UserRouteStatus = "untouched" | "project" | "top" | "flash";

export type WallProfile = "Slab" | "Vertical" | "Overhang";

export type HoldColorKey = "yellow" | "blue" | "black" | "red" | "green" | "white";

export type HoldColor = {
  label: string;
  dotClassName: string;
  surfaceClassName: string;
  textClassName: string;
  dotStyle?: ViewStyle;
  surfaceStyle?: ViewStyle;
  textStyle?: TextStyle;
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
