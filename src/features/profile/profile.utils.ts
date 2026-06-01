import type { WeeklyActivity, WeeklyActivityRaw } from "./profile.types";

export function formatWeeklyActivity(rawActivity: WeeklyActivityRaw[]): WeeklyActivity[] {
  const today = new Date();
  const todayStr = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");
  const dayNames = ["Nd", "Pn", "Wt", "Śr", "Cz", "Pt", "Sb"];

  return rawActivity.map((item) => {
    const d = new Date(`${item.date}T00:00:00`);

    return {
      id: item.date,
      label: dayNames[d.getDay()],
      value: item.count,
      isToday: item.date === todayStr,
    };
  });
}
