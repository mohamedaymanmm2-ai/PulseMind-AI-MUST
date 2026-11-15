export type AppView =
  | 'landing'
  | 'dashboard'
  | 'exam'
  | 'chat'
  | 'gpa'
  | 'planner'
  | 'flashcards'
  | 'mcq'
  | 'truefalse'
  | 'progress'
  | 'profile'
  | 'settings';

export type ThemeMode = 'light' | 'dark' | 'system';

export type AppLanguage = 'en' | 'ar';

export type ClinicalResponseFormat = 'adpie' | 'nanda' | 'dosage' | 'exam';

export type ResponseDensity = 'comfortable' | 'compact';

export type FontSizeScale = 'standard' | 'large';

export interface UserProfile {
  fullName: string;
  studentId: string;
  email: string;
  academicYear: string;
  clinicalRotation: string;
  campus: string;
  bio: string;
  focusAreas: string[];
}

export interface AppSettings {
  theme: ThemeMode;
  language: AppLanguage;
  responseFormat: ClinicalResponseFormat;
  density: ResponseDensity;
  fontSize: FontSizeScale;
  clinicalSafetyNotes: boolean;
  enterToSend: boolean;
}

export type AiConnectionStatus = 'online' | 'busy' | 'offline';

export type ChatErrorCode = 'AI_BUSY' | 'OFFLINE' | 'ABORTED' | 'GENERIC';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  isError?: boolean;
  errorCode?: ChatErrorCode;
}

export interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
  messages: ChatMessage[];
}

// GPA Calculator
export type GradeLetter =
  | 'A'
  | 'A-'
  | 'B+'
  | 'B'
  | 'B-'
  | 'C+'
  | 'C'
  | 'C-'
  | 'D+'
  | 'D'
  | 'F';

export interface GpaCourse {
  id: string;
  code: string;
  name: string;
  credits: number;
  grade: GradeLetter;
}

export interface GpaState {
  semesterLabel: string;
  priorCredits: number;
  priorCgpa: number;
  targetCgpa: number;
  courses: GpaCourse[];
}

// Study Planner
export type StudyTaskCategory =
  | 'Lecture Review'
  | 'Clinical Prep'
  | 'Exam Practice'
  | 'Lab / OSCE'
  | 'Assignment';

export type StudyTaskPriority = 'High' | 'Medium' | 'Low';

export interface StudyTask {
  id: string;
  title: string;
  subject: string;
  category: StudyTaskCategory;
  priority: StudyTaskPriority;
  dueDate: string; // YYYY-MM-DD
  durationMinutes: number;
  completed: boolean;
  completedAt?: string;
  notes?: string;
}

// Flashcards
export interface FlashcardItem {
  id: string;
  front: string;
  back: string;
  clinicalPearl: string;
  mastered: boolean;
}

export interface FlashcardDeck {
  id: string;
  title: string;
  subject: string;
  createdAt: string;
  cards: FlashcardItem[];
}

// MCQ Generator
export interface McqQuestion {
  id: string;
  stem: string;
  options: string[];
  correctIndex: number;
  rationale: string;
  distractorNote: string;
}

// True/False Generator
export interface TrueFalseStatement {
  id: string;
  statement: string;
  isTrue: boolean;
  explanation: string;
  keyTakeaway: string;
}

// Quiz & Study Activity Logs (feeds Progress Tracking & Dashboard)
export interface AssessmentAttempt {
  id: string;
  mode: 'mcq' | 'truefalse';
  title: string;
  subject: string;
  score: number;
  total: number;
  createdAt: string;
  durationSeconds?: number;
}

export interface StudySessionLog {
  id: string;
  date: string; // YYYY-MM-DD
  subject: string;
  minutes: number;
  source: 'planner' | 'flashcards' | 'mcq' | 'truefalse' | 'timer' | 'exam';
  createdAt: string;
}

// Exam Mode
export type ExamType = 'Midterm' | 'Final' | 'OSCE' | 'Clinical Quiz';

export interface UpcomingExam {
  id: string;
  title: string;
  courseCode: string;
  subject: string;
  examType: ExamType;
  examDateIso: string; // ISO datetime string e.g. YYYY-MM-DDTHH:mm
  targetScore: number;
  topics: string;
}

export interface ExamLabThreshold {
  parameter: string;
  normalRange: string;
  criticalAction: string;
}

export interface SmartRevisionNote {
  id: string;
  heading: string;
  bulletPoints: string[];
  mnemonicOrAnchor: string;
  reviewed?: boolean;
}

export interface ExamKeyword {
  id: string;
  term: string;
  category: 'Pharmacology' | 'Lab Thresholds' | 'Priority Signs' | 'Procedures';
  highYieldDefinition: string;
  examTip: string;
  mastered?: boolean;
}

export interface RapidRevisionCard {
  id: string;
  front: string;
  back: string;
  clinicalPearl: string;
  confident?: boolean;
}

export interface ExamTomorrowPack {
  id: string;
  topic: string;
  title: string;
  subject: string;
  generatedAt: string;
  isExamTomorrowSprint: boolean;
  quickSummary: {
    overview: string;
    priorityActions: string[];
    criticalAlerts: string[];
    labThresholds: ExamLabThreshold[];
  };
  smartNotes: SmartRevisionNote[];
  keywords: ExamKeyword[];
  mcqs: McqQuestion[];
  trueFalse: TrueFalseStatement[];
  revisionCards: RapidRevisionCard[];
}

export interface PersonalizedRecommendation {
  id: string;
  priority: 'Urgent' | 'High' | 'Maintain';
  subject: string;
  title: string;
  reason: string;
  actionType: 'exam_tomorrow' | 'mcq' | 'truefalse' | 'flashcards' | 'summary';
  suggestedTopic: string;
  estimatedMinutes: number;
}

export interface PersonalizedStudyPlan {
  generatedAt: string;
  focusSummary: string;
  recommendations: PersonalizedRecommendation[];
}

export const MUST_GRADE_POINTS: Record<GradeLetter, { points: number; minPercent: string }> = {
  A: { points: 4.0, minPercent: '90–100%' },
  'A-': { points: 3.7, minPercent: '85–89%' },
  'B+': { points: 3.3, minPercent: '80–84%' },
  B: { points: 3.0, minPercent: '75–79%' },
  'B-': { points: 2.7, minPercent: '70–74%' },
  'C+': { points: 2.3, minPercent: '65–69%' },
  C: { points: 2.0, minPercent: '60–64%' },
  'C-': { points: 1.7, minPercent: '56–59%' },
  'D+': { points: 1.3, minPercent: '53–55%' },
  D: { points: 1.0, minPercent: '50–52%' },
  F: { points: 0.0, minPercent: '< 50%' },
};

export const DEFAULT_GPA_STATE: GpaState = {
  semesterLabel: 'Fall Semester · Year 3 BSN',
  priorCredits: 64,
  priorCgpa: 3.42,
  targetCgpa: 3.55,
  courses: [
    {
      id: 'c-1',
      code: 'NUR 301',
      name: 'Adult Health Nursing I (Med-Surg)',
      credits: 4,
      grade: 'A-',
    },
    {
      id: 'c-2',
      code: 'NUR 304',
      name: 'Clinical Pharmacology',
      credits: 3,
      grade: 'A',
    },
    {
      id: 'c-3',
      code: 'NUR 308',
      name: 'Pathophysiology & Clinical Labs',
      credits: 3,
      grade: 'B+',
    },
    {
      id: 'c-4',
      code: 'NUR 312',
      name: 'Maternal & Newborn Nursing',
      credits: 3,
      grade: 'A-',
    },
    {
      id: 'c-5',
      code: 'NUR 315',
      name: 'Nursing Research & EBP',
      credits: 2,
      grade: 'A',
    },
  ],
};

function offsetDateIso(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().slice(0, 10);
}

export const DEFAULT_STUDY_TASKS: StudyTask[] = [
  {
    id: 't-1',
    title: 'Review Loop Diuretics & Potassium Monitoring',
    subject: 'Pharmacology',
    category: 'Lecture Review',
    priority: 'High',
    dueDate: offsetDateIso(0),
    durationMinutes: 45,
    completed: false,
    notes: 'Focus on Furosemide IV push rates and ECG T-wave changes.',
  },
  {
    id: 't-2',
    title: 'Med-Surg Ward Care Plan: Acute Heart Failure',
    subject: 'Medical-Surgical',
    category: 'Clinical Prep',
    priority: 'High',
    dueDate: offsetDateIso(1),
    durationMinutes: 60,
    completed: false,
    notes: 'Prepare NANDA-I Excess Fluid Volume and NOC intake/output targets.',
  },
  {
    id: 't-3',
    title: 'OSCE Station Drill: Sterile Wound Dressing',
    subject: 'OSCE & Skills',
    category: 'Lab / OSCE',
    priority: 'Medium',
    dueDate: offsetDateIso(2),
    durationMinutes: 35,
    completed: true,
    completedAt: new Date().toISOString(),
  },
  {
    id: 't-4',
    title: 'Weight-Based IV Infusion Dosage Practice (15 items)',
    subject: 'Dosage Math',
    category: 'Exam Practice',
    priority: 'Medium',
    dueDate: offsetDateIso(3),
    durationMinutes: 30,
    completed: false,
  },
];

export const DEFAULT_FLASHCARD_DECKS: FlashcardDeck[] = [
  {
    id: 'deck-starter-pharm',
    title: 'High-Alert Cardiovascular Medications',
    subject: 'Pharmacology',
    createdAt: new Date().toISOString(),
    cards: [
      {
        id: 'sc-1',
        front: 'What apical pulse threshold requires holding Digoxin and notifying the prescriber in an adult patient?',
        back: 'Hold Digoxin if apical pulse is below 60 bpm (measured for a full 60 seconds).',
        clinicalPearl: 'Also monitor serum potassium (< 3.5 mEq/L increases digoxin toxicity risk) and visual halos.',
        mastered: true,
      },
      {
        id: 'sc-2',
        front: 'Which lab value guides therapeutic IV Heparin titration, and what is the specific reversal agent?',
        back: 'Monitor aPTT (target typically 1.5–2.5x control). Reverse severe bleeding with Protamine Sulfate.',
        clinicalPearl: 'Check platelet counts regularly for Heparin-Induced Thrombocytopenia (HIT).',
        mastered: false,
      },
      {
        id: 'sc-3',
        front: 'Why must IV Furosemide be administered slowly (not exceeding 4–20 mg/min depending on dose)?',
        back: 'Rapid IV push of high-dose Furosemide increases the risk of transient or permanent ototoxicity.',
        clinicalPearl: 'Assess baseline serum K+, blood pressure, and daily weight before dosing.',
        mastered: false,
      },
      {
        id: 'sc-4',
        front: 'Which electrolyte imbalance is an absolute contraindication or major caution when giving ACE inhibitors like Lisinopril?',
        back: 'Hyperkalemia (elevated K+ > 5.0 mEq/L), because ACE inhibitors decrease aldosterone and cause potassium retention.',
        clinicalPearl: 'Teach patients to report persistent dry cough or any lip/tongue swelling (angioedema) immediately.',
        mastered: true,
      },
    ],
  },
];

export const DEFAULT_PROFILE: UserProfile = {
  fullName: 'Sara El-Mansoury',
  studentId: '2023-NUR-0418',
  email: 'sara.elmansoury@must.edu.eg',
  academicYear: '3rd Year BSN · Faculty of Nursing',
  clinicalRotation: 'Medical-Surgical & Critical Care Rotation',
  campus: 'MUST University — 6th of October Campus',
  bio: 'Bachelor of Science in Nursing candidate focusing on acute cardiac care, clinical pharmacology, and OSCE bedside readiness at MUST University Hospital.',
  focusAreas: [
    'Clinical Pharmacology',
    'Medical-Surgical Nursing',
    'Dosage Calculations',
    'OSCE & Care Plans',
  ],
};

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  language: 'en',
  responseFormat: 'adpie',
  density: 'comfortable',
  fontSize: 'standard',
  clinicalSafetyNotes: true,
  enterToSend: true,
};

