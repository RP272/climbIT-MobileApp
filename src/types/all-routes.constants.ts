import type { QuickFilterItem } from "@/components/discover/quick-filters-section";
import type {
  HoldColor,
  HoldColorKey,
  PersonalStatusConfig,
  SortId,
  UserRouteStatus,
} from "@/src/types/all-routes.types";
import {
  Bookmark,
  CheckCircle2,
  Clock3,
  Dumbbell,
  Flame,
  Gauge,
  Mountain,
  Trophy,
  Zap,
} from "lucide-react-native";

export const QUICK_FILTERS = [
  { id: "project", label: "Zapisane", icon: Bookmark },
  { id: "completed", label: "Ukończone", icon: CheckCircle2 },
  { id: "balance", label: "Balans", icon: Gauge },
  { id: "power", label: "Siłowe", icon: Dumbbell },
  { id: "dynamic", label: "Dyno", icon: Zap },
  { id: "overhang", label: "Przewieszenie", icon: Mountain },
] satisfies readonly QuickFilterItem[];

export const SORT_OPTIONS = [
  { id: "latest", label: "Najnowsze" },
  { id: "grade-asc", label: "Wycena rosnąco" },
  { id: "grade-desc", label: "Wycena malejąco" },
  { id: "popular", label: "Popularne" },
  { id: "rating", label: "Najwyżej oceniane" },
] satisfies readonly { id: SortId; label: string }[];

export const HOLD_COLORS: Record<HoldColorKey, HoldColor> = {
  yellow: {
    label: "Żółte",
    dotClassName: "bg-yellow-400",
    surfaceClassName: "bg-yellow-100 border-yellow-300",
    textClassName: "text-yellow-800",
  },
  blue: {
    label: "Niebieskie",
    dotClassName: "bg-sky-500",
    surfaceClassName: "bg-sky-100 border-sky-300",
    textClassName: "text-sky-800",
  },
  black: {
    label: "Czarne",
    dotClassName: "bg-zinc-900",
    surfaceClassName: "bg-zinc-200 border-zinc-400",
    textClassName: "text-zinc-900",
  },
  red: {
    label: "Czerwone",
    dotClassName: "bg-red-500",
    surfaceClassName: "bg-red-100 border-red-300",
    textClassName: "text-red-800",
  },
  green: {
    label: "Zielone",
    dotClassName: "bg-emerald-500",
    surfaceClassName: "bg-emerald-100 border-emerald-300",
    textClassName: "text-emerald-800",
  },
  white: {
    label: "Białe",
    dotClassName: "bg-white border border-border",
    surfaceClassName: "bg-background border-border",
    textClassName: "text-foreground",
  },
};

export const HOLD_COLOR_ORDER = Object.keys(HOLD_COLORS) as HoldColorKey[];

export const ROUTE_SETTER_OVERRIDES: Record<string, string> = {
  "edge-balance": "Marta Nowak",
  "dynamic-sprint": "Kuba Zieliński",
  "quiet-pump": "Ola Wójcik",
  "slab-focus": "Kuba Zieliński",
  "route-5": "Marta Nowak",
  "route-6": "Ola Wójcik",
  "route-7": "Janek Lis",
};

export const ROUTE_SETTERS = [
  "Marta Nowak",
  "Ola Wójcik",
  "Kuba Zieliński",
  "Janek Lis",
  "Tomek Sowa",
] as const;

export const DEFAULT_PERSONAL_STATUSES: Record<string, UserRouteStatus> = {
  "edge-balance": "project",
  "dynamic-sprint": "project",
  "quiet-pump": "untouched",
  "slab-focus": "flash",
  "route-5": "untouched",
  "route-6": "project",
  "route-7": "top",
};

export const PERSONAL_STATUS_CONFIG: Record<UserRouteStatus, PersonalStatusConfig> = {
  untouched: {
    label: "Niepróbowana",
    icon: Clock3,
    className: "border-border bg-background",
    textClassName: "text-muted-foreground",
  },
  project: {
    label: "Zapisana",
    icon: Bookmark,
    className: "border-amber-300/70 bg-amber-400/15",
    textClassName: "text-amber-700",
  },
  top: {
    label: "Top",
    icon: Trophy,
    className: "border-emerald-300/70 bg-emerald-500/15",
    textClassName: "text-emerald-700",
  },
  flash: {
    label: "Flash",
    icon: Flame,
    className: "border-rose-300/70 bg-rose-500/15",
    textClassName: "text-rose-700",
  },
};
