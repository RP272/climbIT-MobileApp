export type WeeklyActivityRaw = {
  date: string;
  count: number;
};

export type WeeklyActivity = {
  id: string;
  label: string;
  value: number;
  isToday: boolean;
};
