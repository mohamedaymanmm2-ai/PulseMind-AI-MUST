import {
  AiConnectionStatus,
  AppLanguage,
  ClinicalResponseFormat,
  ExamType,
  StudyTaskCategory,
  StudyTaskPriority,
} from '../types';

export interface TranslationDictionary {
  common: {
    brandName: string;
    openNav: string;
    closeNav: string;
    expandSidebar: string;
    collapseSidebar: string;
    darkMode: string;
    lightMode: string;
    on: string;
    off: string;
    cancel: string;
    reset: string;
    add: string;
    delete: string;
    copy: string;
    copied: string;
    previous: string;
    next: string;
    min: string;
    hrs: string;
    today: string;
    overdue: string;
    completed: string;
    all: string;
    pending: string;
    prioritySuffix: string;
    languageLabel: string;
    switchToArabic: string;
    switchToEnglish: string;
  };
  nav: {
    overview: string;
    capabilities: string;
    clinicalTracks: string;
    faq: string;
    openDashboard: string;
    dashboard: string;
    examMode: string;
    aiChat: string;
    flashcards: string;
    mcqGenerator: string;
    trueFalse: string;
    studyPlanner: string;
    gpaCalculator: string;
    progressTracking: string;
    userProfile: string;
    settings: string;
    landingPage: string;
    newClinicalChat: string;
    studySuite: string;
    accountPrefs: string;
    recentStudies: string;
    noRecentChats: string;
    deleteChat: string;
  };
  landing: {
    universityTag: string;
    heroTitle: string;
    heroSubtitle: string;
    heroCtaDashboard: string;
    heroCtaExam: string;
    heroCtaChat: string;
    heroFeature1: string;
    heroFeature2: string;
    heroFeature3: string;
    heroFallbackTitle: string;
    heroImgAlt: string;
    capSectionKicker: string;
    capSectionTitle: string;
    tryExample: string;
    capabilities: {
      index: string;
      title: string;
      description: string;
      prompt: string;
    }[];
    tracksSectionKicker: string;
    tracksSectionTitle: string;
    tracksSectionDesc: string;
    labFallbackTitle: string;
    labImgAlt: string;
    practiceInChat: string;
    tracks: {
      year: string;
      focus: string;
      prompt: string;
    }[];
    faqSectionKicker: string;
    faqSectionTitle: string;
    faqSectionDesc: string;
    faqs: {
      q: string;
      a: string;
    }[];
    footerCredit: string;
    footerLinks: {
      dashboard: string;
      exam: string;
      chat: string;
      flashcards: string;
      mcq: string;
      gpa: string;
      planner: string;
      progress: string;
    };
  };
  dashboard: {
    title: string;
    newChatBtn: string;
    universityLine: string;
    welcomeBack: string;
    focusPrefix: string;
    examTomorrowBtn: string;
    openExamModeBtn: string;
    addStudyTaskBtn: string;
    viewProgressBtn: string;
    kpiGpaTitle: string;
    kpiGpaSemester: string;
    kpiTasksTitle: string;
    kpiTasksPending: string;
    kpiTasksLogged: string;
    kpiCardsTitle: string;
    kpiCardsDeckSingular: string;
    kpiCardsDeckPlural: string;
    kpiCardsMasteredOf: string;
    kpiQuizTitle: string;
    kpiQuizSingular: string;
    kpiQuizPlural: string;
    kpiQuizCorrect: string;
    kpiQuizEmpty: string;
    suiteKicker: string;
    suiteTitle: string;
    tools: {
      exam: { title: string; subtitle: string };
      flashcards: { title: string; subtitle: string };
      mcq: { title: string; subtitle: string };
      truefalse: { title: string; subtitle: string };
      gpa: { title: string; subtitle: string };
      planner: { title: string; subtitle: string };
      progress: { title: string; subtitle: string };
    };
    scheduleKicker: string;
    scheduleTitle: string;
    openPlanner: string;
    allTasksDone: string;
    allTasksDoneSub: string;
    scheduleTaskBtn: string;
    activityKicker: string;
    activityTitle: string;
    openAiChat: string;
    noRecentActivity: string;
    noRecentActivitySub: string;
    generateFirstQuiz: string;
    clinicalChatLabel: string;
    mcqQuizLabel: string;
    tfDrillLabel: string;
    creditsAbbr: string;
  };
  standing: {
    noCredits: string;
    deansHonors: string;
    goodStanding: string;
    satisfactory: string;
    academicWarning: string;
  };
  chat: {
    newClinicalStudy: string;
    newChat: string;
    goodMorning: string;
    goodAfternoon: string;
    goodEvening: string;
    studyPartnerBadge: string;
    welcomeMessage: string;
    errorTitle: string;
    serviceBusyError: string;
    stoppedByUser: string;
    offlineError: string;
    connectionStatus: Record<AiConnectionStatus, string>;
    thinkingPlaceholder: string;
    typingStatus: string;
    regenerate: string;
    retry: string;
    stopGenerating: string;
    sendMessage: string;
    composerPlaceholder: string;
    examTomorrowChip: string;
    disclaimer: string;
    formats: Record<ClinicalResponseFormat, string>;
    suggestedPrompts: {
      title: string;
      category: string;
      prompt: string;
    }[];
  };
  exam: {
    title: string;
    subtitleTomorrow: string;
    subtitleStandard: string;
    tomorrowOn: string;
    activateTomorrow: string;
    tabs: {
      sprint: string;
      summaries: string;
      keywords: string;
      mcq: string;
      truefalse: string;
      cards: string;
      analytics: string;
    };
    sprintActiveKicker: string;
    sprintStats: string;
    jumpSummary: string;
    jumpKeywords: string;
    jumpMcqs: string;
    jumpTf: string;
    jumpCards: string;
    commandCenterKicker: string;
    commandTitleTomorrow: string;
    commandTitleStandard: string;
    commandDescTomorrow: string;
    commandDescStandard: string;
    modeTomorrow: string;
    modeStandard: string;
    addExam: string;
    closeForm: string;
    scheduleFormTitle: string;
    examTitleLabel: string;
    examTitlePlaceholder: string;
    courseCodeLabel: string;
    subjectDomainLabel: string;
    examDateTimeLabel: string;
    formatLabel: string;
    targetScoreLabel: string;
    syllabusLabel: string;
    syllabusPlaceholder: string;
    saveCountdownBtn: string;
    examCountdownLabel: string;
    windowReached: string;
    tomorrowWindowLeft: string;
    daysRemaining: string;
    targetLabel: string;
    daysUnit: string;
    hoursUnit: string;
    minsUnit: string;
    secsUnit: string;
    topicsPrefix: string;
    cramThisExam: string;
    emptyExams: string;
    upcomingExamsLabel: string;
    nowLabel: string;
    dayShort: string;
    hourShort: string;
    genPackTitleTomorrow: string;
    genPackTitleStandard: string;
    genPackMeta: string;
    genPackPlaceholder: string;
    genPackHelper: string;
    buildingPack: string;
    generateTomorrowKit: string;
    buildStudyPack: string;
    presets: string[];
    examTypes: Record<ExamType, string>;
    summaryKicker: string;
    summaryCounts: string;
    priorityActionsTitle: string;
    criticalAlertsTitle: string;
    labThresholdsTitle: string;
    labColParam: string;
    labColRange: string;
    labColAction: string;
    smartNotesKicker: string;
    smartNotesTitle: string;
    addRevisionNote: string;
    noteHeadingLabel: string;
    noteHeadingPlaceholder: string;
    noteMnemonicLabel: string;
    noteMnemonicPlaceholder: string;
    notePointsLabel: string;
    notePointsPlaceholder: string;
    saveSmartNote: string;
    reviewed: string;
    markReviewed: string;
    memoryAnchor: string;
    keywordsKicker: string;
    keywordsTitle: string;
    keywordsSearchPlaceholder: string;
    keywordsEmpty: string;
    keywordMastered: string;
    keywordGotIt: string;
    examTipLabel: string;
    keywordCategories: {
      All: string;
      Pharmacology: string;
      'Lab Thresholds': string;
      'Priority Signs': string;
      Procedures: string;
    };
    mcqPracticeKicker: string;
    mcqExpectedTitle: string;
    answeredCountOf: string;
    finalScorePrefix: string;
    instantRationale: string;
    examSimulation: string;
    retakeMcqs: string;
    submitRecordScore: string;
    questionOf: string;
    correct: string;
    incorrect: string;
    clinicalRationale: string;
    distractorNoteLabel: string;
    tfPracticeKicker: string;
    tfRapidTitle: string;
    answeredCorrect: string;
    savedToAnalytics: string;
    saveDrillScore: string;
    statementOf: string;
    trueLabel: string;
    falseLabel: string;
    actuallyLabel: string;
    keyRuleLabel: string;
    rapidCardsKicker: string;
    rapidCardsTitle: string;
    shuffleCards: string;
    rapidAnswerLabel: string;
    examPromptLabel: string;
    cardNumberOf: string;
    confidentState: string;
    reviewingState: string;
    clinicalPearlLabel: string;
    clickToFlipAnswer: string;
    clickToFlipPrompt: string;
    confidentUnmark: string;
    markConfident: string;
    analyticsKicker: string;
    analyticsTitle: string;
    totalLoggedHrs: string;
    activePackReadiness: string;
    notesKeywordsCards: string;
    quizAccuracyCombined: string;
    itemsCorrect: string;
    completeDrillToScore: string;
    flashcardLibraryMastery: string;
    deckCardsMastered: string;
    assessmentsCompleted: string;
    upcomingExamsTracked: string;
    sevenDayMinutes: string;
    domainAccuracy: string;
    domainAccuracyEmpty: string;
    pendingPractice: string;
    personalizedRecsKicker: string;
    personalizedRecsTitle: string;
    personalizingPlan: string;
    personalizeWithAi: string;
    priorityBadge: string;
    priorities: {
      Urgent: string;
      High: string;
      Maintain: string;
    };
    recActions: {
      exam_tomorrow: string;
      mcq: string;
      truefalse: string;
      flashcards: string;
      summary: string;
    };
    heuristicFocusWithExam: string;
    heuristicFocusDefault: string;
  };
  flashcards: {
    title: string;
    subtitle: string;
    genKicker: string;
    genTitle: string;
    topicLabel: string;
    topicPlaceholder: string;
    studyFocusLabel: string;
    cardCountLabel: string;
    cardsUnit: string;
    generatingBtn: string;
    generateBtn: string;
    savedDecksKicker: string;
    savedDecksTitle: string;
    noDecksSaved: string;
    masteredSuffix: string;
    noDeckSelected: string;
    noDeckSelectedSub: string;
    cardsMasteredOf: string;
    allFilter: string;
    needsReviewFilter: string;
    shuffle: string;
    allMasteredTitle: string;
    allMasteredSub: string;
    reviewAllCards: string;
    answerPearlLabel: string;
    promptLabel: string;
    cardOf: string;
    masteredState: string;
    learningState: string;
    bedsidePearlLabel: string;
    flipToPrompt: string;
    flipToAnswer: string;
    masteredUnmark: string;
    markMastered: string;
    presets: string[];
    focusOptions: string[];
  };
  mcq: {
    title: string;
    subtitle: string;
    builderKicker: string;
    builderTitle: string;
    topicLabel: string;
    topicPlaceholder: string;
    questionsLabel: string;
    questionsUnit: string;
    levelLabel: string;
    feedbackModeLabel: string;
    instant: string;
    examEnd: string;
    generatingBtn: string;
    generateBtn: string;
    emptyTitle: string;
    emptySub: string;
    answeredOf: string;
    scoreLabel: string;
    retakeQuiz: string;
    submitSaveScore: string;
    questionOf: string;
    correct: string;
    incorrect: string;
    clinicalRationale: string;
    distractorPrefix: string;
    presets: string[];
    difficulties: string[];
  };
  truefalse: {
    title: string;
    subtitle: string;
    builderKicker: string;
    builderTitle: string;
    topicLabel: string;
    topicPlaceholder: string;
    statementsLabel: string;
    statementsUnit: string;
    focusLabel: string;
    generatingBtn: string;
    generateBtn: string;
    emptyTitle: string;
    emptySub: string;
    answeredCorrect: string;
    savedToProgress: string;
    saveDrillScore: string;
    statementOf: string;
    correct: string;
    incorrect: string;
    actually: string;
    trueLabel: string;
    falseLabel: string;
    keyRulePrefix: string;
    presets: string[];
    focusLevels: string[];
  };
  planner: {
    title: string;
    subtitle: string;
    addKicker: string;
    addTitle: string;
    taskTitleLabel: string;
    taskTitlePlaceholder: string;
    subjectLabel: string;
    studyTypeLabel: string;
    targetDateLabel: string;
    minutesLabel: string;
    priorityLabel: string;
    notesLabel: string;
    notesPlaceholder: string;
    addToPlanBtn: string;
    timerKicker: string;
    timerTitle: string;
    sessionSubjectLabel: string;
    pause: string;
    startSession: string;
    resetTimer: string;
    logTime: string;
    loggedNotice: string;
    scheduleTitle: string;
    scheduleSummary: string;
    allSubjects: string;
    noMatchingTasks: string;
    noMatchingTasksSub: string;
    priorityWord: string;
    categories: Record<StudyTaskCategory, string>;
    priorities: Record<StudyTaskPriority, string>;
    subjects: string[];
  };
  gpa: {
    title: string;
    subtitle: string;
    hideScale: string;
    viewScale: string;
    semesterGpa: string;
    ptsCredits: string;
    projectedCgpa: string;
    totalCredits: string;
    academicStanding: string;
    facultyBenchmark: string;
    targetForecast: string;
    achieved: string;
    reqSuffix: string;
    next15Cr: string;
    scaleTitle: string;
    scaleSubtitle: string;
    priorKicker: string;
    priorTitle: string;
    semesterLabel: string;
    priorCreditsLabel: string;
    priorCgpaLabel: string;
    targetCgpaLabel: string;
    coursesKicker: string;
    currentSemesterFallback: string;
    resetSample: string;
    addCourse: string;
    noCoursesTitle: string;
    noCoursesSub: string;
    addFirstCourse: string;
    colCode: string;
    colTitle: string;
    colCredits: string;
    colGrade: string;
    colQualityPts: string;
    colAction: string;
    courseTitlePlaceholder: string;
    crUnit: string;
  };
  progress: {
    title: string;
    subtitle: string;
    quizAccuracy: string;
    completedItems: string;
    flashcardMastery: string;
    cardsMasteredOf: string;
    taskCompletion: string;
    studyTasksDone: string;
    studyTimeLogged: string;
    projectedCgpa: string;
    weeklyLogKicker: string;
    weeklyLogTitle: string;
    readinessKicker: string;
    readinessTitle: string;
    milestones: {
      chat: { label: string; cta: string };
      gpa: { label: string; cta: string };
      planner: { label: string; cta: string };
      cards: { label: string; cta: string };
      quiz: { label: string; cta: string };
    };
    coverageKicker: string;
    coverageTitle: string;
    coverageEmpty: string;
    quizTag: string;
    cardsTag: string;
    minLoggedTag: string;
    cardsLabel: string;
    quizItemsLabel: string;
    historyKicker: string;
    historyTitle: string;
    clearHistory: string;
    noAttemptsTitle: string;
    noAttemptsSub: string;
    openMcq: string;
    tryTf: string;
    colTitle: string;
    colMode: string;
    colSubject: string;
    colDate: string;
    colScore: string;
    modeMcq: string;
    modeTf: string;
  };
  profile: {
    title: string;
    studentIdPrefix: string;
    studyThreads: string;
    clinicalPrompts: string;
    fullName: string;
    studentId: string;
    email: string;
    academicYear: string;
    clinicalRotation: string;
    campus: string;
    bio: string;
    focusAreas: string;
    focusPlaceholder: string;
    addBtn: string;
    resetDefault: string;
    profileSaved: string;
    saveProfile: string;
  };
  settings: {
    title: string;
    appearanceKicker: string;
    appearanceTitle: string;
    languageTitle: string;
    languageDesc: string;
    colorModeTitle: string;
    colorModeDesc: string;
    themes: {
      light: string;
      dark: string;
      system: string;
    };
    densityTitle: string;
    densityDesc: string;
    densityOptions: {
      comfortable: string;
      compact: string;
    };
    textSizeTitle: string;
    textSizeDesc: string;
    fontSizeOptions: {
      standard: string;
      large: string;
    };
    clinicalKicker: string;
    clinicalTitle: string;
    defaultFormatTitle: string;
    formats: Record<ClinicalResponseFormat, { label: string; description: string }>;
    safetyTitle: string;
    safetyDesc: string;
    enterSendTitle: string;
    enterSendDesc: string;
    dataKicker: string;
    dataTitle: string;
    exportTitle: string;
    exportDesc: string;
    downloaded: string;
    downloadJson: string;
    clearTitle: string;
    clearDesc: string;
    confirmDelete: string;
    clearHistory: string;
  };
}

export const TRANSLATIONS: Record<AppLanguage, TranslationDictionary> = {
  en: {
    common: {
      brandName: 'PulseMind AI',
      openNav: 'Open navigation menu',
      closeNav: 'Close navigation menu',
      expandSidebar: 'Expand sidebar',
      collapseSidebar: 'Collapse sidebar',
      darkMode: 'Dark Mode',
      lightMode: 'Light Mode',
      on: 'On',
      off: 'Off',
      cancel: 'Cancel',
      reset: 'Reset',
      add: 'Add',
      delete: 'Delete',
      copy: 'Copy',
      copied: 'Copied',
      previous: 'Previous',
      next: 'Next',
      min: 'min',
      hrs: 'hrs',
      today: 'Today',
      overdue: 'Overdue',
      completed: 'Completed',
      all: 'All',
      pending: 'Pending',
      prioritySuffix: 'priority',
      languageLabel: 'Language',
      switchToArabic: 'Switch to Arabic',
      switchToEnglish: 'Switch to English',
    },
    nav: {
      overview: 'Overview',
      capabilities: 'Capabilities',
      clinicalTracks: 'Clinical Tracks',
      faq: 'FAQ',
      openDashboard: 'Open Dashboard',
      dashboard: 'Nursing Dashboard',
      examMode: 'Exam Mode',
      aiChat: 'AI Clinical Chat',
      flashcards: 'Flashcards',
      mcqGenerator: 'MCQ Generator',
      trueFalse: 'True/False',
      studyPlanner: 'Study Planner',
      gpaCalculator: 'GPA Calculator',
      progressTracking: 'Progress Tracking',
      userProfile: 'User Profile',
      settings: 'Settings',
      landingPage: 'Landing Page',
      newClinicalChat: 'New Clinical Chat',
      studySuite: 'Study Suite',
      accountPrefs: 'Account & Preferences',
      recentStudies: 'Recent Studies',
      noRecentChats: 'No conversations yet. Start a clinical topic to save it here.',
      deleteChat: 'Delete chat',
    },
    landing: {
      universityTag: 'MUST University · Faculty of Nursing',
      heroTitle: 'Clinical nursing reasoning, built for MUST students.',
      heroSubtitle:
        'A calm, structured study workspace for clinical AI chat, flashcards, MCQ and True/False drills, GPA planning, and rotation progress tracking.',
      heroCtaDashboard: 'Open Nursing Dashboard',
      heroCtaExam: 'Enter Exam Mode',
      heroCtaChat: 'Launch AI Chat',
      heroFeature1: 'ADPIE & NANDA-I Chat',
      heroFeature2: 'Flashcards, MCQ & True/False',
      heroFeature3: 'GPA & Study Planner',
      heroFallbackTitle: 'MUST University Nursing Clinical Workspace',
      heroImgAlt: 'Nursing student reviewing pharmacology and clinical notes at a university library',
      capSectionKicker: '01. Core Capabilities',
      capSectionTitle: 'Built around clinical workflows, not generic trivia',
      tryExample: 'Try example in chat',
      capabilities: [
        {
          index: '01',
          title: 'NANDA-I & ADPIE Care Plans',
          description:
            'Structure patient assessments into prioritized nursing diagnoses, measurable NOC outcomes, and evidence-based NIC interventions.',
          prompt:
            'Build a complete ADPIE and NANDA-I care plan for a post-operative patient at risk for impaired gas exchange.',
        },
        {
          index: '02',
          title: 'IV & Dosage Calculations',
          description:
            'Verify weight-based drips, infusion pump rates, and pediatric mg/kg conversions with step-by-step dimensional analysis.',
          prompt:
            'Walk me through a pediatric amoxicillin weight-based dosage calculation for an 18 kg child ordered 45 mg/kg/day divided q12h.',
        },
        {
          index: '03',
          title: 'Clinical Pharmacology',
          description:
            'Review drug mechanisms, black-box warnings, lab value thresholds, and bedside administration checks before hospital rounds.',
          prompt:
            'Compare nursing monitoring, antidote, and lab checks for Heparin vs. Warfarin therapy.',
        },
        {
          index: '04',
          title: 'OSCE & Exam Reasoning',
          description:
            'Practice clinical vignette triage using ABCs and safety-first prioritization tailored to MUST Faculty of Nursing coursework.',
          prompt:
            'Give me a 3-question Med-Surg OSCE practice scenario on diabetic ketoacidosis with rationales after I answer.',
        },
      ],
      tracksSectionKicker: '02. MUST Nursing Curriculum',
      tracksSectionTitle: 'Aligned across every BSN clinical rotation',
      tracksSectionDesc:
        'Configure your academic year and rotation inside your profile so PulseMind AI calibrates depth, lab detail, and priority frameworks automatically.',
      labFallbackTitle: 'Clinical Simulation & OSCE Prep',
      labImgAlt: 'Modern university nursing clinical simulation laboratory',
      practiceInChat: 'Practice in Chat',
      tracks: [
        {
          year: 'Year 1 · Foundations',
          focus: 'Vital signs, aseptic technique, anatomy & physiology, and therapeutic communication',
          prompt: 'Review the normal adult vital sign ranges and early nursing signs of respiratory distress.',
        },
        {
          year: 'Year 2 · Pathophysiology & Pharm',
          focus: 'Fluid & electrolytes, autonomic drugs, antimicrobial stewardship, and lab interpretation',
          prompt: 'Explain the ECG changes and priority nursing interventions for severe hyperkalemia (K+ 6.4 mEq/L).',
        },
        {
          year: 'Year 3 · Med-Surg & Maternal',
          focus: 'Cardiopulmonary care plans, obstetric emergencies, pediatric dosing, and peri-op care',
          prompt: 'Outline the priority bedside nursing interventions for postpartum hemorrhage.',
        },
        {
          year: 'Year 4 · Critical Care & Internship',
          focus: 'ICU hemodynamic monitoring, sepsis bundles, arterial blood gases, and ventilator alarms',
          prompt: 'Walk through systematic ABG interpretation for uncompensated vs. compensated respiratory acidosis.',
        },
      ],
      faqSectionKicker: '03. Questions',
      faqSectionTitle: 'Study standards & safety',
      faqSectionDesc:
        'Designed for clarity during exam prep, pharmacology review, and hospital rotations.',
      faqs: [
        {
          q: 'How is PulseMind AI tailored for MUST University Nursing students?',
          a: 'Your profile stores your academic year, current clinical rotation, and preferred study format (ADPIE, NANDA-I, Dosage Math, or Exam Prep). PulseMind AI adapts every explanation to match your coursework stage.',
        },
        {
          q: 'Does it support NANDA-I care plans and dosage calculations?',
          a: 'Yes. Switch your clinical response format inside Settings at any time to receive structured NANDA-I nursing diagnoses or step-by-step dimensional analysis for IV and weight-based medications.',
        },
        {
          q: 'Is there a Dark Mode for late-night exam prep and night shifts?',
          a: 'Yes. Toggle Dark Mode directly from the sidebar or Settings page, or set it to follow your system appearance automatically.',
        },
        {
          q: 'Can I rely on PulseMind AI for live bedside patient orders?',
          a: 'PulseMind AI is an academic study and clinical reasoning companion. Always verify medication doses, hospital protocols, and patient orders with your clinical preceptor and MUST University Hospital guidelines.',
        },
      ],
      footerCredit: '· Created & developed by Mohamed Ayman Kamel Elsawy (ID: 200105235)',
      footerLinks: {
        dashboard: 'Dashboard',
        exam: 'Exam Mode',
        chat: 'AI Chat',
        flashcards: 'Flashcards',
        mcq: 'MCQ Generator',
        gpa: 'GPA Calculator',
        planner: 'Study Planner',
        progress: 'Progress',
      },
    },
    dashboard: {
      title: 'Nursing Dashboard',
      newChatBtn: 'New Clinical Chat',
      universityLine: 'MUST University',
      welcomeBack: 'Welcome back',
      focusPrefix: 'Focus',
      examTomorrowBtn: 'Exam Tomorrow',
      openExamModeBtn: 'Open Exam Mode',
      addStudyTaskBtn: 'Add Study Task',
      viewProgressBtn: 'View Full Progress',
      kpiGpaTitle: 'Projected Cumulative GPA',
      kpiGpaSemester: 'Semester GPA',
      kpiTasksTitle: 'Study Plan Tasks',
      kpiTasksPending: 'pending',
      kpiTasksLogged: 'hrs logged across sessions',
      kpiCardsTitle: 'Flashcard Mastery',
      kpiCardsDeckSingular: 'deck',
      kpiCardsDeckPlural: 'decks',
      kpiCardsMasteredOf: 'cards mastered',
      kpiQuizTitle: 'Quiz Accuracy',
      kpiQuizSingular: 'quiz',
      kpiQuizPlural: 'quizzes',
      kpiQuizCorrect: 'items correct',
      kpiQuizEmpty: 'Take an MCQ or True/False drill',
      suiteKicker: '01. Study Suite',
      suiteTitle: 'Clinical & academic tools',
      tools: {
        exam: {
          title: 'Exam Mode & Rapid Sprint',
          subtitle: 'Exam Tomorrow kits, high-yield summaries, keywords & countdowns',
        },
        flashcards: {
          title: 'Flashcards Generator',
          subtitle: 'Turn clinical topics or notes into active-recall cards',
        },
        mcq: {
          title: 'MCQ Generator',
          subtitle: 'Practice NCLEX & MUST OSCE clinical vignettes',
        },
        truefalse: {
          title: 'True/False Generator',
          subtitle: 'Rapid-fire safety rules & lab threshold checks',
        },
        gpa: {
          title: 'GPA Calculator',
          subtitle: 'Track MUST semester & cumulative nursing GPA',
        },
        planner: {
          title: 'Study Planner',
          subtitle: 'Organize ward prep, lectures & focus sessions',
        },
        progress: {
          title: 'Progress Tracking',
          subtitle: 'Competency breakdown & weekly study log',
        },
      },
      scheduleKicker: '02. Upcoming Schedule',
      scheduleTitle: 'Priority nursing tasks',
      openPlanner: 'Open Study Planner',
      allTasksDone: 'All scheduled study tasks completed',
      allTasksDoneSub: 'Add upcoming OSCE drills, ward prep, or pharmacology reviews.',
      scheduleTaskBtn: 'Schedule Study Task',
      activityKicker: '03. Recent Activity',
      activityTitle: 'Clinical threads & quizzes',
      openAiChat: 'Open AI Chat',
      noRecentActivity: 'No recent sessions yet',
      noRecentActivitySub: 'Start a clinical chat or generate an MCQ quiz to track your study history.',
      generateFirstQuiz: 'Generate First Quiz',
      clinicalChatLabel: 'Clinical Chat',
      mcqQuizLabel: 'MCQ Quiz',
      tfDrillLabel: 'True/False Drill',
      creditsAbbr: 'cr',
    },
    standing: {
      noCredits: 'No Credits Entered',
      deansHonors: "Dean's Honors",
      goodStanding: 'Good Standing',
      satisfactory: 'Satisfactory',
      academicWarning: 'Academic Warning',
    },
    chat: {
      newClinicalStudy: 'New Clinical Study',
      newChat: 'New Chat',
      goodMorning: 'Good morning',
      goodAfternoon: 'Good afternoon',
      goodEvening: 'Good evening',
      studyPartnerBadge: 'Study Partner 💙',
      welcomeMessage: `👋 Welcome to PulseMind AI 💙

I'm your smart AI study partner for nursing & clinical prep 🩺📚

I can help you with:
✅ English & Arabic explanations
✅ MCQs
✅ True/False drills
✅ Flashcards
✅ Study Plans
✅ Exam Preparation

Let's start studying 🚀😄`,
      errorTitle: 'Unable to generate response',
      serviceBusyError: '⚠️ AI service is busy. Please try again in a moment.',
      stoppedByUser: 'Generation stopped. Click Retry to ask again.',
      offlineError: '🔴 You appear to be offline or the server is unreachable. Check your connection and retry.',
      connectionStatus: {
        online: '🟢 AI Online',
        busy: '🟡 AI Busy',
        offline: '🔴 AI Offline',
      },
      thinkingPlaceholder: 'PulseMind AI is typing...',
      typingStatus: 'Generating...',
      regenerate: 'Regenerate',
      retry: 'Retry',
      stopGenerating: 'Stop generating',
      sendMessage: 'Send message',
      composerPlaceholder: "Ask in Arabic or English — or type 'Exam Tomorrow' for rapid revision...",
      examTomorrowChip: 'Exam Tomorrow',
      disclaimer:
        'PulseMind AI supports MUST University nursing study. Always verify medication orders with your clinical preceptor.',
      formats: {
        adpie: 'ADPIE Process',
        nanda: 'NANDA-I Plan',
        dosage: 'Dosage Math',
        exam: 'OSCE & Exam',
      },
      suggestedPrompts: [
        {
          title: 'Exam Tomorrow Sprint ⚡',
          category: 'Exam Tomorrow Mode',
          prompt: 'Exam Tomorrow',
        },
        {
          title: 'Bilingual Study · Heart Failure 🩺',
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
      ],
    },
    exam: {
      title: 'Exam Mode',
      subtitleTomorrow: 'Exam Tomorrow Sprint · Summaries, Keywords, MCQs, T/F & Rapid Cards',
      subtitleStandard: 'High-yield clinical exam preparation',
      tomorrowOn: 'Exam Tomorrow: On',
      activateTomorrow: 'Activate Exam Tomorrow',
      tabs: {
        sprint: 'Exam Tomorrow Sprint',
        summaries: 'Summaries & Notes',
        keywords: 'Important Keywords',
        mcq: 'MCQ Practice',
        truefalse: 'True/False Practice',
        cards: 'Rapid Cards',
        analytics: 'Analytics & Plan',
      },
      sprintActiveKicker: 'Exam Tomorrow Sprint Active',
      sprintStats: 'Quick Summary · {kw} Keywords · {mcq} Expected MCQs · {tf} True/False · {rc} Revision Cards',
      jumpSummary: 'Summary',
      jumpKeywords: 'Keywords',
      jumpMcqs: 'MCQs',
      jumpTf: 'True/False',
      jumpCards: 'Revision Cards',
      commandCenterKicker: 'Exam Command Center · MUST Faculty of Nursing',
      commandTitleTomorrow: 'Exam Tomorrow Mode: High-Yield Rapid Sprint',
      commandTitleStandard: 'Structured Exam Preparation & Clinical Drills',
      commandDescTomorrow:
        'Focused last-24-hour kit: quick summaries, critical keywords, expected MCQs, True/False checks, and rapid revision cards.',
      commandDescStandard:
        'Track live exam countdowns, review high-yield summaries and smart notes, and practice exam-grade questions.',
      modeTomorrow: 'Exam Tomorrow Mode',
      modeStandard: 'Standard Prep',
      addExam: 'Add Exam',
      closeForm: 'Close Form',
      scheduleFormTitle: 'Schedule an upcoming exam for live countdown',
      examTitleLabel: 'Exam Title',
      examTitlePlaceholder: 'e.g. Pediatric Nursing Midterm',
      courseCodeLabel: 'Course Code',
      subjectDomainLabel: 'Subject Domain',
      examDateTimeLabel: 'Exam Date & Time',
      formatLabel: 'Format',
      targetScoreLabel: 'Target Score (%)',
      syllabusLabel: 'Syllabus Topics Included',
      syllabusPlaceholder: 'e.g. Pediatric dehydration, IV fluid maintenance, bronchiolitis, epiglottitis vs croup',
      saveCountdownBtn: 'Save Exam Countdown',
      examCountdownLabel: 'Exam Countdown',
      windowReached: 'Exam window reached',
      tomorrowWindowLeft: 'Tomorrow window · {hours}h left',
      daysRemaining: '{days} days remaining',
      targetLabel: 'Target',
      daysUnit: 'Days',
      hoursUnit: 'Hours',
      minsUnit: 'Mins',
      secsUnit: 'Secs',
      topicsPrefix: 'Topics:',
      cramThisExam: 'Cram This Exam',
      emptyExams: 'Add an upcoming exam to activate your live countdown timer.',
      upcomingExamsLabel: 'Upcoming MUST Nursing Exams',
      nowLabel: 'Now',
      dayShort: 'd',
      hourShort: 'h',
      genPackTitleTomorrow: 'Generate Exam Tomorrow Pack (All-in-One)',
      genPackTitleStandard: 'Generate Custom Exam Revision Pack',
      genPackMeta: 'Summaries · Keywords · MCQs · T/F · Cards',
      genPackPlaceholder:
        'Enter your exam syllabus, drug classes, disease processes, or paste lecture objectives...',
      genPackHelper: 'Creates quick summary, 8 keywords, 5 MCQs, 5 True/False & 6 cards',
      buildingPack: 'Building Exam Pack...',
      generateTomorrowKit: 'Generate Exam Tomorrow Kit',
      buildStudyPack: 'Build Exam Study Pack',
      presets: [
        'Cardiovascular Pharmacology: Diuretics, Digoxin & Anticoagulants',
        'Acute Decompensated Heart Failure & Pulmonary Edema',
        'Diabetic Ketoacidosis (DKA) & Insulin Safety',
        'Postpartum Hemorrhage & Magnesium Sulfate Toxicity',
      ],
      examTypes: {
        Midterm: 'Midterm',
        Final: 'Final',
        OSCE: 'OSCE',
        'Clinical Quiz': 'Clinical Quiz',
      },
      summaryKicker: 'High-Yield Summary',
      summaryCounts: '{actions} priorities · {labs} key labs',
      priorityActionsTitle: 'Priority Nursing Actions (ABCs & Safety)',
      criticalAlertsTitle: 'Exam Traps & Critical Safety Alerts',
      labThresholdsTitle: 'Critical Lab Values & Bedside Action Cutoffs',
      labColParam: 'Parameter',
      labColRange: 'Target / Normal Range',
      labColAction: 'Priority Nursing Action',
      smartNotesKicker: 'Smart Revision Notes',
      smartNotesTitle: 'Structured memory anchors ({done}/{total} reviewed)',
      addRevisionNote: 'Add Revision Note',
      noteHeadingLabel: 'Topic Heading',
      noteHeadingPlaceholder: 'e.g. Magnesium Sulfate Toxicity Protocol',
      noteMnemonicLabel: 'Mnemonic or Memory Anchor',
      noteMnemonicPlaceholder: 'e.g. BURP: BP drop, Urine <30 mL/h, Resp <12, Patellar absent',
      notePointsLabel: 'Key Points (one per line)',
      notePointsPlaceholder:
        'Therapeutic range: 4–7 mEq/L\nCheck deep tendon reflexes before each dose\nKeep Calcium Gluconate at bedside',
      saveSmartNote: 'Save Smart Note',
      reviewed: 'Reviewed',
      markReviewed: 'Mark Reviewed',
      memoryAnchor: 'Memory Anchor:',
      keywordsKicker: 'Important Keywords & Clinical Cutoffs',
      keywordsTitle: 'Must-know exam terms ({done}/{total} mastered)',
      keywordsSearchPlaceholder: 'Filter keywords or labs...',
      keywordsEmpty: 'No keywords match your current filter.',
      keywordMastered: 'Mastered',
      keywordGotIt: 'Got It',
      examTipLabel: 'Exam Tip:',
      keywordCategories: {
        All: 'All',
        Pharmacology: 'Pharmacology',
        'Lab Thresholds': 'Lab Thresholds',
        'Priority Signs': 'Priority Signs',
        Procedures: 'Procedures',
      },
      mcqPracticeKicker: 'MCQ Practice Mode',
      mcqExpectedTitle: 'Expected Exam Questions ({count} items)',
      answeredCountOf: '{answered} of {total} answered',
      finalScorePrefix: 'Final Score',
      instantRationale: 'Instant Rationale',
      examSimulation: 'Exam Simulation',
      retakeMcqs: 'Retake MCQs',
      submitRecordScore: 'Submit & Record Score',
      questionOf: 'Question {current} of {total}',
      correct: 'Correct',
      incorrect: 'Incorrect',
      clinicalRationale: 'Clinical Rationale',
      distractorNoteLabel: 'Distractor Note:',
      tfPracticeKicker: 'True/False Practice Mode',
      tfRapidTitle: 'Rapid Clinical Verification ({count} statements)',
      answeredCorrect: '{answered}/{total} answered · {correct} correct',
      savedToAnalytics: 'Saved to Analytics',
      saveDrillScore: 'Save Drill Score',
      statementOf: 'Statement {current} of {total}',
      trueLabel: 'True',
      falseLabel: 'False',
      actuallyLabel: 'Actually',
      keyRuleLabel: 'Key Rule:',
      rapidCardsKicker: 'Rapid Revision Cards',
      rapidCardsTitle: 'Last-minute active recall ({done}/{total} confident)',
      shuffleCards: 'Shuffle Cards',
      rapidAnswerLabel: 'Rapid Answer & Bedside Pearl',
      examPromptLabel: 'Exam Prompt',
      cardNumberOf: 'Card {current} / {total}',
      confidentState: 'Confident',
      reviewingState: 'Reviewing',
      clinicalPearlLabel: 'Clinical Pearl',
      clickToFlipAnswer: 'Click card to flip to answer',
      clickToFlipPrompt: 'Click card to flip to prompt',
      confidentUnmark: 'Confident (Unmark)',
      markConfident: 'Mark as Confident',
      analyticsKicker: 'Learning Progress Analytics',
      analyticsTitle: 'Exam readiness & subject performance',
      totalLoggedHrs: '{hrs} hrs total logged',
      activePackReadiness: 'Active Pack Readiness',
      notesKeywordsCards: '{done}/{total} notes, keywords & cards',
      quizAccuracyCombined: 'Quiz Accuracy (MCQ + T/F)',
      itemsCorrect: '{correct}/{total} items correct',
      completeDrillToScore: 'Complete a drill to score',
      flashcardLibraryMastery: 'Flashcard Library Mastery',
      deckCardsMastered: '{done}/{total} deck cards mastered',
      assessmentsCompleted: 'Assessments Completed',
      upcomingExamsTracked: '{count} upcoming exams tracked',
      sevenDayMinutes: '7-Day Study Minutes',
      domainAccuracy: 'Domain Accuracy & Coverage',
      domainAccuracyEmpty: 'Score an MCQ or True/False drill to populate subject accuracy analytics.',
      pendingPractice: 'Pending practice',
      personalizedRecsKicker: 'Personalized Study Recommendations',
      personalizedRecsTitle: 'Next best actions for your exams',
      personalizingPlan: 'Personalizing Plan...',
      personalizeWithAi: 'Personalize with AI',
      priorityBadge: 'Priority',
      priorities: {
        Urgent: 'Urgent',
        High: 'High',
        Maintain: 'Maintain',
      },
      recActions: {
        exam_tomorrow: 'Open Exam Tomorrow Sprint',
        mcq: 'Practice MCQs',
        truefalse: 'Practice True/False',
        flashcards: 'Open Revision Cards',
        summary: 'Review High-Yield Summary',
      },
      heuristicFocusWithExam:
        'Prioritize {code} ({subject}) while reinforcing unmastered clinical rules and active recall.',
      heuristicFocusDefault:
        'Build baseline quiz scores across your active rotation subjects and review high-yield safety thresholds.',
    },
    flashcards: {
      title: 'Flashcards Generator',
      subtitle: 'AI-generated active recall for nursing exams',
      genKicker: '01. Generate Deck',
      genTitle: 'Create nursing flashcards',
      topicLabel: 'Nursing Topic or Lecture Notes',
      topicPlaceholder: 'Enter a pharmacology class, disease process, or paste your lecture summary...',
      studyFocusLabel: 'Study Focus',
      cardCountLabel: 'Number of Cards',
      cardsUnit: 'cards',
      generatingBtn: 'Generating Flashcards...',
      generateBtn: 'Generate Flashcards',
      savedDecksKicker: '02. Saved Decks',
      savedDecksTitle: 'Your flashcard library ({count})',
      noDecksSaved: 'No decks saved yet. Generate your first deck above to begin active recall.',
      masteredSuffix: 'mastered',
      noDeckSelected: 'No flashcard deck selected',
      noDeckSelectedSub:
        'Enter any nursing pharmacology, care plan, or pathophysiology topic on the left to generate an interactive study deck.',
      cardsMasteredOf: '{done} of {total} cards mastered',
      allFilter: 'All ({count})',
      needsReviewFilter: 'Needs Review ({count})',
      shuffle: 'Shuffle',
      allMasteredTitle: 'Every card in this deck is mastered',
      allMasteredSub: 'Switch back to All Cards to review the full deck anytime.',
      reviewAllCards: 'Review All Cards',
      answerPearlLabel: 'Clinical Answer & Pearl',
      promptLabel: 'Clinical Prompt',
      cardOf: 'Card {current} / {total}',
      masteredState: 'Mastered',
      learningState: 'Learning',
      bedsidePearlLabel: 'Bedside Clinical Pearl',
      flipToPrompt: 'Click card to flip to prompt',
      flipToAnswer: 'Click card to flip to answer',
      masteredUnmark: 'Mastered (Click to Unmark)',
      markMastered: 'Mark as Mastered',
      presets: [
        'Insulin Types, Onset & Peak Monitoring',
        'ABG Interpretation & Respiratory vs Metabolic Acidosis',
        'Pediatric Vital Signs & Dehydration Assessment',
        'Anticoagulants: Heparin vs Warfarin vs DOACs',
      ],
      focusOptions: [
        'Clinical Pharmacology',
        'Medical-Surgical Nursing',
        'NCLEX & OSCE High-Yield',
        'Foundations & Lab Values',
      ],
    },
    mcq: {
      title: 'MCQ Generator',
      subtitle: 'NCLEX & MUST OSCE clinical vignette practice',
      builderKicker: '01. Quiz Builder',
      builderTitle: 'Generate clinical MCQs',
      topicLabel: 'Topic or Case Focus',
      topicPlaceholder: 'Enter a nursing topic, drug class, or clinical scenario...',
      questionsLabel: 'Questions',
      questionsUnit: 'questions',
      levelLabel: 'Level',
      feedbackModeLabel: 'Feedback Mode',
      instant: 'Instant',
      examEnd: 'Exam End',
      generatingBtn: 'Generating MCQs...',
      generateBtn: 'Generate MCQ Quiz',
      emptyTitle: 'Ready for clinical MCQ practice',
      emptySub:
        'Enter any nursing topic or select a quick clinical preset to generate 4-option questions with complete rationales and distractor analysis.',
      answeredOf: '{answered} of {total} answered',
      scoreLabel: 'Score',
      retakeQuiz: 'Retake Quiz',
      submitSaveScore: 'Submit & Save Score',
      questionOf: 'Question {current} of {total}',
      correct: 'Correct',
      incorrect: 'Incorrect',
      clinicalRationale: 'Clinical Rationale',
      distractorPrefix: 'Why other options are unsafe/lower priority:',
      presets: [
        'Acute Decompensated Heart Failure & Loop Diuretics',
        'Diabetic Ketoacidosis (DKA) Priority Nursing Care',
        'Maternal Postpartum Hemorrhage & Oxytocin Protocol',
        'Acute Kidney Injury & Electrolyte Imbalances',
      ],
      difficulties: ['Core Concepts', 'Clinical Application', 'Priority & Triage (NCLEX/OSCE)'],
    },
    truefalse: {
      title: 'True/False Generator',
      subtitle: 'Rapid misconception checks & bedside safety verification',
      builderKicker: '01. Rapid Recall Drill',
      builderTitle: 'Generate True/False statements',
      topicLabel: 'Nursing Topic or Protocol',
      topicPlaceholder: 'Enter a nursing rule set, medication class, or paste notes...',
      statementsLabel: 'Statements',
      statementsUnit: 'statements',
      focusLabel: 'Focus',
      generatingBtn: 'Generating Statements...',
      generateBtn: 'Generate True/False',
      emptyTitle: 'Ready for rapid clinical verification',
      emptySub:
        'Test yourself against common nursing misconceptions, antidote pairs, isolation rules, and critical lab thresholds.',
      answeredCorrect: '{answered}/{total} answered · {correct} correct',
      savedToProgress: 'Saved to Progress',
      saveDrillScore: 'Save Drill Score',
      statementOf: 'Statement {current} of {total}',
      correct: 'Correct',
      incorrect: 'Incorrect',
      actually: 'Actually',
      trueLabel: 'True',
      falseLabel: 'False',
      keyRulePrefix: 'Key rule:',
      presets: [
        'High-Alert Medication Safety & Antidotes',
        'Normal Adult Lab Values & Critical Thresholds',
        'Infection Control & Isolation Precautions',
        'Chest Tube & Ventilator Nursing Management',
      ],
      focusLevels: [
        'Clinical Safety & Rapid Recall',
        'Pharmacology Contraindications',
        'OSCE & Bedside Protocols',
      ],
    },
    planner: {
      title: 'Study Planner',
      subtitle: 'Clinical rotations, lectures & OSCE schedule',
      addKicker: '01. Schedule Study Block',
      addTitle: 'Add nursing task',
      taskTitleLabel: 'Task Title',
      taskTitlePlaceholder: 'e.g. Review Anticoagulants & INR targets',
      subjectLabel: 'Subject',
      studyTypeLabel: 'Study Type',
      targetDateLabel: 'Target Date',
      minutesLabel: 'Minutes',
      priorityLabel: 'Priority',
      notesLabel: 'Clinical Notes (optional)',
      notesPlaceholder: 'Key chapters, ward objectives, or lab values',
      addToPlanBtn: 'Add to Study Plan',
      timerKicker: '02. Focus Timer',
      timerTitle: 'Timed study session',
      sessionSubjectLabel: 'Session Subject',
      pause: 'Pause',
      startSession: 'Start Session',
      resetTimer: 'Reset timer',
      logTime: 'Log Time',
      loggedNotice: 'Logged {mins} min for {subject} into Progress Tracking.',
      scheduleTitle: 'Study Schedule',
      scheduleSummary: '{done} of {total} tasks done · {mins} min remaining',
      allSubjects: 'All Subjects',
      noMatchingTasks: 'No matching study tasks',
      noMatchingTasksSub: 'Add a lecture review, clinical care plan prep, or OSCE station drill on the left.',
      priorityWord: 'priority',
      categories: {
        'Lecture Review': 'Lecture Review',
        'Clinical Prep': 'Clinical Prep',
        'Exam Practice': 'Exam Practice',
        'Lab / OSCE': 'Lab / OSCE',
        Assignment: 'Assignment',
      },
      priorities: {
        High: 'High',
        Medium: 'Medium',
        Low: 'Low',
      },
      subjects: [
        'Pharmacology',
        'Medical-Surgical',
        'Maternal & Newborn',
        'Pediatrics',
        'Critical Care',
        'Dosage Math',
        'OSCE & Skills',
      ],
    },
    gpa: {
      title: 'GPA Calculator',
      subtitle: 'MUST University 4.0 Credit-Hour Scale',
      hideScale: 'Hide Grade Scale',
      viewScale: 'View Grade Scale',
      semesterGpa: 'Semester GPA',
      ptsCredits: '{pts} pts / {credits} credits',
      projectedCgpa: 'Projected Cumulative GPA',
      totalCredits: '{credits} total credit hours',
      academicStanding: 'Academic Standing',
      facultyBenchmark: 'MUST BSN Faculty benchmark',
      targetForecast: 'Target CGPA Forecast',
      achieved: 'Achieved',
      reqSuffix: 'req.',
      next15Cr: 'Over next 15 cr for {target} CGPA',
      scaleTitle: 'MUST University Credit-Hour Grade Points',
      scaleSubtitle: 'Standard 4.0 scale for Faculty of Nursing courses',
      priorKicker: '01. Prior Academic Record',
      priorTitle: 'Cumulative baseline & goal',
      semesterLabel: 'Semester Label',
      priorCreditsLabel: 'Prior Completed Credits',
      priorCgpaLabel: 'Prior Cumulative GPA',
      targetCgpaLabel: 'Target Cumulative GPA',
      coursesKicker: '02. Current Semester Courses',
      currentSemesterFallback: 'Current Semester',
      resetSample: 'Reset Sample',
      addCourse: 'Add Course',
      noCoursesTitle: 'No courses in this semester',
      noCoursesSub: 'Add your nursing theory and clinical rotation credit hours to compute your GPA.',
      addFirstCourse: 'Add First Course',
      colCode: 'Code',
      colTitle: 'Course Title',
      colCredits: 'Credits',
      colGrade: 'Expected Grade',
      colQualityPts: 'Quality Pts',
      colAction: 'Action',
      courseTitlePlaceholder: 'e.g. Pediatric Nursing',
      crUnit: 'cr',
    },
    progress: {
      title: 'Progress Tracking',
      subtitle: 'Assessment scores, card mastery & weekly study minutes',
      quizAccuracy: 'Quiz Accuracy',
      completedItems: '{count} completed · {correct}/{total} items',
      flashcardMastery: 'Flashcard Mastery',
      cardsMasteredOf: '{done} of {total} cards mastered',
      taskCompletion: 'Task Completion',
      studyTasksDone: '{done} of {total} study tasks done',
      studyTimeLogged: 'Study Time Logged',
      projectedCgpa: 'Projected CGPA {gpa}',
      weeklyLogKicker: '01. Weekly Study Log',
      weeklyLogTitle: 'Minutes logged over the last 7 days',
      readinessKicker: '02. Readiness Checklist',
      readinessTitle: 'Clinical study milestones',
      milestones: {
        chat: { label: 'Started a clinical reasoning thread in AI Chat', cta: 'Open Chat' },
        gpa: { label: 'Configured MUST semester coursework in GPA Calculator', cta: 'Review GPA' },
        planner: { label: 'Completed at least 3 nursing study tasks in Study Planner', cta: 'Open Planner' },
        cards: { label: 'Mastered 5 or more active-recall flashcards', cta: 'Study Cards' },
        quiz: { label: 'Achieved 80%+ accuracy on a generated MCQ or True/False drill', cta: 'Practice Quiz' },
      },
      coverageKicker: '03. Subject Coverage',
      coverageTitle: 'Performance by nursing domain',
      coverageEmpty:
        'Complete a flashcard deck, MCQ quiz, True/False drill, or study timer session to populate subject coverage.',
      quizTag: '{pct}% quiz',
      cardsTag: '{pct}% cards',
      minLoggedTag: '{mins}m logged',
      cardsLabel: 'Cards',
      quizItemsLabel: 'Quiz items',
      historyKicker: '04. Assessment History',
      historyTitle: 'Completed MCQ & True/False sessions',
      clearHistory: 'Clear History',
      noAttemptsTitle: 'No quiz attempts recorded yet',
      noAttemptsSub: 'Finish an MCQ quiz or True/False drill and click Save to track your scores over time.',
      openMcq: 'Open MCQ Generator',
      tryTf: 'Try True/False Drill',
      colTitle: 'Assessment Title',
      colMode: 'Mode',
      colSubject: 'Subject',
      colDate: 'Date',
      colScore: 'Score',
      modeMcq: 'MCQ Quiz',
      modeTf: 'True/False',
    },
    profile: {
      title: 'User Profile',
      studentIdPrefix: 'ID',
      studyThreads: 'Study Threads',
      clinicalPrompts: 'Clinical Prompts',
      fullName: 'Full Name',
      studentId: 'MUST Student ID',
      email: 'University Email',
      academicYear: 'Academic Year',
      clinicalRotation: 'Current Clinical Rotation',
      campus: 'Campus & Teaching Hospital',
      bio: 'Clinical Study Bio',
      focusAreas: 'Active Study Focus Areas',
      focusPlaceholder: 'Add subject (e.g. Pediatric Oncology)',
      addBtn: 'Add',
      resetDefault: 'Reset to Default',
      profileSaved: 'Profile saved',
      saveProfile: 'Save Profile',
    },
    settings: {
      title: 'Settings',
      appearanceKicker: '01. Appearance',
      appearanceTitle: 'Theme, language & reading comfort',
      languageTitle: 'Interface Language',
      languageDesc: 'Switch instantaneously between English (LTR) and Arabic (RTL).',
      colorModeTitle: 'Color Mode',
      colorModeDesc: 'Switch between crisp daylight mode and low-glare dark mode for night study.',
      themes: {
        light: 'Light',
        dark: 'Dark',
        system: 'System',
      },
      densityTitle: 'Response Density',
      densityDesc: 'Choose balanced clinical prose or compact rapid-review notes.',
      densityOptions: {
        comfortable: 'Comfortable',
        compact: 'Compact',
      },
      textSizeTitle: 'Chat Text Size',
      textSizeDesc: 'Adjust font scale for long pharmacology and pathophysiology sessions.',
      fontSizeOptions: {
        standard: 'Standard',
        large: 'Large',
      },
      clinicalKicker: '02. Clinical Preferences',
      clinicalTitle: 'AI reasoning structure',
      defaultFormatTitle: 'Default Study Format',
      formats: {
        adpie: {
          label: 'Nursing Process (ADPIE)',
          description:
            'Organizes clinical topics into Assessment, Diagnosis, Planning, Intervention, and Evaluation.',
        },
        nanda: {
          label: 'NANDA-I Care Plans',
          description:
            'Uses Problem / Related To / As Evidenced By phrasing paired with NOC outcomes and NIC actions.',
        },
        dosage: {
          label: 'Step-by-Step Dosage Math',
          description:
            'Shows full dimensional analysis, unit conversions, rounding checks, and therapeutic safety ranges.',
        },
        exam: {
          label: 'OSCE & Exam Prep',
          description:
            'Prioritizes ABCs, safety-first bedside actions, key lab thresholds, and high-yield rationales.',
        },
      },
      safetyTitle: 'High-Alert Safety Reminders',
      safetyDesc:
        'Include critical monitoring checks when reviewing IV titration, anticoagulants, or electrolytes.',
      enterSendTitle: 'Enter Key Sends Message',
      enterSendDesc: 'Use Shift + Enter for a new line when disabled or enabled.',
      dataKicker: '03. Study Data',
      dataTitle: 'Export & conversation storage',
      exportTitle: 'Export Study History',
      exportDesc: 'Download {count} saved conversation(s) as JSON.',
      downloaded: 'Downloaded',
      downloadJson: 'Download JSON',
      clearTitle: 'Clear All Conversations',
      clearDesc: 'Permanently remove saved study threads from this browser.',
      confirmDelete: 'Confirm Delete',
      clearHistory: 'Clear History',
    },
  },
  ar: {
    common: {
      brandName: 'PulseMind AI',
      openNav: 'فتح قائمة التنقل',
      closeNav: 'إغلاق قائمة التنقل',
      expandSidebar: 'توسيع الشريط الجانبي',
      collapseSidebar: 'طي الشريط الجانبي',
      darkMode: 'الوضع الداكن',
      lightMode: 'الوضع الفاتح',
      on: 'مفعّل',
      off: 'متوقف',
      cancel: 'إلغاء',
      reset: 'إعادة ضبط',
      add: 'إضافة',
      delete: 'حذف',
      copy: 'نسخ',
      copied: 'تم النسخ',
      previous: 'السابق',
      next: 'التالي',
      min: 'د',
      hrs: 'ساعة',
      today: 'اليوم',
      overdue: 'متأخر',
      completed: 'مكتمل',
      all: 'الكل',
      pending: 'قيد التنفيذ',
      prioritySuffix: 'الأولوية',
      languageLabel: 'اللغة',
      switchToArabic: 'التبديل إلى العربية',
      switchToEnglish: 'التبديل إلى الإنجليزية',
    },
    nav: {
      overview: 'نظرة عامة',
      capabilities: 'القدرات',
      clinicalTracks: 'المسارات السريرية',
      faq: 'الأسئلة الشائعة',
      openDashboard: 'افتح لوحة التحكم',
      dashboard: 'لوحة التمريض',
      examMode: 'وضع الامتحان',
      aiChat: 'المحادثة السريرية الذكية',
      flashcards: 'البطاقات التعليمية',
      mcqGenerator: 'مولّد أسئلة الاختيار',
      trueFalse: 'صح أم خطأ',
      studyPlanner: 'مخطط المذاكرة',
      gpaCalculator: 'حاسبة المعدل GPA',
      progressTracking: 'تتبع التقدم',
      userProfile: 'الملف الشخصي',
      settings: 'الإعدادات',
      landingPage: 'الصفحة الرئيسية',
      newClinicalChat: 'محادثة سريرية جديدة',
      studySuite: 'أدوات المذاكرة',
      accountPrefs: 'الحساب والتفضيلات',
      recentStudies: 'الدراسات الحديثة',
      noRecentChats: 'لا توجد محادثات بعد. ابدأ موضوعاً سريرياً لحفظه هنا.',
      deleteChat: 'حذف المحادثة',
    },
    landing: {
      universityTag: 'جامعة مصر للعلوم والتكنولوجيا (MUST) · كلية التمريض',
      heroTitle: 'تفكير تمريضي سريري، مصمم خصيصاً لطلاب جامعة MUST.',
      heroSubtitle:
        'مساحة مذاكرة هادئة ومنظمة للمحادثة السريرية بالذكاء الاصطناعي، والبطاقات التعليمية، وتدريبات الاختيار من متعدد وصح/خطأ، وحساب المعدل، ومتابعة التدريب العملي.',
      heroCtaDashboard: 'افتح لوحة التمريض',
      heroCtaExam: 'ادخل وضع الامتحان',
      heroCtaChat: 'ابدأ المحادثة الذكية',
      heroFeature1: 'محادثة ADPIE و NANDA-I',
      heroFeature2: 'بطاقات تعليمية، MCQs وصح/خطأ',
      heroFeature3: 'حاسبة GPA ومخطط المذاكرة',
      heroFallbackTitle: 'بيئة التمريض السريرية لجامعة MUST',
      heroImgAlt: 'طالب تمريض يراجع ملاحظات الأدوية والتمريض السريري في مكتبة الجامعة',
      capSectionKicker: '01. القدرات الأساسية',
      capSectionTitle: 'مصمم حول سير العمل السريري، وليس أسئلة عامة عشوائية',
      tryExample: 'جرّب المثال في المحادثة',
      capabilities: [
        {
          index: '01',
          title: 'خطط رعاية NANDA-I و ADPIE',
          description:
            'نظّم تقييمات المرضى إلى تشخيصات تمريضية مرتبة حسب الأولوية، وأهداف NOC قابلة للقياس، وتدخلات NIC مبنية على الدليل.',
          prompt:
            'Build a complete ADPIE and NANDA-I care plan for a post-operative patient at risk for impaired gas exchange.',
        },
        {
          index: '02',
          title: 'حسابات الجرعات والمحاليل الوريدية',
          description:
            'تحقق من المحاليل المعتمدة على الوزن، ومعدلات مضخة التسريب، وتحويلات الأطفال (mg/kg) بتحليل الأبعاد خطوة بخطوة.',
          prompt:
            'Walk me through a pediatric amoxicillin weight-based dosage calculation for an 18 kg child ordered 45 mg/kg/day divided q12h.',
        },
        {
          index: '03',
          title: 'علم الأدوية السريري',
          description:
            'راجع آليات عمل الأدوية، والتحذيرات الحرجة، وحدود التحاليل المخبرية، وفحوصات الإعطاء الآمن قبل الجولات السريرية.',
          prompt:
            'Compare nursing monitoring, antidote, and lab checks for Heparin vs. Warfarin therapy.',
        },
        {
          index: '04',
          title: 'الاستعداد لاختبارات OSCE والامتحانات',
          description:
            'تدرّب على فرز الحالات السريرية باستخدام أولويات ABCs والسلامة أولاً بما يتناسب مع مناهج كلية التمريض بجامعة MUST.',
          prompt:
            'Give me a 3-question Med-Surg OSCE practice scenario on diabetic ketoacidosis with rationales after I answer.',
        },
      ],
      tracksSectionKicker: '02. منهج تمريض MUST',
      tracksSectionTitle: 'متوافق مع كل مرحلة وتدريب سريري في البكالوريوس',
      tracksSectionDesc:
        'اضبط سنتك الدراسية وتدريبك السريري في ملفك الشخصي لكي يكيّف PulseMind AI العمق العلمي وتفاصيل التحاليل وأطر الأولويات تلقائياً.',
      labFallbackTitle: 'المحاكاة السريرية والاستعداد لـ OSCE',
      labImgAlt: 'معمل المحاكاة السريرية الحديث لكلية التمريض بالجامعة',
      practiceInChat: 'تدرّب في المحادثة',
      tracks: [
        {
          year: 'السنة الأولى · الأساسيات',
          focus: 'العلامات الحيوية، مكافحة العدوى والتعقيم، التشريح ووظائف الأعضاء، والتواصل العلاجي',
          prompt: 'Review the normal adult vital sign ranges and early nursing signs of respiratory distress.',
        },
        {
          year: 'السنة الثانية · الباثوفسيولوجي والأدوية',
          focus: 'السوائل والأملاح، أدوية الجهاز العصبي اللاإرادي، المضادات الحيوية، وقراءة التحاليل',
          prompt: 'Explain the ECG changes and priority nursing interventions for severe hyperkalemia (K+ 6.4 mEq/L).',
        },
        {
          year: 'السنة الثالثة · الباطنة والجراحة والأمومة',
          focus: 'خطط الرعاية القلبية والتنفسية، طوارئ الولادة، جرعات الأطفال، ورعاية ما قبل وبعد العمليات',
          prompt: 'Outline the priority bedside nursing interventions for postpartum hemorrhage.',
        },
        {
          year: 'السنة الرابعة · العناية المركزة والامتياز',
          focus: 'مراقبة ديناميكا الدم في ICU، بروتوكولات الإنتان، غازات الدم الشرياني ABG، وتنبيهات أجهزة التنفس',
          prompt: 'Walk through systematic ABG interpretation for uncompensated vs. compensated respiratory acidosis.',
        },
      ],
      faqSectionKicker: '03. الأسئلة الشائعة',
      faqSectionTitle: 'معايير المذاكرة والسلامة السريرية',
      faqSectionDesc: 'مصمم للوضوح التام أثناء التحضير للامتحانات ومراجعة الأدوية والتدريب بالمستشفى.',
      faqs: [
        {
          q: 'كيف تم تخصيص PulseMind AI لطلاب تمريض جامعة MUST؟',
          a: 'يحفظ ملفك الشخصي سنتك الدراسية، وتدريبك السريري الحالي، وتنسيق الإجابة المفضل (ADPIE أو NANDA-I أو حساب الجرعات أو تحضير الامتحانات)، فيكيّف PulseMind AI كل شرح ليناسب مرحلتك الدراسية.',
        },
        {
          q: 'هل يدعم خطط رعاية NANDA-I وحسابات الجرعات؟',
          a: 'نعم. يمكنك تغيير تنسيق الاستجابة السريرية من الإعدادات في أي وقت للحصول على تشخيصات NANDA-I منظمة أو تحليل أبعاد خطوة بخطوة للمحاليل الوريدية وجرعات الوزن.',
        },
        {
          q: 'هل يوجد وضع داكن للمذاكرة الليلية والمناوبات؟',
          a: 'نعم. يمكنك تبديل الوضع الداكن مباشرة من الشريط الجانبي أو صفحة الإعدادات، أو ضبطه ليتبع مظهر النظام تلقائياً.',
        },
        {
          q: 'هل يمكن الاعتماد على PulseMind AI في أوامر المرضى الفعلية بالمستشفى؟',
          a: 'PulseMind AI هو رفيق للمذاكرة الأكاديمية والتفكير السريري. تحقق دائماً من جرعات الأدوية وبروتوكولات المستشفى وأوامر المرضى مع مشرفك السريري وإرشادات مستشفى جامعة MUST.',
        },
      ],
      footerCredit: '· تصميم وتطوير محمد أيمن كامل الصاوي (ID: 200105235)',
      footerLinks: {
        dashboard: 'لوحة التحكم',
        exam: 'وضع الامتحان',
        chat: 'المحادثة الذكية',
        flashcards: 'البطاقات',
        mcq: 'مولّد MCQ',
        gpa: 'حاسبة GPA',
        planner: 'مخطط المذاكرة',
        progress: 'التقدم',
      },
    },
    dashboard: {
      title: 'لوحة التمريض',
      newChatBtn: 'محادثة سريرية جديدة',
      universityLine: 'جامعة MUST',
      welcomeBack: 'أهلاً بعودتك',
      focusPrefix: 'التركيز',
      examTomorrowBtn: 'امتحان بكرة',
      openExamModeBtn: 'افتح وضع الامتحان',
      addStudyTaskBtn: 'أضف مهمة مذاكرة',
      viewProgressBtn: 'عرض التقدم الكامل',
      kpiGpaTitle: 'المعدل التراكمي المتوقع',
      kpiGpaSemester: 'معدل الفصل',
      kpiTasksTitle: 'مهام خطة المذاكرة',
      kpiTasksPending: 'قيد التنفيذ',
      kpiTasksLogged: 'ساعة مسجلة عبر الجلسات',
      kpiCardsTitle: 'إتقان البطاقات',
      kpiCardsDeckSingular: 'مجموعة',
      kpiCardsDeckPlural: 'مجموعات',
      kpiCardsMasteredOf: 'بطاقة متقنة',
      kpiQuizTitle: 'دقة الاختبارات',
      kpiQuizSingular: 'اختبار',
      kpiQuizPlural: 'اختبارات',
      kpiQuizCorrect: 'إجابة صحيحة',
      kpiQuizEmpty: 'جرّب اختبار MCQ أو صح/خطأ',
      suiteKicker: '01. أدوات المذاكرة',
      suiteTitle: 'الأدوات السريرية والأكاديمية',
      tools: {
        exam: {
          title: 'وضع الامتحان والإنقاذ السريع',
          subtitle: 'حزم امتحان بكرة، ملخصات مركزة، كلمات مفتاحية وعدّادات تنازلية',
        },
        flashcards: {
          title: 'مولّد البطاقات التعليمية',
          subtitle: 'حوّل الموضوعات السريرية أو المحاضرات إلى بطاقات استرجاع نشط',
        },
        mcq: {
          title: 'مولّد أسئلة الاختيار MCQ',
          subtitle: 'تدرّب على سيناريوهات NCLEX واختبارات OSCE بجامعة MUST',
        },
        truefalse: {
          title: 'مولّد أسئلة صح أم خطأ',
          subtitle: 'مراجعة سريعة لقواعد السلامة وحدود التحاليل المخبرية',
        },
        gpa: {
          title: 'حاسبة المعدل GPA',
          subtitle: 'تتبع المعدل الفصلي والتراكمي وفق نظام الساعات المعتمدة بجامعة MUST',
        },
        planner: {
          title: 'مخطط المذاكرة',
          subtitle: 'نظّم تحضير الجناح والمحاضرات وجلسات التركيز المؤقتة',
        },
        progress: {
          title: 'تتبع التقدم',
          subtitle: 'تحليل الكفاءة حسب المادة وسجل المذاكرة الأسبوعي',
        },
      },
      scheduleKicker: '02. الجدول القادم',
      scheduleTitle: 'مهام التمريض ذات الأولوية',
      openPlanner: 'افتح مخطط المذاكرة',
      allTasksDone: 'تم إنجاز جميع مهام المذاكرة المجدولة',
      allTasksDoneSub: 'أضف تدريبات OSCE القادمة أو تحضير الجناح أو مراجعة الأدوية.',
      scheduleTaskBtn: 'جدولة مهمة مذاكرة',
      activityKicker: '03. النشاط الأخير',
      activityTitle: 'المحادثات والاختبارات السريرية',
      openAiChat: 'افتح المحادثة الذكية',
      noRecentActivity: 'لا توجد جلسات حديثة بعد',
      noRecentActivitySub: 'ابدأ محادثة سريرية أو أنشئ اختبار MCQ لتتبع سجل مذاكرتك.',
      generateFirstQuiz: 'أنشئ أول اختبار',
      clinicalChatLabel: 'محادثة سريرية',
      mcqQuizLabel: 'اختبار MCQ',
      tfDrillLabel: 'تدريب صح/خطأ',
      creditsAbbr: 'ساعة',
    },
    standing: {
      noCredits: 'لم تُدخل ساعات',
      deansHonors: 'قائمة الشرف للعميد',
      goodStanding: 'وضع أكاديمي جيد',
      satisfactory: 'مقبول',
      academicWarning: 'إنذار أكاديمي',
    },
    chat: {
      newClinicalStudy: 'دراسة سريرية جديدة',
      newChat: 'محادثة جديدة',
      goodMorning: 'صباح الخير',
      goodAfternoon: 'مساء الخير',
      goodEvening: 'مساء الخير',
      studyPartnerBadge: 'رفيق المذاكرة 💙',
      welcomeMessage: `👋 أهلاً بيك في PulseMind AI 💙

أنا مساعدك الذكي للمذاكرة والتمريض 🩺📚

أقدر أساعدك في:
✅ شرح عربي وإنجليزي
✅ MCQs
✅ True/False
✅ Flashcards
✅ Study Plans
✅ Exam Preparation

يلا نبدأ المذاكرة 🚀😄`,
      errorTitle: 'تعذر توليد الاستجابة',
      serviceBusyError: '⚠️ خدمة الذكاء الاصطناعي مشغولة حالياً. يرجى المحاولة مرة أخرى بعد لحظة.',
      stoppedByUser: 'تم إيقاف التوليد. اضغط إعادة المحاولة للإرسال مجدداً.',
      offlineError: '🔴 يبدو أنك غير متصل بالإنترنت أو الخادم غير متاح. تحقق من الاتصال وأعد المحاولة.',
      connectionStatus: {
        online: '🟢 الذكاء الاصطناعي متصل',
        busy: '🟡 الذكاء الاصطناعي مشغول',
        offline: '🔴 الذكاء الاصطناعي غير متصل',
      },
      thinkingPlaceholder: 'PulseMind AI يكتب الآن...',
      typingStatus: 'يكتب الآن...',
      regenerate: 'إعادة التوليد',
      retry: 'إعادة المحاولة',
      stopGenerating: 'إيقاف التوليد',
      sendMessage: 'إرسال الرسالة',
      composerPlaceholder: "اسأل بالعربي أو بالإنجليزي — أو اكتب 'امتحان بكرة' للمراجعة السريعة...",
      examTomorrowChip: 'امتحان بكرة',
      disclaimer:
        'PulseMind AI يدعم مذاكرة التمريض بجامعة MUST. تحقق دائماً من أوامر الأدوية مع مشرفك السريري.',
      formats: {
        adpie: 'منهج ADPIE',
        nanda: 'خطة NANDA-I',
        dosage: 'حساب الجرعات',
        exam: 'OSCE والامتحانات',
      },
      suggestedPrompts: [
        {
          title: 'وضع الإنقاذ: امتحان بكرة ⚡',
          category: 'وضع امتحان بكرة',
          prompt: 'Exam Tomorrow',
        },
        {
          title: 'شرح عربي وإنجليزي · فشل القلب 🩺',
          category: 'رفيق المذاكرة ثنائي اللغة',
          prompt:
            'Help me study Acute Heart Failure & IV Furosemide nursing care in English and Arabic together, with important keywords and rapid memory tips.',
        },
        {
          title: 'أسئلة MCQ وصح/خطأ وبطاقات 📝',
          category: 'تدريبات الاسترجاع النشط',
          prompt:
            'Generate 4 expected MCQs, 4 True/False practice questions, and 3 flashcards on Heparin vs. Warfarin monitoring and antidotes.',
        },
        {
          title: 'ملخص محاضرة وخطة مذاكرة 📚',
          category: 'التحضير للامتحان',
          prompt:
            'Summarize Diabetic Ketoacidosis (DKA) priority nursing care, give important keywords, and build me a 3-day nursing study plan.',
        },
      ],
    },
    exam: {
      title: 'وضع الامتحان',
      subtitleTomorrow: 'سباق امتحان بكرة · ملخصات، كلمات مفتاحية، MCQs، صح/خطأ وبطاقات سريعة',
      subtitleStandard: 'تحضير سريري عالي التركيز للامتحانات',
      tomorrowOn: 'امتحان بكرة: مفعّل',
      activateTomorrow: 'تفعيل امتحان بكرة',
      tabs: {
        sprint: 'سباق امتحان بكرة',
        summaries: 'الملخصات والملاحظات',
        keywords: 'الكلمات المفتاحية',
        mcq: 'تدريب MCQ',
        truefalse: 'تدريب صح/خطأ',
        cards: 'البطاقات السريعة',
        analytics: 'التحليلات والخطة',
      },
      sprintActiveKicker: 'سباق امتحان بكرة مفعّل',
      sprintStats: 'ملخص سريع · {kw} كلمة مفتاحية · {mcq} أسئلة متوقعة · {tf} صح/خطأ · {rc} بطاقات مراجعة',
      jumpSummary: 'الملخص',
      jumpKeywords: 'الكلمات المفتاحية',
      jumpMcqs: 'أسئلة MCQ',
      jumpTf: 'صح أم خطأ',
      jumpCards: 'بطاقات المراجعة',
      commandCenterKicker: 'مركز قيادة الامتحانات · كلية التمريض جامعة MUST',
      commandTitleTomorrow: 'وضع امتحان بكرة: مراجعة مكثفة عالية العائد',
      commandTitleStandard: 'تحضير منظم للامتحانات وتدريبات سريرية',
      commandDescTomorrow:
        'حقيبة آخر 24 ساعة: ملخصات سريعة، كلمات مفتاحية حرجة، أسئلة متوقعة، تحقق صح/خطأ، وبطاقات مراجعة سريعة.',
      commandDescStandard:
        'تابع العد التنازلي للامتحانات، وراجع الملخصات الذكية، وتدرّب على أسئلة بمستوى الامتحان.',
      modeTomorrow: 'وضع امتحان بكرة',
      modeStandard: 'التحضير القياسي',
      addExam: 'إضافة امتحان',
      closeForm: 'إغلاق النموذج',
      scheduleFormTitle: 'جدولة امتحان قادم للعد التنازلي المباشر',
      examTitleLabel: 'عنوان الامتحان',
      examTitlePlaceholder: 'مثال: ميدتيرم تمريض الأطفال',
      courseCodeLabel: 'كود المقرر',
      subjectDomainLabel: 'التخصص / المادة',
      examDateTimeLabel: 'تاريخ ووقت الامتحان',
      formatLabel: 'نوع الامتحان',
      targetScoreLabel: 'الدرجة المستهدفة (%)',
      syllabusLabel: 'الموضوعات المشمولة بالمنهج',
      syllabusPlaceholder: 'مثال: جفاف الأطفال، محاليل الإعاشة، التهاب القصيبات، الفرق بين الخناق والتهاب لسان المزمار',
      saveCountdownBtn: 'حفظ العد التنازلي',
      examCountdownLabel: 'العد التنازلي للامتحان',
      windowReached: 'حان موعد الامتحان',
      tomorrowWindowLeft: 'نافذة الغد · متبقي {hours} ساعة',
      daysRemaining: 'متبقي {days} يوم',
      targetLabel: 'الهدف',
      daysUnit: 'يوم',
      hoursUnit: 'ساعة',
      minsUnit: 'دقيقة',
      secsUnit: 'ثانية',
      topicsPrefix: 'الموضوعات:',
      cramThisExam: 'مراجعة هذا الامتحان الآن',
      emptyExams: 'أضف امتحاناً قادماً لتفعيل مؤقت العد التنازلي المباشر.',
      upcomingExamsLabel: 'امتحانات تمريض MUST القادمة',
      nowLabel: 'الآن',
      dayShort: 'ي',
      hourShort: 'س',
      genPackTitleTomorrow: 'توليد حقيبة امتحان بكرة (الكل في واحد)',
      genPackTitleStandard: 'توليد حزمة مراجعة مخصصة للامتحان',
      genPackMeta: 'ملخصات · كلمات مفتاحية · MCQs · صح/خطأ · بطاقات',
      genPackPlaceholder: 'اكتب منهج الامتحان، مجموعات الأدوية، الأمراض، أو الصق أهداف المحاضرة...',
      genPackHelper: 'ينشئ ملخصاً سريعاً، 8 كلمات مفتاحية، 5 MCQs، 5 صح/خطأ و6 بطاقات',
      buildingPack: 'جارٍ بناء حزمة الامتحان...',
      generateTomorrowKit: 'توليد حقيبة امتحان بكرة',
      buildStudyPack: 'بناء حزمة المذاكرة',
      presets: [
        'أدوية القلب والأوعية: مدرات البول، الديجوكسين ومضادات التجلط',
        'فشل القلب الحاد والوذمة الرئوية',
        'الحماض الكيتوني السكري (DKA) وأمان الإنسولين',
        'نزيف ما بعد الولادة وتسمم كبريتات المغنيسيوم',
      ],
      examTypes: {
        Midterm: 'ميدتيرم',
        Final: 'نهائي',
        OSCE: 'OSCE عملي',
        'Clinical Quiz': 'اختبار سريري',
      },
      summaryKicker: 'ملخص عالي الأهمية',
      summaryCounts: '{actions} أولويات · {labs} تحاليل حرجة',
      priorityActionsTitle: 'إجراءات التمريض ذات الأولوية (ABCs والسلامة)',
      criticalAlertsTitle: 'فخاخ الامتحان وتنبيهات السلامة الحرجة',
      labThresholdsTitle: 'القيم المخبرية الحرجة وإجراءات التدخل الفوري',
      labColParam: 'المؤشر / التحليل',
      labColRange: 'المدى الطبيعي / المستهدف',
      labColAction: 'إجراء التمريض ذو الأولوية',
      smartNotesKicker: 'ملاحظات المراجعة الذكية',
      smartNotesTitle: 'روابط الذاكرة المنظمة ({done}/{total} تمت مراجعتها)',
      addRevisionNote: 'إضافة ملاحظة مراجعة',
      noteHeadingLabel: 'عنوان الموضوع',
      noteHeadingPlaceholder: 'مثال: بروتوكول تسمم كبريتات المغنيسيوم',
      noteMnemonicLabel: 'اختصار أو رابط للذاكرة',
      noteMnemonicPlaceholder: 'مثال: BURP: هبوط الضغط، البول <30، التنفس <12، غياب المنعكس',
      notePointsLabel: 'النقاط الأساسية (نقطة في كل سطر)',
      notePointsPlaceholder:
        'المدى العلاجي: 4–7 mEq/L\nافحص المنعكسات الوترية قبل كل جرعة\nاحتفظ بـ Calcium Gluconate بجانب السرير',
      saveSmartNote: 'حفظ الملاحظة الذكية',
      reviewed: 'تمت المراجعة',
      markReviewed: 'تحديد كمراجع',
      memoryAnchor: 'رابط الذاكرة:',
      keywordsKicker: 'الكلمات المفتاحية والحدود السريرية',
      keywordsTitle: 'مصطلحات الامتحان الأساسية ({done}/{total} تم إتقانها)',
      keywordsSearchPlaceholder: 'ابحث في الكلمات أو التحاليل...',
      keywordsEmpty: 'لا توجد كلمات تطابق البحث الحالي.',
      keywordMastered: 'تم الإتقان',
      keywordGotIt: 'فهمتها',
      examTipLabel: 'نصيحة الامتحان:',
      keywordCategories: {
        All: 'الكل',
        Pharmacology: 'الأدوية',
        'Lab Thresholds': 'حدود التحاليل',
        'Priority Signs': 'علامات الأولوية',
        Procedures: 'الإجراءات',
      },
      mcqPracticeKicker: 'وضع تدريب MCQ',
      mcqExpectedTitle: 'أسئلة الامتحان المتوقعة ({count} سؤال)',
      answeredCountOf: 'تمت الإجابة على {answered} من {total}',
      finalScorePrefix: 'الدرجة النهائية',
      instantRationale: 'التعليل الفوري',
      examSimulation: 'محاكاة الامتحان',
      retakeMcqs: 'إعادة الاختبار',
      submitRecordScore: 'تسليم وحفظ الدرجة',
      questionOf: 'السؤال {current} من {total}',
      correct: 'إجابة صحيحة',
      incorrect: 'إجابة خاطئة',
      clinicalRationale: 'التعليل السريري',
      distractorNoteLabel: 'لماذا الخيارات الأخرى غير آمنة/أقل أولوية:',
      tfPracticeKicker: 'وضع تدريب صح أم خطأ',
      tfRapidTitle: 'التحقق السريري السريع ({count} عبارة)',
      answeredCorrect: '{answered}/{total} مجاب · {correct} صحيح',
      savedToAnalytics: 'تم الحفظ في التحليلات',
      saveDrillScore: 'حفظ نتيجة التدريب',
      statementOf: 'العبارة {current} من {total}',
      trueLabel: 'صح',
      falseLabel: 'خطأ',
      actuallyLabel: 'الصحيح أنها',
      keyRuleLabel: 'القاعدة الأساسية:',
      rapidCardsKicker: 'بطاقات المراجعة السريعة',
      rapidCardsTitle: 'الاسترجاع النشط قبل الامتحان ({done}/{total} واثق)',
      shuffleCards: 'خلط البطاقات',
      rapidAnswerLabel: 'الإجابة السريعة والملاحظة السريرية',
      examPromptLabel: 'سؤال الامتحان',
      cardNumberOf: 'بطاقة {current} / {total}',
      confidentState: 'واثق',
      reviewingState: 'قيد المراجعة',
      clinicalPearlLabel: 'لؤلؤة سريرية',
      clickToFlipAnswer: 'اضغط على البطاقة لقلبها للإجابة',
      clickToFlipPrompt: 'اضغط على البطاقة للعودة للسؤال',
      confidentUnmark: 'واثق (إلغاء التحديد)',
      markConfident: 'تحديد كواثق',
      analyticsKicker: 'تحليلات تقدم التعلم',
      analyticsTitle: 'الجاهزية للامتحان والأداء حسب المادة',
      totalLoggedHrs: '{hrs} ساعة مسجلة إجمالاً',
      activePackReadiness: 'جاهزية الحزمة النشطة',
      notesKeywordsCards: '{done}/{total} ملاحظات وكلمات وبطاقات',
      quizAccuracyCombined: 'دقة الاختبارات (MCQ + صح/خطأ)',
      itemsCorrect: '{correct}/{total} عنصر صحيح',
      completeDrillToScore: 'أكمل تدريباً لحساب النتيجة',
      flashcardLibraryMastery: 'إتقان مكتبة البطاقات',
      deckCardsMastered: '{done}/{total} بطاقة متقنة',
      assessmentsCompleted: 'التقييمات المكتملة',
      upcomingExamsTracked: '{count} امتحانات قادمة متابعة',
      sevenDayMinutes: 'دقائق المذاكرة خلال 7 أيام',
      domainAccuracy: 'الدقة والتغطية حسب التخصص',
      domainAccuracyEmpty: 'أنهِ اختبار MCQ أو صح/خطأ لعرض تحليلات الدقة حسب التخصص.',
      pendingPractice: 'بانتظار التدريب',
      personalizedRecsKicker: 'توصيات المذاكرة المخصصة',
      personalizedRecsTitle: 'أفضل الخطوات التالية لامتحاناتك',
      personalizingPlan: 'جارٍ تخصيص الخطة...',
      personalizeWithAi: 'تخصيص بالذكاء الاصطناعي',
      priorityBadge: 'أولوية',
      priorities: {
        Urgent: 'عاجلة',
        High: 'عالية',
        Maintain: 'استمرار',
      },
      recActions: {
        exam_tomorrow: 'افتح سباق امتحان بكرة',
        mcq: 'تدرّب على MCQs',
        truefalse: 'تدرّب على صح/خطأ',
        flashcards: 'افتح بطاقات المراجعة',
        summary: 'راجع الملخص المركز',
      },
      heuristicFocusWithExam:
        'أعطِ الأولوية لمقرر {code} ({subject}) مع تثبيت القواعد السريرية غير المتقنة والاسترجاع النشط.',
      heuristicFocusDefault:
        'ابنِ رصيد درجاتك في المواد السريرية الحالية وراجع حدود السلامة الحرجة.',
    },
    flashcards: {
      title: 'مولّد البطاقات التعليمية',
      subtitle: 'استرجاع نشط بالذكاء الاصطناعي لامتحانات التمريض',
      genKicker: '01. إنشاء مجموعة',
      genTitle: 'أنشئ بطاقات تمريض تعليمية',
      topicLabel: 'الموضوع التمريضي أو ملاحظات المحاضرة',
      topicPlaceholder: 'اكتب فئة دوائية، حالة مرضية، أو الصق ملخص محاضرتك...',
      studyFocusLabel: 'تركيز المذاكرة',
      cardCountLabel: 'عدد البطاقات',
      cardsUnit: 'بطاقات',
      generatingBtn: 'جارٍ توليد البطاقات...',
      generateBtn: 'توليد البطاقات التعليمية',
      savedDecksKicker: '02. المجموعات المحفوظة',
      savedDecksTitle: 'مكتبة بطاقاتك ({count})',
      noDecksSaved: 'لا توجد مجموعات محفوظة بعد. أنشئ مجموعتك الأولى أعلاه لبدء الاسترجاع النشط.',
      masteredSuffix: 'متقنة',
      noDeckSelected: 'لم يتم اختيار مجموعة بطاقات',
      noDeckSelectedSub:
        'أدخل أي موضوع في الأدوية أو خطط الرعاية أو الباثوفسيولوجي على الجانب لتوليد مجموعة تفاعلية.',
      cardsMasteredOf: '{done} من {total} بطاقة متقنة',
      allFilter: 'الكل ({count})',
      needsReviewFilter: 'تحتاج مراجعة ({count})',
      shuffle: 'خلط',
      allMasteredTitle: 'تم إتقان كل بطاقات هذه المجموعة',
      allMasteredSub: 'بدّل إلى عرض كل البطاقات لمراجعة المجموعة كاملة في أي وقت.',
      reviewAllCards: 'مراجعة كل البطاقات',
      answerPearlLabel: 'الإجابة والملاحظة السريرية',
      promptLabel: 'السؤال السريري',
      cardOf: 'بطاقة {current} / {total}',
      masteredState: 'متقنة',
      learningState: 'قيد التعلم',
      bedsidePearlLabel: 'ملاحظة السلامة السريرية',
      flipToPrompt: 'اضغط لقلب البطاقة للسؤال',
      flipToAnswer: 'اضغط لقلب البطاقة للإجابة',
      masteredUnmark: 'متقنة (اضغط لإلغاء التحديد)',
      markMastered: 'تحديد كمتقنة',
      presets: [
        'أنواع الإنسولين، بداية المفعول ووقت الذروة',
        'تفسير غازات الدم ABG والحماض التنفسي مقابل الأيضي',
        'العلامات الحيوية للأطفال وتقييم الجفاف',
        'مضادات التجلط: Heparin مقابل Warfarin و DOACs',
      ],
      focusOptions: [
        'علم الأدوية السريري',
        'التمريض الباطني والجراحي',
        'أسئلة NCLEX و OSCE عالية العائد',
        'الأساسيات والقيم المخبرية',
      ],
    },
    mcq: {
      title: 'مولّد أسئلة الاختيار MCQ',
      subtitle: 'تدريبات سريرية بأسلوب NCLEX و OSCE جامعة MUST',
      builderKicker: '01. منشئ الاختبار',
      builderTitle: 'توليد أسئلة اختيار من متعدد',
      topicLabel: 'الموضوع أو السيناريو السريري',
      topicPlaceholder: 'اكتب موضوعاً تمريضياً، فئة دوائية، أو حالة سريرية...',
      questionsLabel: 'الأسئلة',
      questionsUnit: 'أسئلة',
      levelLabel: 'المستوى',
      feedbackModeLabel: 'نمط التصحيح',
      instant: 'فوري',
      examEnd: 'نهاية الاختبار',
      generatingBtn: 'جارٍ توليد الأسئلة...',
      generateBtn: 'توليد اختبار MCQ',
      emptyTitle: 'جاهز للتدريب السريري على MCQ',
      emptySub:
        'أدخل أي موضوع تمريضي أو اختر أحد النماذج السريعة لتوليد أسئلة من 4 خيارات مع التعليل الكامل وتحليل المشتتات.',
      answeredOf: 'تمت الإجابة على {answered} من {total}',
      scoreLabel: 'الدرجة',
      retakeQuiz: 'إعادة الاختبار',
      submitSaveScore: 'تسليم وحفظ النتيجة',
      questionOf: 'السؤال {current} من {total}',
      correct: 'صحيح',
      incorrect: 'خطأ',
      clinicalRationale: 'التعليل السريري',
      distractorPrefix: 'لماذا الخيارات الأخرى غير آمنة أو أقل أولوية:',
      presets: [
        'فشل القلب الحاد ومدرات العروة (Loop Diuretics)',
        'الحماض الكيتوني السكري (DKA) وأولويات التمريض',
        'نزيف ما بعد الولادة وبروتوكول الأوكسيتوسين',
        'إصابة الكلى الحادة واضطرابات الأملاح',
      ],
      difficulties: ['المفاهيم الأساسية', 'التطبيق السريري', 'الأولويات والفرز (NCLEX/OSCE)'],
    },
    truefalse: {
      title: 'مولّد أسئلة صح أم خطأ',
      subtitle: 'كشف المفاهيم الخاطئة والتحقق السريع من السلامة السريرية',
      builderKicker: '01. تدريب الاسترجاع السريع',
      builderTitle: 'توليد عبارات صح أم خطأ',
      topicLabel: 'الموضوع التمريضي أو البروتوكول',
      topicPlaceholder: 'أدخل قاعدة تمريضية، فئة دوائية، أو الصق ملاحظاتك...',
      statementsLabel: 'العبارات',
      statementsUnit: 'عبارات',
      focusLabel: 'التركيز',
      generatingBtn: 'جارٍ توليد العبارات...',
      generateBtn: 'توليد صح أم خطأ',
      emptyTitle: 'جاهز للتحقق السريري السريع',
      emptySub:
        'اختبر نفسك في الأخطاء الشائعة بالتمريض، والترياقات الدوائية، وقواعد العزل، وحدود التحاليل الحرجة.',
      answeredCorrect: '{answered}/{total} مجاب · {correct} صحيح',
      savedToProgress: 'تم الحفظ في التقدم',
      saveDrillScore: 'حفظ نتيجة التدريب',
      statementOf: 'العبارة {current} من {total}',
      correct: 'صحيح',
      incorrect: 'خطأ',
      actually: 'الصحيح أنها',
      trueLabel: 'صح',
      falseLabel: 'خطأ',
      keyRulePrefix: 'القاعدة الأساسية:',
      presets: [
        'أمان الأدوية عالية الخطورة والترياقات',
        'القيم المخبرية الطبيعية للبالغين والحدود الحرجة',
        'مكافحة العدوى واحتياطات العزل',
        'رعاية الأنبوب الصدري وجهاز التنفس الصناعي',
      ],
      focusLevels: [
        'السلامة السريرية والاسترجاع السريع',
        'موانع استخدام الأدوية',
        'بروتوكولات OSCE والتمريض السريري',
      ],
    },
    planner: {
      title: 'مخطط المذاكرة',
      subtitle: 'جدول التدريبات السريرية والمحاضرات و OSCE',
      addKicker: '01. جدولة حصة مذاكرة',
      addTitle: 'إضافة مهمة تمريض',
      taskTitleLabel: 'عنوان المهمة',
      taskTitlePlaceholder: 'مثال: مراجعة مضادات التجلط وأهداف INR',
      subjectLabel: 'المادة',
      studyTypeLabel: 'نوع المذاكرة',
      targetDateLabel: 'التاريخ المستهدف',
      minutesLabel: 'الدقائق',
      priorityLabel: 'الأولوية',
      notesLabel: 'ملاحظات سريرية (اختياري)',
      notesPlaceholder: 'الفصول المهمة، أهداف الجناح، أو القيم المخبرية',
      addToPlanBtn: 'إضافة إلى خطة المذاكرة',
      timerKicker: '02. مؤقت التركيز',
      timerTitle: 'جلسة مذاكرة مؤقتة',
      sessionSubjectLabel: 'مادة الجلسة',
      pause: 'إيقاف مؤقت',
      startSession: 'بدء الجلسة',
      resetTimer: 'إعادة ضبط المؤقت',
      logTime: 'تسجيل الوقت',
      loggedNotice: 'تم تسجيل {mins} دقيقة لمادة {subject} في تتبع التقدم.',
      scheduleTitle: 'جدول المذاكرة',
      scheduleSummary: 'تم إنجاز {done} من {total} مهمة · متبقي {mins} دقيقة',
      allSubjects: 'كل المواد',
      noMatchingTasks: 'لا توجد مهام مطابقة',
      noMatchingTasksSub: 'أضف مراجعة محاضرة أو تحضير خطة رعاية أو تدريب OSCE من النموذج.',
      priorityWord: 'أولوية',
      categories: {
        'Lecture Review': 'مراجعة محاضرة',
        'Clinical Prep': 'تحضير سريري',
        'Exam Practice': 'تدريب امتحان',
        'Lab / OSCE': 'معمل / OSCE',
        Assignment: 'تكليف دراسي',
      },
      priorities: {
        High: 'عالية',
        Medium: 'متوسطة',
        Low: 'منخفضة',
      },
      subjects: [
        'علم الأدوية',
        'التمريض الباطني الجراحي',
        'تمريض الأمومة والوليد',
        'تمريض الأطفال',
        'العناية الحرجة',
        'حساب الجرعات',
        'OSCE والمهارات',
      ],
    },
    gpa: {
      title: 'حاسبة المعدل GPA',
      subtitle: 'نظام جامعة MUST من 4.0 بالساعات المعتمدة',
      hideScale: 'إخفاء سلم الدرجات',
      viewScale: 'عرض سلم الدرجات',
      semesterGpa: 'المعدل الفصلي',
      ptsCredits: '{pts} نقطة / {credits} ساعة',
      projectedCgpa: 'المعدل التراكمي المتوقع',
      totalCredits: '{credits} إجمالي الساعات المعتمدة',
      academicStanding: 'التقدير الأكاديمي',
      facultyBenchmark: 'معيار كلية التمريض بجامعة MUST',
      targetForecast: 'توقع المعدل المستهدف',
      achieved: 'تم التحقيق',
      reqSuffix: 'مطلوب',
      next15Cr: 'خلال 15 ساعة قادمة لبلوغ {target}',
      scaleTitle: 'نقاط الدرجات بالساعات المعتمدة في جامعة MUST',
      scaleSubtitle: 'المقياس القياسي 4.0 لمقررات كلية التمريض',
      priorKicker: '01. السجل الأكاديمي السابق',
      priorTitle: 'الرصيد التراكمي والهدف',
      semesterLabel: 'اسم الفصل الدراسي',
      priorCreditsLabel: 'الساعات المنجزة سابقاً',
      priorCgpaLabel: 'المعدل التراكمي السابق',
      targetCgpaLabel: 'المعدل التراكمي المستهدف',
      coursesKicker: '02. مقررات الفصل الحالي',
      currentSemesterFallback: 'الفصل الحالي',
      resetSample: 'استعادة النموذج',
      addCourse: 'إضافة مقرر',
      noCoursesTitle: 'لا توجد مقررات في هذا الفصل',
      noCoursesSub: 'أضف ساعات المواد النظرية والتدريب السريري لحساب معدلك.',
      addFirstCourse: 'إضافة أول مقرر',
      colCode: 'الكود',
      colTitle: 'اسم المقرر',
      colCredits: 'الساعات',
      colGrade: 'التقدير المتوقع',
      colQualityPts: 'النقاط',
      colAction: 'إجراء',
      courseTitlePlaceholder: 'مثال: تمريض الأطفال',
      crUnit: 'س',
    },
    progress: {
      title: 'تتبع التقدم',
      subtitle: 'نتائج التقييمات، إتقان البطاقات وساعات المذاكرة الأسبوعية',
      quizAccuracy: 'دقة الاختبارات',
      completedItems: '{count} مكتمل · {correct}/{total} عنصر',
      flashcardMastery: 'إتقان البطاقات',
      cardsMasteredOf: '{done} من {total} بطاقة متقنة',
      taskCompletion: 'إنجاز المهام',
      studyTasksDone: '{done} من {total} مهمة منجزة',
      studyTimeLogged: 'وقت المذاكرة المسجل',
      projectedCgpa: 'المعدل التراكمي المتوقع {gpa}',
      weeklyLogKicker: '01. سجل المذاكرة الأسبوعي',
      weeklyLogTitle: 'الدقائق المسجلة خلال آخر 7 أيام',
      readinessKicker: '02. قائمة الجاهزية',
      readinessTitle: 'معالم المذاكرة السريرية',
      milestones: {
        chat: { label: 'بدأت محادثة تفكير سريري في المحادثة الذكية', cta: 'افتح المحادثة' },
        gpa: { label: 'أعددت مقررات الفصل في حاسبة المعدل GPA', cta: 'مراجعة GPA' },
        planner: { label: 'أكملت 3 مهام مذاكرة تمريضية على الأقل في المخطط', cta: 'افتح المخطط' },
        cards: { label: 'أتقنت 5 بطاقات استرجاع نشط أو أكثر', cta: 'مراجعة البطاقات' },
        quiz: { label: 'حققت دقة 80%+ في اختبار MCQ أو صح/خطأ', cta: 'ابدأ اختباراً' },
      },
      coverageKicker: '03. تغطية المواد',
      coverageTitle: 'الأداء حسب التخصص التمريضي',
      coverageEmpty: 'أكمل مجموعة بطاقات أو اختبار MCQ أو تدريب صح/خطأ أو جلسة مؤقت لعرض تغطية المواد.',
      quizTag: '{pct}% اختبار',
      cardsTag: '{pct}% بطاقات',
      minLoggedTag: '{mins} د مسجلة',
      cardsLabel: 'البطاقات',
      quizItemsLabel: 'أسئلة الاختبار',
      historyKicker: '04. سجل التقييمات',
      historyTitle: 'جلسات MCQ وصح/خطأ المكتملة',
      clearHistory: 'مسح السجل',
      noAttemptsTitle: 'لم يتم تسجيل محاولات اختبار بعد',
      noAttemptsSub: 'أنهِ اختبار MCQ أو تدريب صح/خطأ واضغط حفظ لتتبع درجاتك بمرور الوقت.',
      openMcq: 'افتح مولّد MCQ',
      tryTf: 'جرّب تدريب صح/خطأ',
      colTitle: 'عنوان التقييم',
      colMode: 'النمط',
      colSubject: 'المادة',
      colDate: 'التاريخ',
      colScore: 'الدرجة',
      modeMcq: 'اختبار MCQ',
      modeTf: 'صح أم خطأ',
    },
    profile: {
      title: 'الملف الشخصي',
      studentIdPrefix: 'الرقم الجامعي',
      studyThreads: 'سلاسل المذاكرة',
      clinicalPrompts: 'الأسئلة السريرية',
      fullName: 'الاسم الكامل',
      studentId: 'الرقم الجامعي بـ MUST',
      email: 'البريد الجامعي',
      academicYear: 'السنة الدراسية',
      clinicalRotation: 'التدريب السريري الحالي',
      campus: 'الحرم الجامعي والمستشفى التعليمي',
      bio: 'نبذة عن مسار المذاكرة السريري',
      focusAreas: 'مجالات التركيز الحالية',
      focusPlaceholder: 'أضف مادة (مثال: أورام الأطفال)',
      addBtn: 'إضافة',
      resetDefault: 'استعادة الافتراضي',
      profileSaved: 'تم حفظ الملف الشخصي',
      saveProfile: 'حفظ الملف الشخصي',
    },
    settings: {
      title: 'الإعدادات',
      appearanceKicker: '01. المظهر واللغة',
      appearanceTitle: 'السمة واللغة وراحة القراءة',
      languageTitle: 'لغة الواجهة',
      languageDesc: 'بدّل فوراً بين اللغة العربية (من اليمين لليسار) والإنجليزية (من اليسار لليمين).',
      colorModeTitle: 'وضع الألوان',
      colorModeDesc: 'بدّل بين الوضع النهاري الواضح والوضع الداكن المريح للعين أثناء المذاكرة الليلية.',
      themes: {
        light: 'فاتح',
        dark: 'داكن',
        system: 'النظام',
      },
      densityTitle: 'كثافة الإجابات',
      densityDesc: 'اختر بين الشرح السريري المتوازن أو الملاحظات المكثفة للمراجعة السريعة.',
      densityOptions: {
        comfortable: 'مريح',
        compact: 'مكثف',
      },
      textSizeTitle: 'حجم خط المحادثة',
      textSizeDesc: 'اضبط حجم الخط لجلسات الأدوية والباثوفسيولوجي الطويلة.',
      fontSizeOptions: {
        standard: 'قياسي',
        large: 'كبير',
      },
      clinicalKicker: '02. التفضيلات السريرية',
      clinicalTitle: 'هيكل تفكير الذكاء الاصطناعي',
      defaultFormatTitle: 'تنسيق المذاكرة الافتراضي',
      formats: {
        adpie: {
          label: 'عملية التمريض (ADPIE)',
          description: 'ينظم الموضوعات السريرية إلى التقييم، التشخيص، التخطيط، التدخل، والتقويم.',
        },
        nanda: {
          label: 'خطط رعاية NANDA-I',
          description: 'يستخدم صياغة المشكلة / المرتبطة بـ / كما يتضح من، مع أهداف NOC وتدخلات NIC.',
        },
        dosage: {
          label: 'حساب الجرعات خطوة بخطوة',
          description: 'يعرض تحليل الأبعاد الكامل، وتحويل الوحدات، والتقريب، وفحص النطاق الآمن.',
        },
        exam: {
          label: 'التحضير لـ OSCE والامتحانات',
          description: 'يركز على أولويات ABCs، وإجراءات السلامة الفورية، وحدود التحاليل، والتعليلات المركزة.',
        },
      },
      safetyTitle: 'تنبيهات السلامة للأدوية عالية الخطورة',
      safetyDesc: 'تضمين فحوصات المراقبة الحرجة عند مراجعة المحاليل الوريدية ومضادات التجلط والأملاح.',
      enterSendTitle: 'مفتاح Enter يرسل الرسالة',
      enterSendDesc: 'استخدم Shift + Enter لإضافة سطر جديد.',
      dataKicker: '03. بيانات المذاكرة',
      dataTitle: 'التصدير وتخزين المحادثات',
      exportTitle: 'تصدير سجل المذاكرة',
      exportDesc: 'تنزيل {count} محادثة محفوظة بصيغة JSON.',
      downloaded: 'تم التنزيل',
      downloadJson: 'تنزيل JSON',
      clearTitle: 'مسح جميع المحادثات',
      clearDesc: 'إزالة سلاسل المذاكرة المحفوظة من هذا المتصفح نهائياً.',
      confirmDelete: 'تأكيد الحذف',
      clearHistory: 'مسح السجل',
    },
  },
};

export function interpolate(
  template: string,
  vars: Record<string, string | number>
): string {
  return template.replace(/\{(\w+)\}/g, (_, key) =>
    vars[key] !== undefined ? String(vars[key]) : `{${key}}`
  );
}

export function translateStandingLabel(
  label: string,
  t: TranslationDictionary
): string {
  switch (label) {
    case 'No Credits Entered':
      return t.standing.noCredits;
    case "Dean's Honors":
      return t.standing.deansHonors;
    case 'Good Standing':
      return t.standing.goodStanding;
    case 'Satisfactory':
      return t.standing.satisfactory;
    case 'Academic Warning':
      return t.standing.academicWarning;
    default:
      return label;
  }
}
