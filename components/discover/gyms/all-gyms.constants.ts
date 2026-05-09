import type { QuickFilterItem } from "@/components/discover/quick-filters-section";
import type { GymSortId } from "@/components/discover/gyms/all-gyms.types";
import { AlarmClock, Dumbbell, Flag, Route, Sparkles } from "lucide-react-native";

export const GYM_QUICK_FILTERS = [
  { id: "open-now", label: "Otwarte", icon: AlarmClock },
  { id: "fresh", label: "Nowe sety", icon: Sparkles },
  { id: "bouldering", label: "Boulder", icon: Dumbbell },
  { id: "rope", label: "Lina", icon: Route },
  { id: "challenges", label: "Wyzwania", icon: Flag },
] satisfies readonly QuickFilterItem[];

export const GYM_SORT_OPTIONS = [
  { id: "distance", label: "Najbliżej" },
  { id: "rating", label: "Ocena" },
  { id: "fresh", label: "Nowe sety" },
  { id: "name", label: "A-Z" },
] satisfies readonly { id: GymSortId; label: string }[];
