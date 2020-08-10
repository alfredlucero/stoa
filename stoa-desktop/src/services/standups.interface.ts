export interface Standup {
  id: string;
  userId: string;
  todayTimestamp: firebase.firestore.Timestamp; // UTC
  todayTodos: string[];
  yesterdayUpdates: string[];
  yesterdayTimestamp: firebase.firestore.Timestamp; // UTC
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
