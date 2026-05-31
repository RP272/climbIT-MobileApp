import type { WeeklyActivity, WeeklyActivityRaw } from "./profile.types";

export function formatWeeklyActivity(rawActivity: WeeklyActivityRaw[]): WeeklyActivity[] {
  const todayStr = new Date().toISOString().split("T")[0];
  const dayNames = ["Nd", "Pn", "Wt", "Śr", "Cz", "Pt", "Sb"];

  return rawActivity.map((item) => {
    const d = new Date(item.date);
    return {
      id: item.date,
      label: dayNames[d.getDay()],
      value: item.count,
      isToday: item.date === todayStr,
    };
  });
}
