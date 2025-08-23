
import React, { useState } from 'react';
import { KeyIcon } from './icons/KeyIcon';
import { ApiProvider } from '../types';

interface ApiKeyModalProps {
  onApiKeySubmit: (apiKey: string, provider: ApiProvider) => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onApiKeySubmit }) => {
  const [key, setKey] = useState('');
  const [provider, setProvider] = useState<ApiProvider>(ApiProvider.GOOGLE);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim()) {
      onApiKeySubmit(key.trim(), provider);
    }
  };

  const getPlaceholderText = () => {
    switch (provider) {
      case ApiProvider.OPENROUTER:
        return "Enter your OpenRouter API Key (sk-or-...)";
      case ApiProvider.GOOGLE:
      default:
        return "Enter your Google AI API Key";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-md m-4">
        <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/50">
                <KeyIcon className="h-6 w-6 text-primary-600 dark:text-primary-400" aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-slate-800 dark:text-slate-100">
                Configure Your AI Provider
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Choose a provider and enter an API key to use the app. Your key is only used for this session.
            </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">AI Provider</label>
            <fieldset className="grid grid-cols-2 gap-4">
              {(Object.values(ApiProvider)).map((p) => (
                <div key={p}>
                  <input
                    type="radio"
                    name="provider"
                    value={p}
                    id={p}
                    checked={provider === p}
                    onChange={() => setProvider(p)}
                    className="sr-only"
                  />
                  <label
                    htmlFor={p}
                    className={`flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                      provider === p 
                      ? 'bg-primary-100 dark:bg-primary-900/50 border-primary-500 ring-2 ring-primary-500' 
                      : 'bg-slate-50 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{p}</span>
                  </label>
                </div>
              ))}
            </fieldset>
          </div>

          <div>
            <label htmlFor="api-key" className="sr-only">
              API Key
            </label>
            <input
              type="password"
              id="api-key"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder={getPlaceholderText()}
              className="mt-4 w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition"
              required
            />
          </div>
          <p className="text-xs text-center text-slate-500 dark:text-slate-400">
            For production, it's recommended to set the API_KEY as an environment variable (for Google AI only).
          </p>
          <button
            type="submit"
            disabled={!key.trim()}
            className="w-full bg-primary-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-500/50 transition-all duration-300 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed transform hover:scale-105"
          >
            Start QuizMaster
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApiKeyModal;