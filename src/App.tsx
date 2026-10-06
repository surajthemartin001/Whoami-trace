/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  Goal,
  PlanTask,
  AnalyticsData,
  Question,
  IntensityConfig,
  LyraConfig,
} from './types';
import { StorageService } from './services/storage';

// Navigation & Common Components
import { Navigation, NavigationSection } from './components/Navigation';
import { LyraModal } from './components/LyraModal';
import { LyraSettingsModal } from './components/LyraSettingsModal';
import { OnboardingModal } from './components/OnboardingModal';
import { UniversalImportModal } from './components/UniversalImportModal';
import { PracticeSessionModal } from './components/PracticeSessionModal';
import { ReassessmentModal } from './components/ReassessmentModal';
import { RecoveryModal } from './components/RecoveryModal';

// Views
import { HomeView } from './views/HomeView';
import { GoalsView } from './views/GoalsView';
import { ResourcesView } from './views/ResourcesView';
import { PlanView } from './views/PlanView';
import { PracticeView } from './views/PracticeView';
import { RevisionView } from './views/RevisionView';
import { QuestionsView } from './views/QuestionsView';
import { AnalyticsView } from './views/AnalyticsView';
import { NexoraView } from './views/NexoraView';
import { MyView } from './views/MyView';
import { SettingsView } from './views/SettingsView';

