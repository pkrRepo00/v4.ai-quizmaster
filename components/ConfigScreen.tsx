
import React, { useState } from 'react';
import { QuizMode, ApiProvider } from '../types';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface ConfigScreenProps {
  onStartQuiz: (topic: string, count: number, mode: QuizMode, model: string) => void;
  error: string | null;
  apiProvider: ApiProvider;
  initialModel: string;
}

const popularTopics = ["The Solar System", "JavaScript Fundamentals", "World War II", "Famous Paintings"];

const ConfigScreen: React.FC<ConfigScreenProps> = ({ onStartQuiz, error, apiProvider, initialModel }) => {
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(5);
  const [mode, setMode] = useState<QuizMode>(QuizMode.STANDARD);
  const [openRouterModel, setOpenRouterModel] = useState(initialModel);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim() && (apiProvider === ApiProvider.GOOGLE || openRouterModel.trim())) {
      onStartQuiz(topic, count, mode, openRouterModel);
    }
  };
  
  const handleTopicSuggestion = (suggestedTopic: string) => {
    setTopic(suggestedTopic);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 w-full transition-colors duration-300">
      <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-100 mb-6">Create Your Quiz</h2>
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg relative mb-6" role="alert">
          <strong className="font-bold">Oops! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Quiz Topic
          </label>
          <input
            type="text"
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., 'The Roman Empire' or 'React.js Hooks'"
            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
            required
          />
        </div>

        <div className="text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">- or try one of these -</p>
            <div className="flex flex-wrap justify-center gap-2">
                {popularTopics.map(popularTopic => (
                    <button
                        type="button"
                        key={popularTopic}
                        onClick={() => handleTopicSuggestion(popularTopic)}
                        className="px-3 py-1 text-sm bg-slate-100 dark:bg-slate-700 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/50 text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition"
                    >
                        {popularTopic}
                    </button>
                ))}
            </div>
        </div>
        
        {apiProvider === ApiProvider.OPENROUTER && (
            <div>
                <label htmlFor="model" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    OpenRouter Model
                </label>
                <input
                    type="text"
                    id="model"
                    value={openRouterModel}
                    onChange={(e) => setOpenRouterModel(e.target.value)}
                    placeholder="e.g., 'google/gemma-2-9b-it'"
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
                    required
                />
            </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="count" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Number of Questions
            </label>
            <div className="relative">
              <select
                id="count"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full appearance-none rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 pr-8 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 dark:border-slate-600 dark:bg-slate-700 transition"
                required
              >
                <option value="3">3 Questions</option>
                <option value="5">5 Questions</option>
                <option value="10">10 Questions</option>
                <option value="15">15 Questions</option>
                <option value="20">20 Questions</option>
                <option value="25">25 Questions</option>
                <option value="30">30 Questions</option>
                <option value="40">40 Questions</option>
                <option value="50">50 Questions</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700 dark:text-slate-300">
                <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="mode" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              AI Personality
            </label>
            <div className="relative">
              <select
                id="mode"
                value={mode}
                onChange={(e) => setMode(e.target.value as QuizMode)}
                className="w-full appearance-none rounded-lg border border-slate-300 bg-slate-50 px-4 py-2 pr-8 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 dark:border-slate-600 dark:bg-slate-700 transition"
                required
              >
                {Object.values(QuizMode).map((modeValue) => (
                  <option key={modeValue} value={modeValue}>{modeValue}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700 dark:text-slate-300">
                <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={!topic.trim() || (apiProvider === ApiProvider.OPENROUTER && !openRouterModel.trim())}
          className="w-full bg-primary-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-500/50 transition-all duration-300 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transform hover:scale-105"
        >
          Generate Quiz
        </button>
      </form>
    </div>
  );
};

export default ConfigScreen;