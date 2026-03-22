import { useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useTraining } from '../context/TrainingContext';
import { ViewType } from '../types';

export interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
}

interface QuizProps {
    moduleId: ViewType;
    questions: Question[];
    passingScore?: number; // percentage required to pass (default 80)
}

export function Quiz({ moduleId, questions, passingScore = 80 }: QuizProps) {
    const { toggleChecklistItem, checklistItems } = useTraining();

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    const item = checklistItems.find((i) => i.id === moduleId);
    const isCompleted = item?.completed ?? false;

    const handleSelect = (optionIndex: number) => {
        if (isSubmitted) return;
        setSelectedAnswers({
            ...selectedAnswers,
            [currentQuestion]: optionIndex,
        });
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleSubmit = () => {
        setIsSubmitted(true);
        const score = calculateScore();
        if (score >= passingScore && !isCompleted) {
            toggleChecklistItem(moduleId);
        }
    };

    const handleRetry = () => {
        setSelectedAnswers({});
        setCurrentQuestion(0);
        setIsSubmitted(false);
    };

    const calculateScore = () => {
        let correct = 0;
        questions.forEach((q, index) => {
            if (selectedAnswers[index] === q.correctAnswer) {
                correct++;
            }
        });
        return Math.round((correct / questions.length) * 100);
    };

    const isAllAnswered = Object.keys(selectedAnswers).length === questions.length;
    const score = isSubmitted ? calculateScore() : 0;
    const hasPassed = score >= passingScore;

    if (isCompleted && !isSubmitted) {
        return (
            <div className="bg-success/10 border-2 border-success/30 rounded-2xl p-8 mt-8 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">Module Certified</h3>
                <p className="text-neutral-600 max-w-md">
                    You have already passed the certification quiz for this module. You can proceed to the next section.
                </p>
                <button
                    onClick={handleRetry}
                    className="mt-6 flex items-center gap-2 text-gold-600 hover:text-gold-700 font-medium"
                >
                    <RefreshCw className="w-4 h-4" />
                    Retake Quiz for Practice
                </button>
            </div>
        );
    }

    if (isSubmitted) {
        return (
            <div className={`border-2 rounded-2xl p-8 mt-8 ${hasPassed ? 'bg-success/5 border-success/30' : 'bg-error/5 border-error/30'}`}>
                <div className="flex flex-col items-center text-center mb-8">
                    {hasPassed ? (
                        <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mb-4">
                            <CheckCircle2 className="w-8 h-8 text-white" />
                        </div>
                    ) : (
                        <div className="w-16 h-16 bg-error rounded-full flex items-center justify-center mb-4">
                            <XCircle className="w-8 h-8 text-white" />
                        </div>
                    )}

                    <h3 className="text-3xl font-bold text-neutral-900 mb-2">
                        {score}% Score
                    </h3>
                    <p className="text-neutral-600 text-lg">
                        {hasPassed
                            ? 'Congratulations! You passed the module certification.'
                            : `You need ${passingScore}% to pass. Please review the material and try again.`}
                    </p>
                </div>

                <div className="space-y-6">
                    <h4 className="font-bold text-neutral-900 border-b border-neutral-200 pb-2">Review Your Answers</h4>
                    {questions.map((q, index) => {
                        const isCorrect = selectedAnswers[index] === q.correctAnswer;
                        const didAnswer = selectedAnswers[index] !== undefined;

                        return (
                            <div key={q.id} className={`p-4 rounded-xl border ${isCorrect ? 'bg-success/5 border-success/20' : 'bg-error/5 border-error/20'}`}>
                                <div className="flex items-start gap-3">
                                    {isCorrect ? (
                                        <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                                    ) : (
                                        <XCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                                    )}
                                    <div>
                                        <p className="font-medium text-neutral-900 mb-2">{index + 1}. {q.question}</p>
                                        <p className="text-sm text-neutral-600 mb-1">
                                            <span className="font-semibold">Your Answer: </span>
                                            {didAnswer ? q.options[selectedAnswers[index]] : 'Not answered'}
                                        </p>
                                        {!isCorrect && (
                                            <p className="text-sm text-success mb-2">
                                                <span className="font-semibold">Correct Answer: </span>
                                                {q.options[q.correctAnswer]}
                                            </p>
                                        )}
                                        <div className="mt-2 bg-white/50 p-3 rounded-lg text-sm text-neutral-700">
                                            <strong>Explanation:</strong> {q.explanation}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-8 flex justify-center">
                    {!hasPassed && (
                        <button
                            onClick={handleRetry}
                            className="flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white font-medium rounded-lg hover:bg-neutral-800 transition-colors"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Retake Quiz
                        </button>
                    )}
                </div>
            </div>
        );
    }

    const question = questions[currentQuestion];

    return (
        <div className="bg-white rounded-2xl border-2 border-neutral-200 p-8 mt-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
                    <AlertCircle className="w-6 h-6 text-gold-600" />
                    Module Certification Quiz
                </h3>
                <div className="text-sm font-semibold text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full">
                    Question {currentQuestion + 1} of {questions.length}
                </div>
            </div>

            <div className="mb-8">
                <h4 className="text-lg font-medium text-neutral-900 mb-4 bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                    {question.question}
                </h4>
                <div className="space-y-3">
                    {question.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleSelect(index)}
                            className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${selectedAnswers[currentQuestion] === index
                                    ? 'bg-gold-50 border-gold-500 ring-1 ring-gold-500'
                                    : 'bg-white border-neutral-200 hover:border-gold-300 hover:bg-neutral-50'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${selectedAnswers[currentQuestion] === index ? 'border-gold-600' : 'border-neutral-300'
                                    }`}>
                                    {selectedAnswers[currentQuestion] === index && (
                                        <div className="w-2.5 h-2.5 bg-gold-600 rounded-full" />
                                    )}
                                </div>
                                <span className="text-neutral-700">{option}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-neutral-200">
                <button
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    className="px-6 py-2.5 rounded-lg font-medium text-neutral-600 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Previous
                </button>

                {currentQuestion === questions.length - 1 ? (
                    <button
                        onClick={handleSubmit}
                        disabled={!isAllAnswered}
                        className={`px-8 py-2.5 rounded-lg font-medium transition-colors ${isAllAnswered
                                ? 'bg-gold-600 text-white hover:bg-gold-700 shadow-sm'
                                : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                            }`}
                    >
                        Submit Quiz
                    </button>
                ) : (
                    <button
                        onClick={handleNext}
                        className="px-6 py-2.5 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 transition-colors"
                    >
                        Next Question
                    </button>
                )}
            </div>
        </div>
    );
}