export const PULSEMIND_WELCOME_MESSAGE = `👋 أهلاً بيك في PulseMind AI 💙

أنا مساعدك الذكي للمذاكرة والتمريض 🩺📚

أقدر أساعدك في:
✅ شرح عربي وإنجليزي
✅ MCQs
✅ True/False
✅ Flashcards
✅ Study Plans
✅ Exam Preparation

يلا نبدأ المذاكرة 🚀😄`;

export const SUGGESTED_NURSING_PROMPTS = [
  {
    title: 'Exam Tomorrow Sprint ⚡',
    category: 'Exam Tomorrow Mode',
    prompt: 'Exam Tomorrow',
  },
  {
    title: 'شرح عربي وإنجليزي · Heart Failure 🩺',
    category: 'Bilingual Study Partner',
    prompt:
      'Help me study Acute Heart Failure & IV Furosemide nursing care in English and Arabic together, with important keywords and rapid memory tips.',
  },
  {
    title: 'MCQs, True/False & Flashcards 📝',
    category: 'Active Recall Drills',
    prompt:
      'Generate 4 expected MCQs, 4 True/False practice questions, and 3 flashcards on Heparin vs. Warfarin monitoring and antidotes.',
  },
  {
    title: 'Lecture Summary & Study Plan 📚',
    category: 'Exam Preparation',
    prompt:
      'Summarize Diabetic Ketoacidosis (DKA) priority nursing care, give important keywords, and build me a 3-day nursing study plan.',
  },
];

function offsetExamDatetime(hoursFromNow: number): string {
  const d = new Date(Date.now() + hoursFromNow * 60 * 60 * 1000);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:00`;
}

export const DEFAULT_UPCOMING_EXAMS: UpcomingExam[] = [
  {
    id: 'exam-pharm-tomorrow',
    title: 'Clinical Pharmacology Midterm: Cardiovascular & Diuretics',
    courseCode: 'NUR 304',
    subject: 'Pharmacology',
    examType: 'Midterm',
    examDateIso: offsetExamDatetime(22),
    targetScore: 88,
    topics:
      'Loop & Thiazide Diuretics, Digoxin toxicity, Heparin vs Warfarin monitoring, ACE inhibitors, Antihypertensives & Beta-blockers',
  },
  {
    id: 'exam-medsurg-next',
    title: 'Adult Health Nursing I: Heart Failure & Shock',
    courseCode: 'NUR 301',
    subject: 'Medical-Surgical',
    examType: 'OSCE',
    examDateIso: offsetDateIso(4) + 'T09:30',
    targetScore: 85,
    topics:
      'Acute decompensated heart failure, Cardiogenic & Hypovolemic shock, ABG interpretation, Chest pain triage',
  },
  {
    id: 'exam-maternal',
    title: 'Maternal & Newborn Nursing: Intrapartum & PPH',
    courseCode: 'NUR 312',
    subject: 'Maternal-Newborn',
    examType: 'Clinical Quiz',
    examDateIso: offsetDateIso(9) + 'T11:00',
    targetScore: 90,
    topics:
      'Postpartum hemorrhage protocol, Oxytocin titration safety, Magnesium sulfate toxicity & Calcium gluconate antidote',
  },
];

export const DEFAULT_EXAM_PACK: ExamTomorrowPack = {
  id: 'pack-default-cardio',
  topic: 'Cardiovascular Pharmacology & Acute Heart Failure',
  title: 'Cardiovascular Pharmacology & Heart Failure Sprint',
  subject: 'Pharmacology',
  generatedAt: new Date().toISOString(),
  isExamTomorrowSprint: true,
  quickSummary: {
    overview:
      'Cardiovascular nursing exams focus on preventing electrolyte-induced arrhythmias, holding medications when vital signs or lab thresholds are unsafe, and prioritizing airway/oxygenation in acute fluid overload.',
    priorityActions: [
      'Assess lung sounds, SpO2, and work of breathing first in acute heart failure; position in High-Fowler’s before administering IV diuretics.',
      'Measure apical pulse for a full 60 seconds before giving Digoxin; hold if < 60 bpm in adults and check serum K+.',
      'Monitor daily weights (same time, same scale) as the most sensitive indicator of fluid volume status (1 kg = 1 L fluid).',
      'Verify aPTT before adjusting IV Heparin and INR (target 2.0–3.0) before Warfarin; watch for active bleeding.',
      'Check blood pressure and apical HR prior to Beta-blockers and ACE inhibitors; monitor for first-dose hypotension and angioedema.',
    ],
    criticalAlerts: [
      'Hypokalemia (K+ < 3.5 mEq/L) from Furosemide precipitates life-threatening Digoxin toxicity (yellow-green halos, nausea, bradycardia).',
      'Rapid IV push of high-dose Furosemide causes ototoxicity (tinnitus, hearing loss); infuse slowly and monitor creatinine.',
      'ACE inhibitors (-pril) can cause sudden lip/tongue swelling (angioedema)—treat as an immediate airway emergency.',
      'Never give potassium chloride (KCl) IV push; always dilute and infuse via pump while monitoring ECG.',
    ],
    labThresholds: [
      {
        parameter: 'Serum Potassium (K+)',
        normalRange: '3.5 – 5.0 mEq/L',
        criticalAction: 'Replace K+ if < 3.5 before Digoxin; hold ACE-I/Spironolactone if > 5.0.',
      },
      {
        parameter: 'Serum Digoxin Level',
        normalRange: '0.5 – 2.0 ng/mL',
        criticalAction: 'Hold dose & notify provider if > 2.0 ng/mL; prepare Digibind for severe toxicity.',
      },
      {
        parameter: 'INR (Warfarin)',
        normalRange: '2.0 – 3.0 (therapeutic)',
        criticalAction: 'Hold Warfarin if INR > 3.5–4.0; administer Vitamin K (Phytonadione) if bleeding.',
      },
      {
        parameter: 'aPTT (IV Heparin)',
        normalRange: '60 – 80 sec (1.5–2.5x control)',
        criticalAction: 'Pause infusion if > 90–100 sec; reverse acute hemorrhage with Protamine Sulfate.',
      },
    ],
  },
  smartNotes: [
    {
      id: 'sn-1',
      heading: 'Diuretics: Loop vs. Potassium-Sparing',
      bulletPoints: [
        'Furosemide (Loop): Acts on ascending Loop of Henle; causes K+, Na+, Mg2+, and Ca2+ wasting; give in morning to prevent nocturia.',
        'Spironolactone (K+-sparing): Aldosterone antagonist; retains K+; avoid salt substitutes and ACE inhibitors together unless closely monitored.',
        'Monitor BUN/Creatinine, strict I&O (< 30 mL/hr urine output signals hypoperfusion), and orthostatic BP.',
      ],
      mnemonicOrAnchor: 'Furosemide = "Fluid & K+ Flush"; Spironolactone = "Saves K+"',
      reviewed: false,
    },
    {
      id: 'sn-2',
      heading: 'Digoxin Safety & Toxicity Triad',
      bulletPoints: [
        'Positive inotrope (stronger contraction) and negative chronotrope (slower HR).',
        'Early toxicity signs: anorexia, nausea/vomiting, abdominal pain, fatigue, and yellow-green visual halos.',
        'Check apical pulse 60 sec (< 60 bpm = hold) AND check K+ (< 3.5 mEq/L increases binding and toxicity).',
      ],
      mnemonicOrAnchor: 'Check 2 numbers before Digoxin: Apical HR ≥ 60 & Serum K+ ≥ 3.5',
      reviewed: false,
    },
    {
      id: 'sn-3',
      heading: 'Anticoagulation & Antidotes',
      bulletPoints: [
        'Heparin (IV/SC): Immediate onset; monitor aPTT & platelets (watch for HIT: >50% platelet drop); antidote = Protamine Sulfate.',
        'Warfarin (PO): Delayed onset 3–5 days (overlap with Heparin initially); monitor PT/INR; antidote = Vitamin K.',
        'Keep dietary Vitamin K intake (spinach, kale) consistent rather than eliminating it completely.',
      ],
      mnemonicOrAnchor: 'Heparin -> aPTT -> Protamine | Warfarin -> INR -> Vitamin K',
      reviewed: false,
    },
    {
      id: 'sn-4',
      heading: 'Acute Heart Failure Bedside Priority',
      bulletPoints: [
        'Crackles, pink frothy sputum, SpO2 < 90%, S3 gallop, and JVD indicate acute pulmonary edema.',
        'Priority sequence: Upright High-Fowler’s position -> Oxygen -> IV Furosemide -> Morphine/Nitroglycerin as ordered.',
        'Evaluate effectiveness by clearer breath sounds, decreased dyspnea, and brisk urine output.',
      ],
      mnemonicOrAnchor: 'UNLOAD FAST: Upright, Nitrates, Lasix, Oxygen, Assess lungs/I&O',
      reviewed: false,
    },
  ],
  keywords: [
    {
      id: 'kw-1',
      term: 'Protamine Sulfate',
      category: 'Pharmacology',
      highYieldDefinition: 'Specific reversal agent (antidote) for unfractionated Heparin and partially for LMWH.',
      examTip: 'Always pair Heparin -> aPTT -> Protamine Sulfate.',
      mastered: false,
    },
    {
      id: 'kw-2',
      term: 'Angioedema',
      category: 'Priority Signs',
      highYieldDefinition: 'Rapid swelling of lips, tongue, face, or airway caused by bradykinin buildup with ACE inhibitors.',
      examTip: 'Airway emergency—stop the -pril drug immediately and prepare epinephrine/airway support.',
      mastered: false,
    },
    {
      id: 'kw-3',
      term: 'Apical Pulse < 60 bpm',
      category: 'Procedures',
      highYieldDefinition: 'Mandatory hold threshold in adults before administering Digoxin or beta-blockers.',
      examTip: 'Count apical pulse at 5th ICS midclavicular line for a full 60 seconds.',
      mastered: false,
    },
    {
      id: 'kw-4',
      term: 'K+ < 3.5 mEq/L',
      category: 'Lab Thresholds',
      highYieldDefinition: 'Hypokalemia; slows myocardial repolarization and sensitizes myocardium to Digoxin toxicity.',
      examTip: 'Loop diuretics + Digoxin = classic exam trap if K+ is low.',
      mastered: false,
    },
    {
      id: 'kw-5',
      term: 'Ototoxicity',
      category: 'Priority Signs',
      highYieldDefinition: 'Tinnitus or hearing impairment triggered by rapid IV push of high-dose Furosemide.',
      examTip: 'Administer IV Furosemide slowly (4–20 mg/min) and ask about ringing in ears.',
      mastered: false,
    },
    {
      id: 'kw-6',
      term: 'BNP > 100 pg/mL',
      category: 'Lab Thresholds',
      highYieldDefinition: 'B-type Natriuretic Peptide released from stretched ventricles; confirms acute heart failure.',
      examTip: 'Differentiates cardiac dyspnea from COPD exacerbation.',
      mastered: false,
    },
    {
      id: 'kw-7',
      term: 'Vitamin K (Phytonadione)',
      category: 'Pharmacology',
      highYieldDefinition: 'Reversal agent for Warfarin overdose or severe INR elevation with bleeding.',
      examTip: 'Monitor INR closely after reversal to prevent rebound thrombosis.',
      mastered: false,
    },
    {
      id: 'kw-8',
      term: 'Daily Weight Monitoring',
      category: 'Procedures',
      highYieldDefinition: 'Gold-standard non-invasive measure of fluid retention in heart failure (1 kg gain ≈ 1 L fluid).',
      examTip: 'Report weight gain > 1 kg in 24 hrs or > 2.2 kg in 1 week.',
      mastered: false,
    },
  ],
  mcqs: [
    {
      id: 'ex-mcq-1',
      stem: 'A 68-year-old patient with acute decompensated heart failure is prescribed Digoxin 0.25 mg PO and Furosemide 40 mg IV. Before administering Digoxin, the nurse notes: Apical HR 68 bpm, BP 118/72 mmHg, Serum K+ 2.9 mEq/L, Serum Na+ 138 mEq/L. What is the priority nursing action?',
      options: [
        'Administer Digoxin now because the apical pulse is above 60 bpm.',
        'Hold Digoxin and notify the prescriber regarding the hypokalemia.',
        'Administer Furosemide first to reduce preload, then give Digoxin.',
        'Recheck the apical pulse in 30 minutes and give half the Digoxin dose.',
      ],
      correctIndex: 1,
      rationale:
        'Hypokalemia (K+ 2.9 mEq/L) markedly increases the risk of Digoxin toxicity because low extracellular potassium allows more Digoxin to bind to myocardial Na+/K+-ATPase pumps. The nurse must hold Digoxin and notify the prescriber to correct K+ first.',
      distractorNote:
        'Even though HR is > 60 bpm, giving Digoxin with K+ 2.9 mEq/L is unsafe; giving Furosemide first would worsen hypokalemia; nurses never split prescribed doses independently.',
    },
    {
      id: 'ex-mcq-2',
      stem: 'A patient receiving a continuous IV Heparin infusion for a pulmonary embolism develops hematuria and epistaxis. The STAT aPTT returns at 118 seconds. Which medication should the nurse prepare to administer?',
      options: [
        'Vitamin K (Phytonadione)',
        'Protamine Sulfate',
        'Aminocaproic Acid',
        'Atropine Sulfate',
      ],
      correctIndex: 1,
      rationale:
        'Protamine Sulfate is the specific reversal agent for unfractionated Heparin and rapidly neutralizes Heparin activity when severe bleeding or supratherapeutic aPTT occurs.',
      distractorNote:
        'Vitamin K reverses Warfarin (not Heparin); Aminocaproic acid is an antifibrinolytic for fibrinolytic bleeding; Atropine treats symptomatic bradycardia.',
    },
    {
      id: 'ex-mcq-3',
      stem: 'A nurse is teaching a patient newly prescribed Lisinopril 10 mg PO daily for hypertension and systolic heart failure. Which statement by the patient requires immediate priority follow-up?',
      options: [
        '"I will rise slowly from bed to avoid feeling dizzy."',
        '"I noticed a mild dry cough over the past two weeks."',
        '"My lower lip and tongue started feeling swollen this morning."',
        '"I will avoid using potassium-based salt substitutes."',
      ],
      correctIndex: 2,
      rationale:
        'Lip and tongue swelling indicates angioedema, a life-threatening adverse reaction to ACE inhibitors that can rapidly progress to airway obstruction. It requires immediate discontinuation and emergency airway assessment.',
      distractorNote:
        'Rising slowly and avoiding potassium salt substitutes are appropriate self-care; a dry cough warrants notifying the provider to switch to an ARB, but is not an acute airway emergency like angioedema.',
    },
    {
      id: 'ex-mcq-4',
      stem: 'A patient admitted with acute pulmonary edema has SpO2 87% on room air, RR 30/min, and coarse crackles bilaterally. Which nursing intervention should the nurse perform FIRST?',
      options: [
        'Administer IV Furosemide 40 mg over 2 minutes.',
        'Place the patient in High-Fowler’s position and apply supplemental oxygen.',
        'Insert an indwelling urinary catheter to monitor hourly urine output.',
        'Obtain a 12-lead ECG and serum BNP level.',
      ],
      correctIndex: 1,
      rationale:
        'Using the ABC (Airway, Breathing, Circulation) priority framework, positioning the patient upright (High-Fowler’s) immediately reduces venous return/preload and improves diaphragmatic excursion while oxygen treats acute hypoxemia (SpO2 87%).',
      distractorNote:
        'IV Furosemide, Foley placement, and diagnostic labs are important next steps, but immediate positioning and oxygenation address life-threatening hypoxia fastest.',
    },
  ],
  trueFalse: [
    {
      id: 'ex-tf-1',
      statement:
        'When administering high-dose IV Furosemide, rapid IV push over 15 seconds is preferred to achieve faster diuresis.',
      isTrue: false,
      explanation:
        'Rapid IV push of high-dose Furosemide can cause ototoxicity (tinnitus or hearing loss) and sudden hypotension. It must be infused slowly per institutional rate guidelines.',
      keyTakeaway: 'Push IV Furosemide slowly and monitor blood pressure and hearing.',
    },
    {
      id: 'ex-tf-2',
      statement:
        'A patient starting oral Warfarin for DVT should continue concurrent IV or subcutaneous Heparin until the INR reaches therapeutic range (2.0–3.0).',
      isTrue: true,
      explanation:
        'Warfarin takes 3–5 days to deplete existing clotting factors and achieve therapeutic anticoagulation, so bridging with Heparin is required until INR is therapeutic.',
      keyTakeaway: 'Bridge Heparin and Warfarin for 3–5 days until INR is 2.0–3.0.',
    },
    {
      id: 'ex-tf-3',
      statement:
        'A daily weight gain of 1.5 kg (3.3 lbs) in 24 hours in a heart failure patient typically reflects approximately 1.5 liters of fluid retention.',
      isTrue: true,
      explanation:
        '1 kg of body weight change equals roughly 1 liter of fluid. Rapid weight gain is an early warning sign of worsening fluid overload.',
      keyTakeaway: '1 kg weight gain = 1 L fluid retention; weigh daily at the same time.',
    },
    {
      id: 'ex-tf-4',
      statement:
        'Yellow-green halos around lights and anorexia are expected therapeutic effects when starting Digoxin.',
      isTrue: false,
      explanation:
        'Visual disturbances (yellow-green halos), anorexia, nausea, and bradycardia are classic early signs of Digoxin toxicity, requiring immediate holding of the drug and lab check.',
      keyTakeaway: 'Halos + GI upset + bradycardia = Digoxin toxicity until proven otherwise.',
    },
    {
      id: 'ex-tf-5',
      statement:
        'Potassium chloride (KCl) can be safely administered as an undiluted IV push during emergency hypokalemia.',
      isTrue: false,
      explanation:
        'Never give IV KCl via IV push—it causes fatal cardiac arrest. Always dilute in an IV bag and administer via an infusion pump.',
      keyTakeaway: 'Never IV push KCl; always dilute and infuse via pump.',
    },
  ],
  revisionCards: [
    {
      id: 'ex-rc-1',
      front: 'Hold Digoxin if apical pulse is below ___ bpm OR serum K+ is below ___ mEq/L.',
      back: 'Hold Digoxin if apical pulse < 60 bpm (adults) or serum K+ < 3.5 mEq/L.',
      clinicalPearl: 'Always palpate/auscultate the apical pulse for a full 60 seconds.',
      confident: false,
    },
    {
      id: 'ex-rc-2',
      front: 'Antidote & Monitoring Lab for IV Heparin vs. Oral Warfarin?',
      back: 'Heparin: monitor aPTT (60–80 sec), antidote Protamine Sulfate. Warfarin: monitor PT/INR (2.0–3.0), antidote Vitamin K.',
      clinicalPearl: 'Check platelet count on Heparin to catch Heparin-Induced Thrombocytopenia (HIT).',
      confident: false,
    },
    {
      id: 'ex-rc-3',
      front: 'First bedside nursing action for acute pulmonary edema (crackles, SpO2 86%)?',
      back: 'Place patient upright in High-Fowler’s position (legs dangling if possible) and apply supplemental O2.',
      clinicalPearl: 'Positioning decreases venous return to the congested lungs immediately.',
      confident: false,
    },
    {
      id: 'ex-rc-4',
      front: 'What serious adverse reaction distinguishes ACE inhibitors (-pril) from ARBs (-sartan)?',
      back: 'Persistent dry cough and life-threatening angioedema (bradykinin-mediated) occur far more with ACE inhibitors.',
      clinicalPearl: 'Both drug classes can cause hyperkalemia and are contraindicated in pregnancy.',
      confident: false,
    },
    {
      id: 'ex-rc-5',
      front: 'Key nursing safety rules before giving IV Furosemide (Lasix)?',
      back: 'Verify BP (hold if hypotensive), check serum K+ and renal function, push slowly to prevent ototoxicity, and monitor strict I&O.',
      clinicalPearl: 'Give routine oral doses in the morning so diuresis does not disrupt sleep.',
      confident: false,
    },
  ],
};

