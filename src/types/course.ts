export interface WeeklyOverviewItem {
  week: number;
  focus: string[];
}

export interface Task {
  name: string;
  description: string;
}

export interface GrammarItem {
  title: string;
  explanation?: string;
  table?: Record<string, string>[];
}

export interface VocabularyItem {
  word: string;
  pronunciation: string;
  meaning: string;
  audio_file?: string;
}

export interface ExampleItem {
  german: string;
  japanese: string;
  audio_file?: string;
}

export interface DayContent {
  day?: number;
  title: string;
  tasks?: Task[];
  grammar?: GrammarItem[];
  vocabulary?: VocabularyItem[];
  examples?: ExampleItem[];
}

export interface WeekData {
  key?: string; 
  week_number: number;
  title: string;
  description: string;
  daily_goals?: DayContent[];
  weekly_review?: {
    summary: string;
    key_points: string[];
  };
}

export interface CourseOverview {
  title: string;
  description: string;
  goals?: string[];
  prerequisites?: string;
  duration?: string;
  level?: string;
  materials?: string;
  certification?: string;
  author?: string;
  weekly_overview?: WeeklyOverviewItem[];
} 