export default function App() {
  // Core user and data state from persistent storage
  const [user, setUser] = useState<UserProfile>(StorageService.getUserProfile());
  const [goals, setGoals] = useState<Goal[]>(StorageService.getGoals());
  const [tasks, setTasks] = useState<PlanTask[]>(StorageService.getTasks());
  const [analytics, setAnalytics] = useState<AnalyticsData>(StorageService.getAnalytics());
  // Helper to parse section from URL hash for GitHub Pages deep linking
  const getSectionFromHash = (): NavigationSection => {
    if (typeof window === 'undefined') return 'HOME';
    const hash = window.location.hash.replace('#', '').toUpperCase();
    const validSections: NavigationSection[] = [
      'HOME', 'GOALS', 'RESOURCES', 'PLAN', 'PRACTICE', 'REVISION', 'QUESTIONS', 'ANALYTICS', 'MY', 'NEXORA', 'SETTINGS'
    ];
    return validSections.includes(hash as NavigationSection) ? (hash as NavigationSection) : 'HOME';
  };

  const [currentSection, setCurrentSection] = useState<NavigationSection>(getSectionFromHash);
  const [lyraConfig, setLyraConfig] = useState<LyraConfig>(StorageService.getLyraConfig());

  // Listen to browser hash changes (back/forward navigation)
  useEffect(() => {
    const onHashChange = () => {
      setCurrentSection(getSectionFromHash());
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleNavigate = (section: NavigationSection) => {
    setCurrentSection(section);
    if (typeof window !== 'undefined') {
      window.location.hash = section.toLowerCase();
    }
  };

  // Modal states
  const [showOnboarding, setShowOnboarding] = useState(!user.isOnboarded);
  const [showLyra, setShowLyra] = useState(false);
  const [showLyraSettings, setShowLyraSettings] = useState(false);
  const [lyraInitialPrompt, setLyraInitialPrompt] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [showReassessment, setShowReassessment] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);

  // Active Practice Session state
  const [activePracticeQuestions, setActivePracticeQuestions] = useState<Question[] | null>(null);
  const [activePracticeTitle, setActivePracticeTitle] = useState('Practice Session');

  // Refresh analytics whenever tasks change
  const refreshAnalytics = () => {
    setAnalytics(StorageService.getAnalytics());
  };

  const handleTaskToggle = (taskId: string) => {
    const updated = tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t));
    StorageService.saveTasks(updated);
    setTasks(updated);
    refreshAnalytics();
  };

  const handleStartPracticeSession = (questions: Question[], title: string) => {
    setActivePracticeQuestions(questions);
    setActivePracticeTitle(title);
  };

  const handleOpenLyraWithPrompt = (prompt: string) => {
    setLyraInitialPrompt(prompt);
    setShowLyra(true);
  };

  const handleExecuteLyraAction = (action: any) => {
    if (!action) return;
    if (action.type === 'create_practice' || action.action === 'start_practice') {
      setShowLyra(false);
      const qs = StorageService.getQuestions();
      handleStartPracticeSession(qs.slice(0, 20), 'LYRA Curated Practice Pack');
    } else if (action.type === 'create_plan' || action.action === 'view_plan') {
      setShowLyra(false);
      handleNavigate('PLAN');
    } else if (action.type === 'recovery') {
      setShowLyra(false);
      setShowRecovery(true);
    } else if (action.type === 'reassess') {
      setShowLyra(false);
      setShowReassessment(true);
    } else if (action.type === 'navigate' && action.payload?.section) {
      setShowLyra(false);
      handleNavigate(action.payload.section);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Header & Mobile Nav Bar */}
      <Navigation
        currentSection={currentSection}
        onSelectSection={(sec) => handleNavigate(sec)}
        onOpenLyra={() => {
          setLyraInitialPrompt('');
          setShowLyra(true);
        }}
        trackScore={analytics.trackScore}
        lyraMood={lyraConfig.currentMood}
      />

      {/* Main View Container */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto pb-24 lg:pb-12">
        {currentSection === 'HOME' && (
          <HomeView
            user={user}
            goals={goals}
            tasks={tasks}
            analytics={analytics}
            onNavigate={(sec) => handleNavigate(sec as NavigationSection)}
            onOpenLyra={() => {
              setLyraInitialPrompt('');
              setShowLyra(true);
            }}
            onOpenImport={() => setShowImport(true)}
            onOpenPractice={() =>
              handleStartPracticeSession(
                StorageService.getQuestions().slice(0, 20),
                'Target Practice: 20 Questions'
              )
            }
            onOpenRecovery={() => setShowRecovery(true)}
            onTaskToggle={handleTaskToggle}
            lyraMood={lyraConfig.currentMood}
          />
        )}

        {currentSection === 'GOALS' && (
          <GoalsView
            goals={goals}
            onGoalsUpdated={(updated) => setGoals(updated)}
            onOpenLyraPrompt={handleOpenLyraWithPrompt}
          />
        )}

        {currentSection === 'RESOURCES' && (
          <ResourcesView
            resources={StorageService.getResources()}
            onOpenImport={() => setShowImport(true)}
            onOpenLyraPrompt={handleOpenLyraWithPrompt}
          />
        )}

        {currentSection === 'PLAN' && (
          <PlanView
            user={user}
            tasks={tasks}
            onTasksUpdated={(updated) => {
              setTasks(updated);
              refreshAnalytics();
            }}
            onOpenRecovery={() => setShowRecovery(true)}
          />
        )}

        {currentSection === 'PRACTICE' && (
          <PracticeView
            onStartSession={handleStartPracticeSession}
            onOpenLyraPrompt={handleOpenLyraWithPrompt}
          />
        )}

        {currentSection === 'REVISION' && (
          <RevisionView
            onStartRevisionSession={(qs) =>
              handleStartPracticeSession(qs, 'Spaced Active Recall Review')
            }
            onOpenLyraPrompt={handleOpenLyraWithPrompt}
          />
        )}

        {currentSection === 'QUESTIONS' && (
          <QuestionsView
            onStartSession={handleStartPracticeSession}
            onOpenImport={() => setShowImport(true)}
          />
        )}

        {currentSection === 'ANALYTICS' && (
          <AnalyticsView
            analytics={analytics}
            user={user}
            onOpenRecovery={() => setShowRecovery(true)}
          />
        )}

        {currentSection === 'NEXORA' && (
          <NexoraView onOpenLyraPrompt={handleOpenLyraWithPrompt} />
        )}

        {currentSection === 'MY' && (
          <MyView
            user={user}
            analytics={analytics}
            onOpenSettings={() => handleNavigate('SETTINGS')}
            onOpenLyra={() => {
              setLyraInitialPrompt('');
              setShowLyra(true);
            }}
          />
        )}

        {currentSection === 'SETTINGS' && (
          <SettingsView
            user={user}
            onUserUpdated={(u) => setUser(u)}
            onOpenReassessment={() => setShowReassessment(true)}
            lyraConfig={lyraConfig}
            onUpdateLyraConfig={(updatedCfg) => {
              setLyraConfig(updatedCfg);
              StorageService.saveLyraConfig(updatedCfg);
            }}
            onOpenLyraSettings={() => setShowLyraSettings(true)}
          />
        )}
      </main>

      {/* Global Modals */}
      <OnboardingModal
        isOpen={showOnboarding}
        onComplete={(completedUser) => {
          setUser(completedUser);
          setShowOnboarding(false);
        }}
      />

      <LyraModal
        isOpen={showLyra}
        onClose={() => setShowLyra(false)}
        onExecuteAction={handleExecuteLyraAction}
        initialMessage={lyraInitialPrompt}
      />

      <LyraSettingsModal
        isOpen={showLyraSettings}
        onClose={() => setShowLyraSettings(false)}
        config={lyraConfig}
        onSaveConfig={(updated) => {
          setLyraConfig(updated);
          StorageService.saveLyraConfig(updated);
        }}
      />

      <UniversalImportModal
        isOpen={showImport}
        onClose={() => setShowImport(false)}
        onQuestionsImported={() => refreshAnalytics()}
      />

      {activePracticeQuestions && (
        <PracticeSessionModal
          isOpen={Boolean(activePracticeQuestions)}
          questions={activePracticeQuestions}
          title={activePracticeTitle}
          onClose={() => setActivePracticeQuestions(null)}
          onFinish={() => refreshAnalytics()}
        />
      )}

      <ReassessmentModal
        isOpen={showReassessment}
        onClose={() => setShowReassessment(false)}
        onIntensityChanged={(newConfig: IntensityConfig) => {
          const updated = { ...user, currentIntensity: newConfig };
          setUser(updated);
          setShowReassessment(false);
        }}
      />

      <RecoveryModal
        isOpen={showRecovery}
        onClose={() => setShowRecovery(false)}
        onRecoveryApplied={() => {
          setTasks(StorageService.getTasks());
          refreshAnalytics();
        }}
      />
    </div>
  );
}
