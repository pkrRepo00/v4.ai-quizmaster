
import React from 'react';
import { QuizQuestion, UserAnswer, QuizAnalysis } from '../types';
import { CheckIcon } from './icons/CheckIcon';
import { XIcon } from './icons/XIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import ScoreDonut from './ScoreDonut';

interface ResultsScreenProps {
  questions: QuizQuestion[];
  userAnswers: UserAnswer[];
  analysis: QuizAnalysis | null;
  onRestart: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ questions, userAnswers, analysis, onRestart }) => {
  const correctAnswersCount = userAnswers.filter(a => a.isCorrect).length;
  const totalQuestions = questions.length;
  const scorePercentage = totalQuestions > 0 ? Math.round((correctAnswersCount / totalQuestions) * 100) : 0;

  const getPerformanceTier = (percentage: number) => {
    if (percentage === 100) return { title: "Quiz Master", emoji: "👑", color: "text-amber-400" };
    if (percentage >= 80) return { title: "Expert", emoji: "🏆", color: "text-green-400" };
    if (percentage >= 60) return { title: "Prodigy", emoji: "🧠", color: "text-blue-400" };
    if (percentage >= 40) return { title: "Apprentice", emoji: "📖", color: "text-indigo-400" };
    return { title: "Beginner", emoji: "🌱", color: "text-slate-400" };
  };

  const tier = getPerformanceTier(scorePercentage);

  return (
    <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 w-full transition-colors duration-300">
      <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-100 mb-6">Quiz Results</h2>
      
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
        <div className="relative">
          <ScoreDonut percentage={scorePercentage} />
        </div>
        <div className="text-center md:text-left">
          <p className="text-lg text-slate-600 dark:text-slate-400">You scored</p>
          <p className="text-5xl font-bold text-primary-600 dark:text-primary-400">{correctAnswersCount} / {totalQuestions}</p>
          <div className={`mt-2 text-xl font-semibold flex items-center justify-center md:justify-start gap-2 ${tier.color}`}>
            <span className="text-2xl">{tier.emoji}</span>
            <span>{tier.title}</span>
          </div>
        </div>
      </div>
      
      {analysis && (
        <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-lg mb-8 border border-slate-200 dark:border-slate-700">
          <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <SparklesIcon className="w-6 h-6 text-primary-500" />
            AI-Powered Analysis
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-green-600 dark:text-green-400">Strong Areas</h4>
              <p className="text-slate-600 dark:text-slate-300">{analysis.strongAreas.length > 0 ? analysis.strongAreas.join(', ') : 'None identified'}</p>
            </div>
            <div>
              <h4 className="font-semibold text-amber-600 dark:text-amber-400">Weak Areas</h4>
              <p className="text-slate-600 dark:text-slate-300">{analysis.weakAreas.length > 0 ? analysis.weakAreas.join(', ') : 'None identified, great job!'}</p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-700 dark:text-slate-300">Overall Feedback</h4>
              <p className="italic text-slate-600 dark:text-slate-400">"{analysis.overallFeedback}"</p>
            </div>
          </div>
        </div>
      )}
      
      <div>
        <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-200">Answer Review</h3>
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {questions.map((q, index) => {
            const userAnswer = userAnswers[index];
            const isCorrect = userAnswer.isCorrect;
            return (
              <div key={index} className="p-4 rounded-lg border-l-4 bg-slate-50 dark:bg-slate-700/50" style={{borderColor: isCorrect ? '#22c55e' : '#ef4444'}}>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mb-2">{q.question}</p>
                <div className="flex items-center space-x-2 text-sm">
                    {isCorrect ? <CheckIcon className="w-5 h-5 text-green-500" /> : <XIcon className="w-5 h-5 text-red-500" />}
                    <span className={`font-medium ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        Your answer: {userAnswer.answer}
                    </span>
                </div>
                {!isCorrect && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Correct answer: {q.correctAnswer}</p>
                )}
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2"><span className="font-semibold">Explanation:</span> {q.explanation}</p>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="text-center mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
        <button onClick={onRestart} className="w-full sm:w-auto bg-primary-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-500/50 transition-all duration-300 transform hover:scale-105">
          Take Another Quiz
        </button>
        <button onClick={() => alert('Sharing functionality coming soon!')} className="w-full sm:w-auto bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-3 px-8 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 focus:outline-none focus:ring-4 focus:ring-slate-500/50 transition-all duration-300">
          Share Score
        </button>
      </div>
    </div>
  );
};

export default ResultsScreen;