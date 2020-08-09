export interface Standup {
  id: string;
  userId: string;
  todayTimestamp: number; // UTC
  todayTodos: string[];
  yesterdayUpdates: string[];
  yesterdayTimestamp: number; // UTC
  blockers: string[];
  notes: string[];
}
