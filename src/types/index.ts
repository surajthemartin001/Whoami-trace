export type TrackState = 'GREEN' | 'YELLOW' | 'RED';

export type IntensityMode = 'turtle' | 'rabbit' | 'cheetah' | 'tiger';

export interface IntensityConfig {
  mode: IntensityMode;
  name: string;
  badge: string;
  dailyHours: number;
  weeklyHours: number;
  description: string;
  lockDurationDays: 7 | 30;
  lockedUntil: string;
  isLocked: boolean;
}

export interface UserPermissions {
  microphone: boolean;
  camera: boolean;
  notifications: boolean;
  files: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  displayName: string;
  email: string;
  phone?: string;
  interests: string[];
  learningInterests: string[];
  dailyAvailableHours: number;
  daysAvailablePerWeek: number;
  preferredLanguage: 'Hindi' | 'English' | 'Hinglish';
  isOnboarded: boolean;
  permissions: UserPermissions;
  currentIntensity: IntensityConfig;
  createdAt: string;
}

export interface GoalMilestone {
  id: string;
  title: string;
  deadline: string;
  completed: boolean;
  order: number;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  domain: string;
  targetDate: string;
  progressPercentage: number;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Active' | 'Completed' | 'Paused';
  milestones: GoalMilestone[];
  requiredSkills: string[];
  requiredResources: string[];
  createdAt: string;
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'book' | 'notes' | 'image' | 'syllabus' | 'url' | 'pyq' | 'external';
  size?: string;
  dateAdded: string;
  extractedTopics: string[];
  conceptsCount: number;
  questionsCount: number;
  url?: string;
  contentPreview?: string;
  sourceConnector?: string;
}

export interface CurriculumNode {
  id: string;
  title: string;
  level: 'field' | 'subject' | 'chapter' | 'topic' | 'subtopic';
  parentId: string | null;
  prerequisites: string[];
  estimatedHours: number;
  completedHours: number;
  keyConcepts: string[];
  practiceRequirement: number;
  practiceCompleted: number;
  isMastered: boolean;
}

export interface PlanTask {
  id: string;
  title: string;
  type: 'learn' | 'practice' | 'revision' | 'project' | 'break';
  timeSlot: string;
  durationMinutes: number;
  completed: boolean;
  date: string;
  goalId?: string;
  priority: 'High' | 'Medium' | 'Low';
  isMissed?: boolean;
}

export interface RecoveryPlan {
  needed: boolean;
  missedWorkCount: number;
  strategy: string;
  dailyExtraMinutes: number;
  advice: string;
  rebalancedUntil: string;
}

export type QuestionType =
  | 'single_mcq'
  | 'multiple_mcq'
  | 'true_false'
  | 'assertion_reason'
  | 'short_answer'
  | 'coding'
  | 'numerical'
  | 'scenario';

export interface Question {
  id: string;
  question: string;
  type: QuestionType;
  options: string[];
  correctOptionIndex: number;
  correctIndices?: number[];
  explanation: string;
  wrongOptionsExplanation?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  domain: string;
  subject: string;
  topic: string;
  relatedConcept?: string;
  source?: string;
  examYear?: string;
  isPYQ?: boolean;
  tags?: string[];
  isMastered?: boolean;
}

export interface QuestionPack {
  id: string;
  title: string;
  description: string;
  questionCount: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Mixed';
  questions: Question[];
  domain: string;
  subject: string;
  topic: string;
  type:
    | 'quick'
    | '20_pack'
    | '50_pack'
    | '100_pack'
    | 'weak_topic'
    | 'pyq'
    | 'chapter'
    | 'revision'
    | 'custom';
  createdAt: string;
}

export interface QuestionAttempt {
  id: string;
  questionId: string;
  userOptionIndex: number | number[];
  isCorrect: boolean;
  timeTakenSeconds: number;
  timestamp: string;
  topic: string;
  domain: string;
}

export interface SavedQuestion {
  id: string;
  question: Question;
  notes?: string;
  savedAt: string;
  revisionDue: string;
  repetitionStage: number;
}

export interface RevisionItem {
  id: string;
  questionId?: string;
  conceptTitle: string;
  topic: string;
  domain: string;
  dueAt: string;
  stage: number;
  lastReviewed?: string;
  masteryScore: number;
  notes?: string;
}

export interface NEXORAProject {
  id: string;
  title: string;
  category: 'Robotics' | 'AI Systems' | 'Cybersecurity' | 'Hardware/Embedded' | 'Venture & Leadership';
  stage: 'Architecture' | 'Prototyping' | 'Testing' | 'Deployment' | 'Scaling';
  progress: number;
  targetCompletion: string;
  description: string;
  specs: string[];
  milestones: { id: string; title: string; done: boolean }[];
}

export interface LyraMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  action?: any;
  modelUsed?: string;
  audioUrl?: string;
}

export type LyraMood = 'HAPPY' | 'PLAYFUL' | 'CALM' | 'FOCUSED' | 'MOTIVATOR' | 'SERIOUS' | 'CUSTOM';

export type LyraPersonalityPreset = 'FRIENDLY' | 'PLAYFUL' | 'COACH' | 'PROFESSIONAL' | 'GENIUS' | 'CUSTOM';

export interface LyraPersonalitySliders {
  warmth: number; // 0-100
  humor: number; // 0-100
  energy: number; // 0-100
  directness: number; // 0-100
  verbosity: number; // 0-100
  formality: number; // 0-100
  encouragement: number; // 0-100
}

export type LyraVoiceProvider = 'cloud_tts' | 'native_browser' | 'custom_api';

export interface CustomVoiceApiConfig {
  providerName: string;
  apiKeyMasked: string;
  voiceId: string;
  modelId: string;
  endpoint?: string;
  isConnected: boolean;
}

export interface LyraVoiceConfig {
  provider: LyraVoiceProvider;
  voiceName: string;
  gender: 'female' | 'male' | 'neutral';
  speed: number; // 0.75 - 1.5
  pitch: number; // 0.75 - 1.25
  expressiveness: number; // 0 - 100
  volume: number; // 0 - 100
  pauseBeforeResponseMs: number;
  autoSpeak: boolean;
  interruptible: boolean;
  continuousMode: boolean;
  customApiConfig?: CustomVoiceApiConfig;
}

export interface LyraMemoryItem {
  id: string;
  key: string;
  value: string;
  category: 'communication' | 'goal_context' | 'learning_preference' | 'explanation_depth';
  createdAt: string;
}

export interface LyraConfig {
  currentMood: LyraMood;
  adaptiveMood: boolean;
  personalityPreset: LyraPersonalityPreset;
  sliders: LyraPersonalitySliders;
  voice: LyraVoiceConfig;
  language: 'Hindi' | 'English' | 'Hinglish';
  memoryEnabled: boolean;
  memories: LyraMemoryItem[];
}

export interface AnalyticsData {
  trackState: TrackState;
  trackScore: number; // 0-100
  streakDays: number;
  totalStudyHours: number;
  totalPracticeQuestions: number;
  overallAccuracy: number;
  weakTopics: string[];
  strongTopics: string[];
  weeklyActivity: { day: string; hours: number; accuracy: number }[];
}
