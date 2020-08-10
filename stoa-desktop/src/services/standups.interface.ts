export interface Standup {
  id: string;
  userId: string;
  todayTimestamp: Date; // UTC
  todayTodos: string[];
  yesterdayUpdates: string[];
  yesterdayTimestamp: Date; // UTC
  blockers: string[];
  notes: string[];
}

export interface CreateStandup {
  userId: string;
  todayTimestamp: Date;
  todayTodos: string[];
  yesterdayUpdates: string[];
  yesterdayTimestamp: Date;
  blockers: string[];
  notes: string[];
}
