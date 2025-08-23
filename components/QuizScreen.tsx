
import React, { useState, useEffect, useCallback } from 'react';
import { QuizQuestion, UserAnswer } from '../types';
import { useTimer } from '../hooks/useTimer';

interface QuizScreenProps {
  questions: QuizQuestion[];
  onFinish: (answers: UserAnswer[]) => void;
}

const QuizScreen: React.FC<QuizScreenProps> = ({ questions, onFinish }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>(Array(questions.length).fill(null));
  const [isTimeUp, setIsTimeUp] = useState(false);

  const QUIZ_DURATION_SECONDS = questions.length * 30; // 30 seconds per question

  const handleTimeUp = useCallback(() => {
    setIsTimeUp(true);
    // Auto-submit when time is up
    const finalAnswers = questions.map((q, index) => ({
        question: q.question,
        answer: selectedAnswers[index] || "Not Answered",
        isCorrect: q.correctAnswer === selectedAnswers[index],
    }));
    onFinish(finalAnswers);
  }, [onFinish, questions, selectedAnswers]);

  const { formattedTime } = useTimer(QUIZ_DURATION_SECONDS, handleTimeUp);
  
  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setSelectedAnswers(newAnswers);
  };

  const goToNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    const finalAnswers: UserAnswer[] = questions.map((q, index) => ({
      question: q.question,
      answer: selectedAnswers[index] || "Not Answered",
      isCorrect: q.correctAnswer === selectedAnswers[index],
    }));
    onFinish(finalAnswers);
  };
  
  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 w-full transition-colors duration-300">
      {isTimeUp && 
        <div className="absolute inset-0 bg-white/70 dark:bg-black/70 flex items-center justify-center z-10 rounded-xl">
            <div className="text-center p-8 bg-white dark:bg-slate-800 rounded-lg shadow-2xl">
                <h2 className="text-2xl font-bold text-red-500">Time's Up!</h2>
                <p className="mt-2 text-slate-600 dark:text-slate-400">Submitting your answers...</p>
            </div>
        </div>
      }
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Question {currentQuestionIndex + 1} of {questions.length}</span>
        <div className="text-lg font-bold text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/50 px-4 py-1 rounded-full">
          {formattedTime}
        </div>
      </div>

      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mb-6">
        <div className="bg-primary-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
      </div>

      <div key={currentQuestionIndex} className="animate-fade-in">
        <h3 className="text-xl md:text-2xl font-semibold mb-6 text-slate-800 dark:text-slate-100">{currentQuestion.question}</h3>
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              className={`w-full text-left p-4 rounded-lg border-2 transform transition-all duration-200
                ${selectedAnswers[currentQuestionIndex] === option
                  ? 'bg-primary-100 dark:bg-primary-900/50 border-primary-500 ring-2 ring-primary-500 scale-102'
                  : 'bg-slate-50 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-primary-400 dark:hover:border-primary-500 hover:scale-102'
                }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button onClick={goToPrev} disabled={currentQuestionIndex === 0} className="px-6 py-2 font-semibold text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition">
          Previous
        </button>
        {currentQuestionIndex === questions.length - 1 ? (
          <button onClick={handleSubmit} className="px-6 py-2 font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500/50 transition transform hover:scale-105">
            Submit
          </button>
        ) : (
          <button onClick={goToNext} className="px-6 py-2 font-bold text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-500/50 transition">
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizScreen;