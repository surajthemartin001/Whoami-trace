import {
  UserProfile,
  Goal,
  Resource,
  CurriculumNode,
  PlanTask,
  RecoveryPlan,
  Question,
  QuestionPack,
  QuestionAttempt,
  SavedQuestion,
  RevisionItem,
  NEXORAProject,
  LyraMessage,
  AnalyticsData,
  TrackState,
  IntensityConfig,
  LyraConfig,
  LyraMood,
} from '../types';

const STORAGE_KEYS = {
  USER_PROFILE: 'wai_user_profile',
  GOALS: 'wai_goals',
  RESOURCES: 'wai_resources',
  CURRICULUM: 'wai_curriculum',
  TASKS: 'wai_tasks',
  RECOVERY: 'wai_recovery',
  QUESTIONS: 'wai_questions',
  QUESTION_PACKS: 'wai_question_packs',
  ATTEMPTS: 'wai_attempts',
  SAVED_QUESTIONS: 'wai_saved_questions',
  REVISION_ITEMS: 'wai_revision_items',
  NEXORA_PROJECTS: 'wai_nexora_projects',
  LYRA_MESSAGES: 'wai_lyra_messages',
  LYRA_CONFIG: 'wai_lyra_config',
};

export const DEFAULT_LYRA_CONFIG: LyraConfig = {
  currentMood: 'HAPPY',
  adaptiveMood: true,
  personalityPreset: 'FRIENDLY',
  sliders: {
    warmth: 85,
    humor: 60,
    energy: 75,
    directness: 60,
    verbosity: 45,
    formality: 30,
    encouragement: 85,
  },
  voice: {
    provider: 'cloud_tts',
    voiceName: 'Kore',
    gender: 'female',
    speed: 1.0,
    pitch: 1.0,
    expressiveness: 80,
    volume: 90,
    pauseBeforeResponseMs: 150,
    autoSpeak: false,
    interruptible: true,
    continuousMode: false,
  },
  language: 'Hindi',
  memoryEnabled: true,
  memories: [
    {
      id: 'mem_1',
      key: 'Primary Trajectory',
      value: 'Autonomous Physical AI Quadruped & Advanced Systems Security',
      category: 'goal_context',
      createdAt: '2026-10-01',
    },
    {
      id: 'mem_2',
      key: 'Pedagogical Preference',
      value: 'Rigorous mathematical derivations and practical systems design first',
      category: 'learning_preference',
      createdAt: '2026-10-02',
    },
    {
      id: 'mem_3',
      key: 'Conversational Tone',
      value: 'Conversational, lively, direct; avoid repetitive robotic phrases',
      category: 'communication',
      createdAt: '2026-10-03',
    },
  ],
};

// Initial default user state for Suraj Kumar
const DEFAULT_USER: UserProfile = {
  id: 'usr_suraj_01',
  name: 'Suraj Kumar',
  displayName: 'Suraj Kumar',
  email: 'dileepsah267@gmail.com',
  phone: '+91 98765 43210',
  interests: ['Autonomous Robotics', 'Cybersecurity', 'AI & Deep Learning', 'Hardware Architectures'],
  learningInterests: ['Robotics Perception & Control', 'Embedded C++', 'Kernel & Network Security', 'Venture Creation'],
  dailyAvailableHours: 5,
  daysAvailablePerWeek: 6,
  preferredLanguage: 'Hindi',
  isOnboarded: true,
  permissions: {
    microphone: true,
    camera: false,
    notifications: true,
    files: true,
  },
  currentIntensity: {
    mode: 'cheetah',
    name: 'Cheetah Mode',
    badge: '⚡ High Momentum',
    dailyHours: 5,
    weeklyHours: 30,
    description: 'Disciplined, aggressive progress with structured recovery safeguards.',
    lockDurationDays: 30,
    lockedUntil: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
    isLocked: true,
  },
  createdAt: new Date().toISOString(),
};

const DEFAULT_GOALS: Goal[] = [
  {
    id: 'goal_1',
    title: 'Autonomous Robotics & Physical AI Mastery',
    description: 'Design, build, and deploy an intelligent quadruped robotic platform with LiDAR perception and real-time edge intelligence.',
    domain: 'Robotics & AI',
    targetDate: '2027-04-30',
    progressPercentage: 68,
    priority: 'High',
    status: 'Active',
    milestones: [
      { id: 'm1_1', title: 'Complete Kinematics & Inverse Dynamics Math', deadline: '2026-11-15', completed: true, order: 1 },
      { id: 'm1_2', title: 'RTOS & Embedded C++ Motor Driver Architecture', deadline: '2026-12-20', completed: true, order: 2 },
      { id: 'm1_3', title: 'Visual-Inertial Odometry & EKF Sensor Fusion', deadline: '2027-01-31', completed: false, order: 3 },
      { id: 'm1_4', title: 'Quadruped Gait Planning Simulation & Physical Run', deadline: '2027-04-30', completed: false, order: 4 },
    ],
    requiredSkills: ['C++20', 'ROS 2 DDS', 'Kinematics', 'Kalman Filtering', 'Motor Control'],
    requiredResources: ['Modern Robotics PDF', 'Sensors Handbook', 'ROS 2 Galactic Docs'],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'goal_2',
    title: 'Advanced Cybersecurity & Systems Security',
    description: 'Master binary exploitation, memory safety analysis, web infrastructure defense, and network intrusion detection.',
    domain: 'Cybersecurity',
    targetDate: '2027-02-28',
    progressPercentage: 54,
    priority: 'High',
    status: 'Active',
    milestones: [
      { id: 'm2_1', title: 'Linux Kernel Internals & Memory Layouts', deadline: '2026-11-01', completed: true, order: 1 },
      { id: 'm2_2', title: 'Buffer Overflow, ROP Chains & ASLR Bypasses', deadline: '2026-12-15', completed: false, order: 2 },
      { id: 'm2_3', title: 'Enterprise Threat Modeling & Zero-Trust Defense', deadline: '2027-02-28', completed: false, order: 3 },
    ],
    requiredSkills: ['x86/ARM Assembly', 'GDB/Ghidra', 'Network Protocols', 'C Cryptography'],
    requiredResources: ['Syllabus_CyberSecurity_2026.pdf', 'Practical Binary Analysis'],
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'goal_3',
    title: 'NEXORA: Robotics & AI Venture Architecture',
    description: 'Architect company roadmap, core patentable IP, hardware supply chain, and launch first commercial robotics product prototype.',
    domain: 'Business & Robotics Venture',
    targetDate: '2027-09-30',
    progressPercentage: 35,
    priority: 'Medium',
    status: 'Active',
    milestones: [
      { id: 'm3_1', title: 'Whitepaper & Technical Architecture Spec', deadline: '2026-12-30', completed: true, order: 1 },
      { id: 'm3_2', title: 'BOM & Hardware Supplier Pipeline Verification', deadline: '2027-03-15', completed: false, order: 2 },
      { id: 'm3_3', title: 'Pre-seed Pitch & Alpha Customer Trials', deadline: '2027-09-30', completed: false, order: 3 },
    ],
    requiredSkills: ['Systems Architecture', 'Product Strategy', 'Financial Modeling', 'Team Leadership'],
    requiredResources: ['NEXORA_Charter_v1.pdf'],
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const DEFAULT_RESOURCES: Resource[] = [
  {
    id: 'res_1',
    title: 'Modern Robotics: Mechanics, Planning, and Control',
    type: 'pdf',
    size: '14.8 MB',
    dateAdded: '2026-09-12',
    extractedTopics: ['Screw Theory', 'Twists & Wrenches', 'Inverse Kinematics', 'Trajectory Generation'],
    conceptsCount: 42,
    questionsCount: 65,
    contentPreview: 'Comprehensive textbook on mathematical foundations of kinematics and dynamics.',
  },
  {
    id: 'res_2',
    title: 'Advanced Sensor Fusion & EKF Course Notes',
    type: 'notes',
    size: '4.2 MB',
    dateAdded: '2026-09-24',
    extractedTopics: ['Extended Kalman Filter', 'IMU Integration', 'LiDAR Point Cloud Matching'],
    conceptsCount: 28,
    questionsCount: 35,
    contentPreview: 'Personal notes on covariance matrix calculation, drift compensation, and sensor fusion.',
  },
  {
    id: 'res_3',
    title: 'Cybersecurity & Offensive System Defense PYQ Bank (2022-2025)',
    type: 'pyq',
    size: '8.6 MB',
    dateAdded: '2026-10-01',
    extractedTopics: ['Memory Corruption', 'Privilege Escalation', 'XSS/CSRF Defenses', 'DDS Protocols'],
    conceptsCount: 50,
    questionsCount: 90,
    contentPreview: 'Real previous year examination and competitive security questions with step-by-step solutions.',
  },
  {
    id: 'res_4',
    title: 'Free Open Educational Connector: PW & LNF Open Catalog',
    type: 'external',
    dateAdded: '2026-10-03',
    extractedTopics: ['Physics for Engineers', 'Signal Processing', 'Applied Mathematics'],
    conceptsCount: 36,
    questionsCount: 45,
    sourceConnector: 'Verified Free Educational Open API',
    contentPreview: 'Public educational modules connected without DRM/paywall circumvention.',
  },
];

const DEFAULT_CURRICULUM: CurriculumNode[] = [
  {
    id: 'cur_1',
    title: 'Robotics Engineering',
    level: 'field',
    parentId: null,
    prerequisites: [],
    estimatedHours: 240,
    completedHours: 165,
    keyConcepts: ['Spatial Representations', 'Dynamics', 'Sensor Fusion', 'Actuation'],
    practiceRequirement: 250,
    practiceCompleted: 190,
    isMastered: false,
  },
  {
    id: 'cur_1_1',
    title: 'Kinematics & Spatial Transforms',
    level: 'subject',
    parentId: 'cur_1',
    prerequisites: [],
    estimatedHours: 40,
    completedHours: 40,
    keyConcepts: ['Rotation Matrices', 'Quaternions', 'DH Parameters'],
    practiceRequirement: 50,
    practiceCompleted: 50,
    isMastered: true,
  },
  {
    id: 'cur_1_2',
    title: 'Sensor Perception & State Estimation',
    level: 'subject',
    parentId: 'cur_1',
    prerequisites: ['cur_1_1'],
    estimatedHours: 60,
    completedHours: 45,
    keyConcepts: ['Kalman Filters', 'LiDAR SLAM', 'Camera Calibration'],
    practiceRequirement: 70,
    practiceCompleted: 55,
    isMastered: false,
  },
  {
    id: 'cur_1_3',
    title: 'Motion Planning & Quadruped Gaits',
    level: 'subject',
    parentId: 'cur_1',
    prerequisites: ['cur_1_2'],
    estimatedHours: 70,
    completedHours: 35,
    keyConcepts: ['RRT*', 'A* Search', 'Zero Moment Point (ZMP)', 'Model Predictive Control'],
    practiceRequirement: 80,
    practiceCompleted: 40,
    isMastered: false,
  },
];

const DEFAULT_TASKS: PlanTask[] = [
  {
    id: 'task_1',
    title: 'Study: Extended Kalman Filter Covariance Matrix Derivation',
    type: 'learn',
    timeSlot: '09:00 - 10:30',
    durationMinutes: 90,
    completed: true,
    date: new Date().toISOString().slice(0, 10),
    goalId: 'goal_1',
    priority: 'High',
  },
  {
    id: 'task_2',
    title: 'Practice: 25 MCQs on LiDAR & IMU Sensor Fusion',
    type: 'practice',
    timeSlot: '10:45 - 12:00',
    durationMinutes: 75,
    completed: false,
    date: new Date().toISOString().slice(0, 10),
    goalId: 'goal_1',
    priority: 'High',
  },
  {
    id: 'task_3',
    title: 'Mental Recharge & Nutrition Break',
    type: 'break',
    timeSlot: '12:00 - 13:00',
    durationMinutes: 60,
    completed: false,
    date: new Date().toISOString().slice(0, 10),
    priority: 'Medium',
  },
  {
    id: 'task_4',
    title: 'NEXORA: Review Quadruped Motor Actuator Torque Curves',
    type: 'project',
    timeSlot: '14:30 - 16:30',
    durationMinutes: 120,
    completed: false,
    date: new Date().toISOString().slice(0, 10),
    goalId: 'goal_3',
    priority: 'Medium',
  },
  {
    id: 'task_5',
    title: 'Revision: Binary Exploitation Vulnerabilities (Weak Topic Review)',
    type: 'revision',
    timeSlot: '19:00 - 19:45',
    durationMinutes: 45,
    completed: false,
    date: new Date().toISOString().slice(0, 10),
    goalId: 'goal_2',
    priority: 'High',
  },
];

const DEFAULT_QUESTIONS: Question[] = [
  {
    id: 'q_db_1',
    question: 'When fusing IMU and LiDAR data in an Extended Kalman Filter (EKF), why must the accelerometer readings be integrated twice to obtain position, and what mathematical problem arises over time?',
    options: [
      'Acceleration is the 2nd derivative of position; sensor bias integration causes cubic position drift over time.',
      'Acceleration is the 1st derivative of position; sensor bias causes linear error.',
      'Integration cancels out sensor noise without requiring high-pass filtering.',
      'Double integration converts linear coordinates into quaternion rotations.',
    ],
    correctOptionIndex: 0,
    explanation: 'Integrating acceleration once yields velocity with linear drift from bias. Integrating again yields position with quadratic-to-cubic drift, which is why external aiding (LiDAR/GPS) is essential.',
    wrongOptionsExplanation: 'Option B misstates derivative order; Option C is false because integration compounds low-frequency bias; Option D describes orientation transforms, not double integration.',
    difficulty: 'Hard',
    domain: 'Robotics & AI',
    subject: 'Perception',
    topic: 'IMU & EKF Fusion',
    relatedConcept: 'Inertial Navigation Drift & Covariance Propagation',
    source: 'Modern Robotics & Sensor Fusion Notes',
    tags: ['Robotics', 'Sensors', 'Kalman Filter'],
    type: 'single_mcq',
  },
  {
    id: 'q_db_2',
    question: 'Assertion (A): In ROS 2, Intra-Process Communication (IPC) allows zero-copy message passing between nodes within the same container process.\nReason (R): When messages are published as unique_ptr, the publisher loans the memory ownership pointer directly to the subscriber without copying raw bytes.',
    options: [
      'Both (A) and (R) are true, and (R) is the correct explanation of (A).',
      'Both (A) and (R) are true, but (R) is NOT the correct explanation of (A).',
      '(A) is true, but (R) is false.',
      '(A) is false, but (R) is true.',
    ],
    correctOptionIndex: 0,
    explanation: 'In ROS 2, publishing a std::unique_ptr transfers heap ownership directly to the subscriber within the same process address space, bypassing DDS serialization and copying completely.',
    wrongOptionsExplanation: 'Both statements are true and (R) directly explains the physical memory mechanism behind (A).',
    difficulty: 'Medium',
    domain: 'Robotics & AI',
    subject: 'Embedded Systems',
    topic: 'ROS 2 Middleware',
    relatedConcept: 'Zero-Copy Shared Memory',
    tags: ['C++', 'ROS 2', 'Performance'],
    type: 'assertion_reason',
  },
  {
    id: 'q_db_3',
    question: 'In modern memory protection architectures, what technique does Address Space Layout Randomization (ASLR) employ to defeat classic Return-to-libc attacks?',
    options: [
      'Randomizing the base memory addresses of the stack, heap, and shared libraries on every program execution.',
      'Compiling the binary without standard library functions.',
      'Encrypting all CPU registers using hardware TPM keys.',
      'Disallowing any thread from writing to local variables.',
    ],
    correctOptionIndex: 0,
    explanation: 'ASLR randomizes memory offsets so attackers cannot hardcode known addresses (like system() in libc) into their payload without first discovering an information disclosure vulnerability.',
    wrongOptionsExplanation: 'ASLR does not eliminate libc or encrypt registers; it shifts the base virtual address space.',
    difficulty: 'Medium',
    domain: 'Cybersecurity',
    subject: 'Systems Security',
    topic: 'Binary Exploitation Defenses',
    relatedConcept: 'Virtual Address Randomization',
    source: 'Cybersecurity PYQ Bank',
    isPYQ: true,
    examYear: '2024',
    tags: ['Cybersecurity', 'ASLR', 'Binary Defense'],
    type: 'single_mcq',
  },
  {
    id: 'q_db_4',
    question: 'You are debugging a mobile robot whose trajectory diverges when executing sharp turns at higher speeds. Kinematics calculations match on flat ground at low velocity. Which physical phenomenon was most likely omitted from the model?',
    options: [
      'Wheel slip and non-holonomic tire lateral compliance (slip angle & lateral friction limits)',
      'Atmospheric pressure variations at room temperature',
      'Quantum tunneling inside the motor controller MOSFETs',
      'Earth rotational Coriolis acceleration during 2-meter movements',
    ],
    correctOptionIndex: 0,
    explanation: 'Kinematic models assume pure rolling without slipping. At higher velocities and sharp turns, lateral centripetal forces exceed available tire friction, inducing slip angles that require dynamic tire friction models.',
    wrongOptionsExplanation: 'Coriolis force and atmospheric pressure are negligible on slow terrestrial indoor scales; quantum tunneling causes semiconductor leakage, not turning trajectory slip.',
    difficulty: 'Hard',
    domain: 'Robotics & AI',
    subject: 'Dynamics & Control',
    topic: 'Non-holonomic Constraints & Slip',
    relatedConcept: 'Pacejka Magic Formula Tire Dynamics',
    type: 'scenario',
    tags: ['Robotics', 'Dynamics', 'Physical Modeling'],
  },
  {
    id: 'q_db_5',
    question: 'Which of the following headers should be configured to protect a web application from being rendered inside an unauthorized iframe (Clickjacking defense)? (Select all that apply)',
    options: [
      'Content-Security-Policy: frame-ancestors \'self\' https://trusted.example.com',
      'X-Frame-Options: DENY or SAMEORIGIN',
      'Access-Control-Allow-Origin: *',
      'Strict-Transport-Security: max-age=31536000',
    ],
    correctIndices: [0, 1],
    correctOptionIndex: 0,
    explanation: 'CSP frame-ancestors is the modern standard, and X-Frame-Options provides legacy support. CORS and HSTS serve different security goals (API origin sharing and TLS enforcement).',
    wrongOptionsExplanation: 'CORS does not control iframe framing; HSTS enforces HTTPS.',
    difficulty: 'Medium',
    domain: 'Cybersecurity',
    subject: 'Web Security',
    topic: 'Clickjacking & Header Defense',
    relatedConcept: 'HTTP Security Headers',
    type: 'multiple_mcq',
    tags: ['Web Security', 'CSP', 'Browser Architecture'],
  },
];

const DEFAULT_NEXORA_PROJECTS: NEXORAProject[] = [
  {
    id: 'nex_1',
    title: 'Project AETHER-IV: Quadruped Physical AI Platform',
    category: 'Robotics',
    stage: 'Prototyping',
    progress: 72,
    targetCompletion: '2027-04-30',
    description: 'Autonomous quadruped inspection robot with edge-embedded neural gait generation, 3D LiDAR mapping, and fail-safe reflex controllers.',
    specs: [
      '12x High-Torque Quasi-Direct Drive BLDC Actuators (45 Nm peak)',
      'Nvidia Jetson Orin Edge Compute + STM32H7 Real-Time MCU',
      '32-Channel Solid-State 3D LiDAR + Dual Global Shutter Cameras',
      'ROS 2 Humble / CycloneDDS Zero-Copy Architecture',
    ],
    milestones: [
      { id: 'nm1', title: 'Single-leg dynamometer force testing', done: true },
      { id: 'nm2', title: 'Carbon fiber chassis CNC machining', done: true },
      { id: 'nm3', title: 'Terrain elevation mapping neural network integration', done: false },
      { id: 'nm4', title: 'Full 10km rugged field autonomous trial', done: false },
    ],
  },
  {
    id: 'nex_2',
    title: 'CYBER-SENTINEL: Micro-Kernel Distributed Security Gateway',
    category: 'Cybersecurity',
    stage: 'Architecture',
    progress: 45,
    targetCompletion: '2027-06-30',
    description: 'Hardware-isolated formal-verification micro-kernel gateway enforcing zero-trust cryptography for robotics fleet telemetry.',
    specs: [
      'seL4 Microkernel formally verified capability security',
      'Post-Quantum Kyber-1024 Key Exchange Pipeline',
      'Hardware TPM 2.0 Attestation & Secure Boot',
    ],
    milestones: [
      { id: 'nm5', title: 'Capability access control matrix formal specification', done: true },
      { id: 'nm6', title: 'WireGuard kernel bypass throughput benchmark', done: false },
    ],
  },
];

export const StorageService = {
  getUserProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  },

  saveUserProfile(profile: UserProfile): void {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  },

  getGoals(): Goal[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GOALS);
      return data ? JSON.parse(data) : DEFAULT_GOALS;
    } catch {
      return DEFAULT_GOALS;
    }
  },

  saveGoals(goals: Goal[]): void {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  },

  getResources(): Resource[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RESOURCES);
      return data ? JSON.parse(data) : DEFAULT_RESOURCES;
    } catch {
      return DEFAULT_RESOURCES;
    }
  },

  saveResources(resources: Resource[]): void {
    localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(resources));
  },

  getCurriculum(): CurriculumNode[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRICULUM);
      return data ? JSON.parse(data) : DEFAULT_CURRICULUM;
    } catch {
      return DEFAULT_CURRICULUM;
    }
  },

  saveCurriculum(nodes: CurriculumNode[]): void {
    localStorage.setItem(STORAGE_KEYS.CURRICULUM, JSON.stringify(nodes));
  },

  getTasks(): PlanTask[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TASKS);
      return data ? JSON.parse(data) : DEFAULT_TASKS;
    } catch {
      return DEFAULT_TASKS;
    }
  },

  saveTasks(tasks: PlanTask[]): void {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  },

  getQuestions(): Question[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      return data ? JSON.parse(data) : DEFAULT_QUESTIONS;
    } catch {
      return DEFAULT_QUESTIONS;
    }
  },

  saveQuestions(questions: Question[]): void {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
  },

  getSavedQuestions(): SavedQuestion[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVED_QUESTIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveSavedQuestions(items: SavedQuestion[]): void {
    localStorage.setItem(STORAGE_KEYS.SAVED_QUESTIONS, JSON.stringify(items));
  },

  getRevisionItems(): RevisionItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REVISION_ITEMS);
      if (data) return JSON.parse(data);
      // default revision item
      return [
        {
          id: 'rev_1',
          conceptTitle: 'Extended Kalman Filter Linearization Jacobian',
          topic: 'Sensor Fusion',
          domain: 'Robotics & AI',
          dueAt: new Date(Date.now() + 1000 * 60 * 60 * 6).toISOString(),
          stage: 2,
          masteryScore: 68,
        },
        {
          id: 'rev_2',
          conceptTitle: 'ROP Chain Gadget Alignment',
          topic: 'Systems Security',
          domain: 'Cybersecurity',
          dueAt: new Date().toISOString(),
          stage: 1,
          masteryScore: 52,
        },
      ];
    } catch {
      return [];
    }
  },

  saveRevisionItems(items: RevisionItem[]): void {
    localStorage.setItem(STORAGE_KEYS.REVISION_ITEMS, JSON.stringify(items));
  },

  getNexoraProjects(): NEXORAProject[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NEXORA_PROJECTS);
      return data ? JSON.parse(data) : DEFAULT_NEXORA_PROJECTS;
    } catch {
      return DEFAULT_NEXORA_PROJECTS;
    }
  },

  saveNexoraProjects(projects: NEXORAProject[]): void {
    localStorage.setItem(STORAGE_KEYS.NEXORA_PROJECTS, JSON.stringify(projects));
  },

  getAttempts(): QuestionAttempt[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  recordAttempt(attempt: QuestionAttempt): void {
    const list = this.getAttempts();
    list.unshift(attempt);
    localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(list.slice(0, 500)));
  },

  getAnalytics(): AnalyticsData {
    const attempts = this.getAttempts();
    const tasks = this.getTasks();
    const missedTasks = tasks.filter((t) => !t.completed && t.isMissed);

    const totalQuestions = attempts.length > 0 ? attempts.length : 48;
    const correctCount = attempts.length > 0 ? attempts.filter((a) => a.isCorrect).length : 37;
    const overallAccuracy = Math.round((correctCount / totalQuestions) * 100);

    // Calculate Success Track state
    let trackState: TrackState = 'GREEN';
    let trackScore = 88;

    if (missedTasks.length >= 3 || overallAccuracy < 50) {
      trackState = 'RED';
      trackScore = 42;
    } else if (missedTasks.length >= 1 || overallAccuracy < 65) {
      trackState = 'YELLOW';
      trackScore = 67;
    }

    return {
      trackState,
      trackScore,
      streakDays: 14,
      totalStudyHours: 58.5,
      totalPracticeQuestions: totalQuestions,
      overallAccuracy,
      weakTopics: ['IMU Bias Covariance Derivation', 'ROP Buffer Overflow', 'CAN Bus Frame Arbitration'],
      strongTopics: ['ROS 2 Zero-Copy Memory', 'Forward Kinematics Math', 'CSP Security Headers'],
      weeklyActivity: [
        { day: 'Mon', hours: 4.8, accuracy: 82 },
        { day: 'Tue', hours: 5.2, accuracy: 78 },
        { day: 'Wed', hours: 4.0, accuracy: 85 },
        { day: 'Thu', hours: 5.5, accuracy: 72 },
        { day: 'Fri', hours: 4.5, accuracy: 88 },
        { day: 'Sat', hours: 6.0, accuracy: 80 },
        { day: 'Sun', hours: 3.5, accuracy: 90 },
      ],
    };
  },

  getRecoveryPlan(): RecoveryPlan {
    const tasks = this.getTasks();
    const missed = tasks.filter((t) => !t.completed && t.isMissed).length;
    return {
      needed: missed > 0,
      missedWorkCount: missed,
      strategy: 'Distributed rebalancing over next 5 days',
      dailyExtraMinutes: missed > 0 ? 25 : 0,
      advice: missed > 0
        ? 'Do not cram everything tomorrow. We spread 2 deferred topics into Saturday buffer and kept your 7-hour sleep window protected.'
        : 'Workload is balanced and on track. Healthy momentum maintained.',
      rebalancedUntil: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    };
  },

  getLyraMessages(): LyraMessage[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LYRA_MESSAGES);
      if (data) return JSON.parse(data);
      return [
        {
          id: 'lyra_init',
          role: 'assistant',
          text: 'नमस्ते Suraj! मैं LYRA हूँ, आपकी AI गाइड। आपका Success Track इस समय GREEN (स्वस्थ) है। आज हमें LiDAR & IMU Sensor Fusion के 25 प्रश्न हल करने हैं। क्या आप तैयार हैं?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ];
    } catch {
      return [];
    }
  },

  saveLyraMessages(messages: LyraMessage[]): void {
    localStorage.setItem(STORAGE_KEYS.LYRA_MESSAGES, JSON.stringify(messages.slice(-50)));
  },

  getLyraConfig(): LyraConfig {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LYRA_CONFIG);
      return data ? JSON.parse(data) : DEFAULT_LYRA_CONFIG;
    } catch {
      return DEFAULT_LYRA_CONFIG;
    }
  },

  saveLyraConfig(config: LyraConfig): void {
    localStorage.setItem(STORAGE_KEYS.LYRA_CONFIG, JSON.stringify(config));
  },

  getLyraGreeting(mood: LyraMood, name: string = 'Suraj', trackState: TrackState = 'GREEN'): string {
    const greetings: Record<LyraMood, string[]> = {
      HAPPY: [
        `Hey ${name}! Good to see you. Today's mission is ready, let's make real progress! ✨`,
        `Welcome back ${name}! Your momentum is looking great today. What are we tackling first?`,
        `नमस्ते ${name}! आपकी ऊर्जा देखकर बहुत अच्छा लगा। चलिए आज का अभ्यास शुरू करते हैं!`,
      ],
      PLAYFUL: [
        `Look who's back! Ready to show that robotics track who's in charge, ${name}? 😉`,
        `Okay, that's an ambitious roadmap 😄. Let's see if your calendar can keep up today!`,
        `अरे वाह ${name}! समय पर आगमन? आज तो लगता है पूरा 50 MCQ सेट एक ही सांस में हल होगा!`,
      ],
      CALM: [
        `Welcome back, ${name}. Take a breath, center yourself, and let's review today's calm steps.`,
        `Quiet focus creates deep mastery. Let's look at today's tasks without rush.`,
        `नमस्ते ${name}। शांति से बैठिए। आज की दिशा पूरी तरह स्पष्ट है।`,
      ],
      FOCUSED: [
        `${name}, today's priority is sensor perception and pending practice. Let's execute.`,
        `Track status: ${trackState}. We have scheduled blocks waiting—ready to commence.`,
        `${name}, आज का लक्ष्य बिल्कुल स्पष्ट है। सीधे अभ्यास और गणना पर ध्यान केंद्रित करते हैं।`,
      ],
      MOTIVATOR: [
        `Consistency is where champions are built, ${name}! Even 1% daily compounding creates mastery. Let's go! 🚀`,
        `No hesitation today, ${name}! Your future company NEXORA starts with the discipline you show right now.`,
        `रुकना नहीं है ${name}! हर एक सवाल आपको आपकी मंजिल के और करीब ले जा रहा है। पूरा जोर लगाइए!`,
      ],
      SERIOUS: [
        `${name}, timeline analysis indicates precision execution is required on our primary milestones.`,
        `System state loaded. Let's conduct an objective review of today's workload commitments.`,
        `नमस्ते ${name}। आज का कार्यक्रम अत्यंत गंभीर और महत्वपूर्ण है। समय का सदुपयोग करते हैं।`,
      ],
      CUSTOM: [
        `Welcome back ${name}. LYRA is tuned to your personalized settings. Ready when you are.`,
        `नमस्ते ${name}, आपकी व्यक्तिगत सेटिंग्स के अनुसार मैं तैयार हूँ।`,
      ],
    };

    const list = greetings[mood] || greetings.HAPPY;
    return list[Math.floor(Math.random() * list.length)];
  },
};
