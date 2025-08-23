
import React, { useState, useCallback, useEffect } from 'react';
import { AppState, QuizQuestion, UserAnswer, QuizAnalysis, QuizMode, ApiProvider } from './types';
import { generateQuiz, analyzeQuiz } from './services/aiService';
import ConfigScreen from './components/ConfigScreen';
import QuizScreen from './components/QuizScreen';
import ResultsScreen from './components/ResultsScreen';
import ThemeToggle from './components/ThemeToggle';
import Spinner from './components/Spinner';
import ApiKeyModal from './components/ApiKeyModal';
import { SparklesIcon } from './components/icons/SparklesIcon';

const App: React.FC = () => {
  const [apiKey, setApiKey] = useState<string | null>(process.env.API_KEY || null);
  const [apiProvider, setApiProvider] = useState<ApiProvider>(ApiProvider.GOOGLE);
  const [appState, setAppState] = useState<AppState>(AppState.CONFIG);
  const [quizTopic, setQuizTopic] = useState<string>('');
  const [quizMode, setQuizMode] = useState<QuizMode>(QuizMode.STANDARD);
  const [openRouterModel, setOpenRouterModel] = useState<string>('google/gemma-2-9b-it');
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [analysis, setAnalysis] = useState<QuizAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = window.localStorage.getItem('theme');
      if (storedTheme === 'dark' || storedTheme === 'light') {
        return storedTheme;
      }
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  const handleApiKeySubmit = (key: string, provider: ApiProvider) => {
    setApiKey(key);
    setApiProvider(provider);
  };

  const handleToggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const handleStartQuiz = useCallback(async (topic: string, count: number, mode: QuizMode, model: string) => {
    if (!apiKey) {
        setError("API Key is missing. Please set it to continue.");
        return;
    }
    setAppState(AppState.GENERATING);
    setError(null);
    setQuizTopic(topic);
    setNumQuestions(count);
    setQuizMode(mode);
    setOpenRouterModel(model);

    try {
      const generatedQuestions = await generateQuiz({ apiKey, apiProvider, topic, numQuestions: count, mode, openRouterModel: model });
      if (generatedQuestions && generatedQuestions.length > 0) {
        setQuestions(generatedQuestions);
        setUserAnswers([]);
        setAnalysis(null);
        setAppState(AppState.TAKING_QUIZ);
      } else {
        throw new Error('The AI failed to generate a quiz. Please try a different topic or model.');
      }
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'An unknown error occurred while generating the quiz.');
      setAppState(AppState.CONFIG);
    }
  }, [apiKey, apiProvider]);

  const handleFinishQuiz = useCallback(async (answers: UserAnswer[]) => {
    if (!apiKey) {
        setError("API Key is missing. Please set it to continue.");
        setAppState(AppState.RESULTS);
        return;
    }
    setAppState(AppState.ANALYZING);
    setUserAnswers(answers);
    setError(null);
    try {
      const resultsToAnalyze = questions.map((q, i) => ({
        question: q.question,
        category: q.category,
        correctAnswer: q.correctAnswer,
        userAnswer: answers[i]?.answer || "Not Answered",
      }));

      const generatedAnalysis = await analyzeQuiz({ apiKey, apiProvider, topic: quizTopic, results: resultsToAnalyze, mode: quizMode, openRouterModel });
      setAnalysis(generatedAnalysis);
      setAppState(AppState.RESULTS);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'An unknown error occurred during analysis.');
      setAppState(AppState.RESULTS);
    }
  }, [apiKey, apiProvider, questions, quizTopic, quizMode, openRouterModel]);

  const handleRestart = () => {
    setAppState(AppState.CONFIG);
    setQuestions([]);
    setUserAnswers([]);
    setAnalysis(null);
    setError(null);
  };
  
  const renderContent = () => {
    switch (appState) {
      case AppState.GENERATING:
        return <div className="text-center"><Spinner /><p className="mt-4 text-lg text-slate-700 dark:text-slate-300">Generating your quiz on {quizTopic}...</p></div>;
      case AppState.TAKING_QUIZ:
        return <QuizScreen questions={questions} onFinish={handleFinishQuiz} />;
      case AppState.ANALYZING:
         return <div className="text-center"><Spinner /><p className="mt-4 text-lg text-slate-700 dark:text-slate-300">Analyzing your results...</p></div>;
      case AppState.RESULTS:
        return <ResultsScreen questions={questions} userAnswers={userAnswers} analysis={analysis} onRestart={handleRestart} />;
      case AppState.CONFIG:
      default:
        return <ConfigScreen
          onStartQuiz={handleStartQuiz}
          error={error}
          apiProvider={apiProvider}
          initialModel={openRouterModel}
        />;
    }
  };

  return (
    <>
      {!apiKey && <ApiKeyModal onApiKeySubmit={handleApiKeySubmit} />}
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-200 transition-colors duration-300">
        <div className="absolute top-4 right-4 z-10">
          <ThemeToggle theme={theme} onToggle={handleToggleTheme} />
        </div>
        <main className="container mx-auto px-4 py-8 flex flex-col items-center justify-start min-h-screen">
          <header className="text-center mb-8 w-full max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 text-transparent bg-clip-text flex items-center justify-center gap-3">
                  <SparklesIcon className="w-10 h-10 text-primary-500" />
                  AI QuizMaster
              </h1>
              <p className="mt-2 text-slate-600 dark:text-slate-400">Your personal AI-powered quiz generator.</p>
          </header>
          <div className="w-full max-w-3xl">
            {renderContent()}
          </div>
        </main>
      </div>
    </>
  );
};

export default App;