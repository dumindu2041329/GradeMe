import React, { useState, useEffect } from 'react';
import { Award, BookOpen, BarChart2, ArrowRight, Trophy } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import StudentHeader from './StudentHeader';

interface ExamResult {
  id: number;
  exam: string;
  score: number;
  totalMarks: number;
  date: string;
  rank: number;
  totalStudents: number;
}

interface AvailableExam {
  id: number;
  name: string;
  subject: string;
  date: string;
  duration: string;
  totalMarks: number;
}

const StudentDashboard = () => {
  const location = useLocation();
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completedExam, setCompletedExam] = useState<{
    examName: string;
    score: number;
    totalMarks: number;
    rank: number;
    totalStudents: number;
  } | null>(null);
  const [examResults, setExamResults] = useState<ExamResult[]>([
    {
      id: 1,
      exam: 'Mathematics Final',
      score: 85,
      totalMarks: 100,
      date: '2024-03-20',
      rank: 3,
      totalStudents: 50
    },
    {
      id: 2,
      exam: 'Physics Mid-term',
      score: 92,
      totalMarks: 100,
      date: '2024-03-15',
      rank: 1,
      totalStudents: 45
    },
    {
      id: 3,
      exam: 'Chemistry Quiz',
      score: 78,
      totalMarks: 100,
      date: '2024-03-10',
      rank: 5,
      totalStudents: 48
    }
  ]);

  const [availableExams] = useState<AvailableExam[]>([
    {
      id: 1,
      name: 'Biology Final',
      subject: 'Biology',
      date: '2024-03-25',
      duration: '2 hours',
      totalMarks: 100
    },
    {
      id: 2,
      name: 'English Literature',
      subject: 'English',
      date: '2024-03-28',
      duration: '1 hour 30 minutes',
      totalMarks: 75
    }
  ]);

  useEffect(() => {
    if (location.state?.examCompleted) {
      setCompletedExam({
        examName: location.state.examName,
        score: location.state.score,
        totalMarks: location.state.totalMarks,
        rank: location.state.rank,
        totalStudents: location.state.totalStudents
      });
      setShowCompletionModal(true);
    }
  }, [location]);

  const calculateAverage = () => {
    const total = examResults.reduce((acc, result) => acc + (result.score / result.totalMarks) * 100, 0);
    return (total / examResults.length).toFixed(1);
  };

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.classList.toggle('dark', newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  return (
    <div className="min-h-screen bg-background">
      <StudentHeader isDark={isDark} toggleTheme={toggleTheme} />

      {/* Main Content - Adjusted top padding for better spacing */}
      <div className="pt-[84px] sm:pt-[96px] px-3 sm:px-6 lg:px-8 pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Student Dashboard</h1>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-card rounded-lg sm:rounded-xl shadow-lg border border-border p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="bg-primary/10 rounded-full p-2 sm:p-3">
                  <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Total Exams</p>
                  <p className="text-lg sm:text-2xl font-bold text-card-foreground">{examResults.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg sm:rounded-xl shadow-lg border border-border p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="bg-primary/10 rounded-full p-2 sm:p-3">
                  <BarChart2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Average Score</p>
                  <p className="text-lg sm:text-2xl font-bold text-card-foreground">{calculateAverage()}%</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg sm:rounded-xl shadow-lg border border-border p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="bg-primary/10 rounded-full p-2 sm:p-3">
                  <Award className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Best Rank</p>
                  <p className="text-lg sm:text-2xl font-bold text-card-foreground">
                    {Math.min(...examResults.map(r => r.rank))}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Available Exams */}
          {availableExams.length > 0 && (
            <div className="bg-card rounded-lg sm:rounded-xl shadow-lg border border-border overflow-hidden mb-6 sm:mb-8">
              <div className="p-4 sm:p-6 border-b border-border">
                <h2 className="text-lg sm:text-xl font-semibold text-card-foreground">Available Exams</h2>
              </div>
              <div className="divide-y divide-border">
                {availableExams.map(exam => (
                  <div key={exam.id} className="p-3 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                      <div>
                        <h3 className="text-base sm:text-lg font-medium text-card-foreground">{exam.name}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">{exam.subject}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="text-xs sm:text-sm text-muted-foreground">Date: {exam.date}</span>
                          <span className="text-xs sm:text-sm text-muted-foreground">Duration: {exam.duration}</span>
                          <span className="text-xs sm:text-sm text-muted-foreground">Marks: {exam.totalMarks}</span>
                        </div>
                      </div>
                      <Link
                        to={`/student/exams/${exam.id}`}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors w-full sm:w-auto"
                      >
                        Start Exam
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Exam History */}
          <div className="bg-card rounded-lg sm:rounded-xl shadow-lg border border-border overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-border">
              <h2 className="text-lg sm:text-xl font-semibold text-card-foreground">Exam History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted">
                    <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm text-muted-foreground">Exam</th>
                    <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm text-muted-foreground hidden sm:table-cell">Date</th>
                    <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm text-muted-foreground">Score</th>
                    <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm text-muted-foreground hidden sm:table-cell">Rank</th>
                  </tr>
                </thead>
                <tbody>
                  {examResults.map((result) => (
                    <tr key={result.id} className="border-b border-border">
                      <td className="py-3 px-3 sm:px-4">
                        <div>
                          <p className="text-sm sm:text-base text-card-foreground font-medium">{result.exam}</p>
                          <p className="text-xs text-muted-foreground sm:hidden mt-1">{result.date}</p>
                        </div>
                      </td>
                      <td className="py-3 px-3 sm:px-4 text-sm text-muted-foreground hidden sm:table-cell">{result.date}</td>
                      <td className="py-3 px-3 sm:px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-12 sm:w-24 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${(result.score / result.totalMarks) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs sm:text-sm text-card-foreground font-medium whitespace-nowrap">
                            {result.score}/{result.totalMarks}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground sm:hidden mt-1">
                          Rank: {result.rank} of {result.totalStudents}
                        </p>
                      </td>
                      <td className="py-3 px-3 sm:px-4 hidden sm:table-cell">
                        <span className="inline-flex items-center gap-1 text-sm text-card-foreground">
                          <span className="font-medium">{result.rank}</span>
                          <span className="text-muted-foreground text-xs">
                            of {result.totalStudents}
                          </span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Exam Completion Modal */}
      {showCompletionModal && completedExam && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-[99999] p-4">
          <div className="bg-gradient-to-br from-white via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-950 p-6 rounded-xl shadow-2xl border-2 border-indigo-100 dark:border-indigo-900 backdrop-blur-xl backdrop-saturate-150 animate-modal-appear max-w-md w-full relative">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center border-4 border-white dark:border-gray-900 shadow-xl">
              <Trophy className="h-12 w-12 text-white" />
            </div>
            <div className="mt-12 text-center">
              <h3 className="text-xl font-bold text-card-foreground mb-2">
                Exam Completed!
              </h3>
              <p className="text-muted-foreground mb-6">
                {completedExam.examName}
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-primary/10 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Score</p>
                  <p className="text-2xl font-bold text-primary">
                    {completedExam.score}/{completedExam.totalMarks}
                  </p>
                </div>
                <div className="bg-primary/10 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Class Rank</p>
                  <p className="text-2xl font-bold text-primary">
                    {completedExam.rank}/{completedExam.totalStudents}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCompletionModal(false)}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium
                         hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                         transition-all duration-200"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;