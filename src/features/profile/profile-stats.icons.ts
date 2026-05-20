import {
  Bookmark,
  Building2,
  Flame,
  Gauge,
  Palette,
  Route,
  Sparkles,
  SunMedium,
  Target,
  Trophy,
  type LucideIcon,
} from "lucide-react-native";

import type { ProfileStatIconName } from "@/src/features/profile/profile-stats.types";

export const PROFILE_STAT_ICON_MAP = {
  bookmark: Bookmark,
  building: Building2,
  flame: Flame,
  gauge: Gauge,
  palette: Palette,
  route: Route,
  sparkles: Sparkles,
  sun: SunMedium,
  target: Target,
  trophy: Trophy,
} satisfies Record<ProfileStatIconName, LucideIcon>;
