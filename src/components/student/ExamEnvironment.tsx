import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, AlertTriangle, LogOut, Trophy } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface Question {
  id: number;
  text: string;
  type: 'mcq' | 'written';
  options?: string[];
  marks: number;
  answer?: string;
}

interface Exam {
  id: number;
  name: string;
  subject: string;
  duration: string;
  questions: Question[];
  totalMarks: number;
  totalStudents: number;
}

const ExamEnvironment = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [exam, setExam] = useState<Exam | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [showConfirmLeave, setShowConfirmLeave] = useState(false);

  useEffect(() => {
    // In a real app, fetch exam data from API
    const mockExam: Exam = {
      id: 1,
      name: 'Mathematics Final',
      subject: 'Mathematics',
      duration: '3 hours',
      questions: [
        {
          id: 1,
          text: 'What is 2 + 2?',
          type: 'mcq',
          options: ['3', '4', '5', '6'],
          marks: 1
        },
        {
          id: 2,
          text: 'Explain the Pythagorean theorem.',
          type: 'written',
          marks: 5
        }
      ],
      totalMarks: 6,
      totalStudents: 50
    };
    setExam(mockExam);

    // Convert duration to seconds
    const durationMatch = mockExam.duration.match(/(\d+)/);
    if (durationMatch) {
      const hours = parseInt(durationMatch[1]);
      setTimeLeft(hours * 60 * 60);
    }
  }, [id]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(time => {
        if (time <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return time - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const calculateScore = () => {
    let totalScore = 0;
    exam?.questions.forEach(question => {
      if (answers[question.id]) {
        // In a real app, this would be handled by the backend
        if (question.type === 'mcq' && answers[question.id] === '4') {
          totalScore += question.marks;
        } else if (question.type === 'written') {
          // Simplified scoring for demo
          totalScore += (question.marks * 0.8); // Assume 80% score for written answers
        }
      }
    });
    return totalScore;
  };

  const calculateRank = (score: number) => {
    // Simulate other students' scores
    const otherScores = Array.from({ length: exam?.totalStudents || 0 }, () => 
      Math.random() * (exam?.totalMarks || 0)
    );
    
    // Add current student's score
    otherScores.push(score);
    
    // Sort in descending order
    otherScores.sort((a, b) => b - a);
    
    // Find rank (1-based index)
    const rank = otherScores.indexOf(score) + 1;
    
    return rank;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const score = calculateScore();
      const rank = calculateRank(score);
      
      // In a real app, submit answers to API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      navigate('/student', { 
        state: { 
          examCompleted: true,
          examName: exam?.name,
          score,
          totalMarks: exam?.totalMarks,
          rank,
          totalStudents: exam?.totalStudents
        } 
      });
    } catch (error) {
      console.error('Error submitting exam:', error);
      setIsSubmitting(false);
    }
  };

  const handleLeaveExam = () => {
    // In a real app, you might want to save the current state
    navigate('/student');
  };

  if (!exam) return null;

  const answeredQuestions = Object.keys(answers).length;
  const totalQuestions = exam.questions.length;
  const progress = (answeredQuestions / totalQuestions) * 100;

  const timeWarning = timeLeft <= 300; // 5 minutes warning

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Made more compact on mobile */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="h-14 sm:h-16 flex items-center justify-between">
            <div className="flex items-center flex-1 min-w-0">
              <button
                onClick={() => setShowConfirmLeave(true)}
                className="mr-2 sm:mr-4 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
              >
                <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
              <h1 className="text-base sm:text-lg font-semibold text-foreground truncate">
                {exam?.name}
              </h1>
            </div>
            <div className={`flex items-center gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full ${
              timeWarning ? 'bg-red-100 dark:bg-red-900' : 'bg-primary/10'
            }`}>
              <Clock className={`h-4 w-4 ${timeWarning ? 'text-red-600 dark:text-red-400' : 'text-primary'}`} />
              <span className={`font-mono text-sm ${
                timeWarning ? 'text-red-600 dark:text-red-400' : 'text-primary'
              }`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Adjusted padding and spacing for mobile */}
      <div className="pt-16 sm:pt-20 pb-24 sm:pb-32">
        <div className="max-w-4xl mx-auto px-3 sm:px-4">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm text-muted-foreground">
                Progress: {answeredQuestions}/{totalQuestions} questions answered
              </span>
              <span className="text-xs sm:text-sm font-medium text-primary">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {exam?.questions.map((question, index) => (
              <div key={question.id} className="bg-card rounded-lg sm:rounded-xl shadow-lg border border-border p-3 sm:p-6">
                <div className="flex justify-between items-start gap-2 sm:gap-4 mb-3 sm:mb-4">
                  <h3 className="text-sm sm:text-lg font-medium text-card-foreground">
                    Question {index + 1}
                  </h3>
                  <span className="text-xs sm:text-sm text-primary font-medium whitespace-nowrap">
                    {question.marks} marks
                  </span>
                </div>
                <p className="text-sm sm:text-base text-card-foreground mb-3 sm:mb-4">{question.text}</p>
                {question.type === 'mcq' ? (
                  <div className="space-y-2 sm:space-y-3">
                    {question.options?.map((option, optIndex) => (
                      <label
                        key={optIndex}
                        className={`flex items-center p-2 sm:p-4 rounded-lg border ${
                          answers[question.id] === option
                            ? 'border-primary bg-primary/5'
                            : 'border-input hover:border-primary/50'
                        } cursor-pointer transition-all duration-200`}
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option}
                          checked={answers[question.id] === option}
                          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                          className="sr-only"
                        />
                        <span className={`text-sm sm:text-base ${
                          answers[question.id] === option
                            ? 'text-primary font-medium'
                            : 'text-card-foreground'
                        }`}>
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <textarea
                    value={answers[question.id] || ''}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full h-24 sm:h-32 p-3 sm:p-4 rounded-lg border border-input bg-background text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer - Made more compact and better organized on mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="h-20 sm:h-24 flex flex-col sm:flex-row items-center justify-between gap-2 py-2 sm:py-4">
            <div className="hidden sm:flex items-center gap-4 text-sm text-muted-foreground">
              <span>Total marks: {exam?.totalMarks}</span>
              <span>Duration: {exam?.duration}</span>
            </div>
            <div className="flex w-full sm:w-auto gap-2">
              <button
                onClick={() => setShowConfirmSubmit(true)}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium
                         hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-200"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Exam'}
              </button>
              <button
                onClick={() => setShowConfirmLeave(true)}
                className="flex-1 sm:flex-none px-4 sm:px-6 py-2 text-destructive bg-destructive/10 rounded-lg text-sm font-medium
                         hover:bg-destructive/20 focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2
                         transition-all duration-200 flex items-center justify-center gap-2"
              >
                <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Leave Exam</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-[99999] p-4">
          <div className="bg-gradient-to-br from-white via-white to-red-50 dark:from-gray-900 dark:via-gray-900 dark:to-red-950 p-6 rounded-xl shadow-2xl border-2 border-red-100 dark:border-red-900 backdrop-blur-xl backdrop-saturate-150 animate-modal-appear max-w-md w-full relative">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center border-4 border-white dark:border-gray-900 shadow-xl">
              <AlertTriangle className="h-12 w-12 text-white" />
            </div>
            <div className="mt-12 text-center">
              <h3 className="text-lg font-bold text-card-foreground mb-2">Submit Exam?</h3>
              <p className="text-muted-foreground mb-6">
                Are you sure you want to submit your exam? This action cannot be undone.
                {answeredQuestions < totalQuestions && (
                  <span className="block mt-2 text-destructive">
                    Warning: You have {totalQuestions - answeredQuestions} unanswered questions!
                  </span>
                )}
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowConfirmSubmit(false)}
                  className="px-4 py-2 rounded-lg font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transform transition-all duration-200"
                >
                  Continue Exam
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-red-500 to-red-600 text-white hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transform transition-all duration-200"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Exam'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leave Confirmation Modal */}
      {showConfirmLeave && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-[99999] p-4">
          <div className="bg-gradient-to-br from-white via-white to-red-50 dark:from-gray-900 dark:via-gray-900 dark:to-red-950 p-6 rounded-xl shadow-2xl border-2 border-red-100 dark:border-red-900 backdrop-blur-xl backdrop-saturate-150 animate-modal-appear max-w-md w-full relative">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center border-4 border-white dark:border-gray-900 shadow-xl">
              <LogOut className="h-12 w-12 text-white" />
            </div>
            <div className="mt-12 text-center">
              <h3 className="text-lg font-bold text-card-foreground mb-2">Leave Exam?</h3>
              <p className="text-muted-foreground mb-6">
                Are you sure you want to leave the exam? Your progress will be lost and this action cannot be undone.
                {answeredQuestions > 0 && (
                  <span className="block mt-2 text-destructive">
                    Warning: You have answered {answeredQuestions} questions that will not be saved!
                  </span>
                )}
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowConfirmLeave(false)}
                  className="px-4 py-2 rounded-lg font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transform transition-all duration-200"
                >
                  Continue Exam
                </button>
                <button
                  onClick={handleLeaveExam}
                  className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-red-500 to-red-600 text-white hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transform transition-all duration-200"
                >
                  Leave Exam
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamEnvironment;