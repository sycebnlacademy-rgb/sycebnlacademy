import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ProgressContext = createContext();

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

export const ProgressProvider = ({ children }) => {
  const { user } = useAuth();
  const [progress, setProgress] = useState({});
  const [quizResults, setQuizResults] = useState({});

  // Charger la progression depuis le localStorage
  useEffect(() => {
    if (user) {
      loadUserProgress();
    }
  }, [user]);

  const loadUserProgress = () => {
    try {
      const savedProgress = localStorage.getItem(`sycebnl_progress_${user.id}`);
      const savedQuizResults = localStorage.getItem(`sycebnl_quiz_results_${user.id}`);
      
      if (savedProgress) {
        setProgress(JSON.parse(savedProgress));
      }
      
      if (savedQuizResults) {
        setQuizResults(JSON.parse(savedQuizResults));
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la progression:', error);
    }
  };

  const saveProgress = (newProgress) => {
    if (user) {
      localStorage.setItem(`sycebnl_progress_${user.id}`, JSON.stringify(newProgress));
      setProgress(newProgress);
    }
  };

  const saveQuizResults = (newResults) => {
    if (user) {
      localStorage.setItem(`sycebnl_quiz_results_${user.id}`, JSON.stringify(newResults));
      setQuizResults(newResults);
    }
  };

  // Marquer un chapitre comme complété
  const completeChapter = (moduleId, chapterId, score = 0) => {
    const newProgress = {
      ...progress,
      [moduleId]: {
        ...progress[moduleId],
        [chapterId]: {
          completed: true,
          score,
          completedAt: new Date().toISOString(),
          attempts: (progress[moduleId]?.[chapterId]?.attempts || 0) + 1
        }
      }
    };
    saveProgress(newProgress);
  };

  // Sauvegarder les résultats d'un quiz
  const saveQuizResult = (moduleId, chapterId, result) => {
    const newResults = {
      ...quizResults,
      [moduleId]: {
        ...quizResults[moduleId],
        [chapterId]: {
          ...result,
          completedAt: new Date().toISOString()
        }
      }
    };
    saveQuizResults(newResults);

    // Si le quiz est réussi (80% ou plus), marquer le chapitre comme complété
    if (result.passed) {
      completeChapter(moduleId, chapterId, result.score);
    }
  };

  // Sauvegarder les résultats d'un quiz final de module
  const saveFinalQuizResult = (moduleId, result) => {
    const newResults = {
      ...quizResults,
      [moduleId]: {
        ...quizResults[moduleId],
        final: {
          ...result,
          completedAt: new Date().toISOString()
        }
      }
    };
    saveQuizResults(newResults);

    // Si le quiz final est réussi, marquer le module comme complété
    if (result.passed) {
      const newProgress = {
        ...progress,
        [moduleId]: {
          ...progress[moduleId],
          completed: true,
          finalScore: result.score,
          completedAt: new Date().toISOString()
        }
      };
      saveProgress(newProgress);
    }
  };

  // Vérifier si un chapitre est complété
  const isChapterCompleted = (moduleId, chapterId) => {
    return progress[moduleId]?.[chapterId]?.completed || false;
  };

  // Vérifier si un module est complété
  const isModuleCompleted = (moduleId) => {
    return progress[moduleId]?.completed || false;
  };

  // Obtenir le score d'un chapitre
  const getChapterScore = (moduleId, chapterId) => {
    return progress[moduleId]?.[chapterId]?.score || 0;
  };

  // Obtenir les résultats d'un quiz
  const getQuizResult = (moduleId, chapterId) => {
    return quizResults[moduleId]?.[chapterId];
  };

  // Obtenir les résultats du quiz final
  const getFinalQuizResult = (moduleId) => {
    return quizResults[moduleId]?.final;
  };

  // Calculer la progression globale
  const getOverallProgress = () => {
    const totalModules = 6; // Nombre total de modules
    const completedModules = Object.keys(progress).filter(moduleId => 
      progress[moduleId]?.completed
    ).length;
    
    return Math.round((completedModules / totalModules) * 100);
  };

  // Calculer la progression d'un module
  const getModuleProgress = (moduleId, totalChapters) => {
    if (!progress[moduleId]) return 0;
    
    const completedChapters = Object.keys(progress[moduleId]).filter(chapterId => 
      chapterId !== 'completed' && 
      chapterId !== 'finalScore' && 
      chapterId !== 'completedAt' &&
      progress[moduleId][chapterId]?.completed
    ).length;
    
    return Math.round((completedChapters / totalChapters) * 100);
  };

  // Vérifier si l'utilisateur peut accéder à un module
  const canAccessModule = (moduleId, isFree, isPremium) => {
    if (isFree) return true;
    return isPremium;
  };

  // Vérifier si l'utilisateur peut générer son certificat
  const canGenerateCertificate = () => {
    const totalModules = 6;
    const completedModules = Object.keys(progress).filter(moduleId => 
      progress[moduleId]?.completed
    ).length;
    
    return completedModules === totalModules && user?.isPremium;
  };

  // Réinitialiser la progression (pour les tests)
  const resetProgress = () => {
    if (user) {
      localStorage.removeItem(`sycebnl_progress_${user.id}`);
      localStorage.removeItem(`sycebnl_quiz_results_${user.id}`);
      setProgress({});
      setQuizResults({});
    }
  };

  const value = {
    progress,
    quizResults,
    completeChapter,
    saveQuizResult,
    saveFinalQuizResult,
    isChapterCompleted,
    isModuleCompleted,
    getChapterScore,
    getQuizResult,
    getFinalQuizResult,
    getOverallProgress,
    getModuleProgress,
    canAccessModule,
    canGenerateCertificate,
    resetProgress
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};

