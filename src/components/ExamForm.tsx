import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Search, Edit, Trash, AlertTriangle } from 'lucide-react';
import { examAPI } from '../services/api';

interface Question {
  id: number;
  text: string;
  type: 'mcq' | 'written';
  options?: string[];
  marks: number;
}

interface Exam {
  id: number;
  name: string;
  subject: string;
  date: string;
  duration: string;
  status: 'upcoming' | 'active' | 'completed';
  questions: Question[];
  totalMarks: number;
}

interface FormErrors {
  name?: string;
  subject?: string;
  date?: string;
  marks?: string;
  text?: string;
  options?: string;
}

interface DeletePromptProps {
  isOpen: boolean;
  questionId: number | null;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeletePrompt: React.FC<DeletePromptProps> = ({
  isOpen,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-[99999]">
      <div className="bg-gradient-to-br from-white via-white to-red-50 dark:from-gray-900 dark:via-gray-900 dark:to-red-950 p-6 rounded-xl shadow-2xl border-2 border-red-100 dark:border-red-900 backdrop-blur-xl backdrop-saturate-150 animate-modal-appear max-w-md w-full relative">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center border-4 border-white dark:border-gray-900 shadow-xl">
          <AlertTriangle className="h-12 w-12 text-white" />
        </div>
        <div className="mt-12 text-center">
          <h3 className="text-lg font-bold text-card-foreground mb-2">Delete Question</h3>
          <p className="text-muted-foreground mb-6">Are you sure you want to delete this question? This action cannot be undone.</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-lg font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transform transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-red-500 to-red-600 text-white hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transform transition-all duration-200"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DURATION_OPTIONS = [
  '30 minutes',
  '1 hour',
  '1 hour 30 minutes',
  '2 hours',
  '2 hours 30 minutes',
  '3 hours'
];

const ExamForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const questionFormRef = useRef<HTMLDivElement>(null);
  const [validationErrors, setValidationErrors] = useState<FormErrors>({});
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [questionSearchQuery, setQuestionSearchQuery] = useState('');
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [deletePrompt, setDeletePrompt] = useState<{ isOpen: boolean; questionId: number | null }>({
    isOpen: false,
    questionId: null
  });

  const [exam, setExam] = useState<Exam>({
    id: 0,
    name: '',
    subject: '',
    date: '',
    duration: DURATION_OPTIONS[0],
    status: 'upcoming',
    questions: [],
    totalMarks: 0
  });

  const [currentQuestion, setCurrentQuestion] = useState<Omit<Question, 'id'>>({
    text: '',
    type: 'mcq',
    options: ['', '', '', ''],
    marks: 1
  });

  useEffect(() => {
    if (id) {
      // In a real app, fetch exam data from API
      const mockExam: Exam = {
        id: 1,
        name: 'Mathematics Final',
        subject: 'Mathematics',
        date: '2024-03-20',
        duration: '3 hours',
        status: 'upcoming',
        questions: [
          {
            id: 1,
            text: 'What is 2 + 2?',
            type: 'mcq',
            options: ['3', '4', '5', '6'],
            marks: 1
          }
        ],
        totalMarks: 1
      };
      setExam(mockExam);
    }
  }, [id]);

  const validateExamForm = () => {
    const errors: FormErrors = {};
    const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;

    if (specialCharsRegex.test(exam.name)) {
      errors.name = 'Name cannot contain special characters';
    }

    if (specialCharsRegex.test(exam.subject)) {
      errors.subject = 'Subject cannot contain special characters';
    }

    const selectedDate = new Date(exam.date);
    if (isNaN(selectedDate.getTime())) {
      errors.date = 'Please enter a valid date';
    } else if (selectedDate < new Date()) {
      errors.date = 'Date cannot be in the past';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateQuestion = () => {
    const errors: FormErrors = {};

    if (!currentQuestion.marks || currentQuestion.marks < 1) {
      errors.marks = 'Marks must be at least 1';
    }

    if (!currentQuestion.text.trim()) {
      errors.text = 'Question text is required';
    }

    if (currentQuestion.type === 'mcq') {
      const emptyOptions = currentQuestion.options?.some(opt => !opt.trim());
      if (emptyOptions) {
        errors.options = 'All options must be filled out';
      }

      const filledOptions = currentQuestion.options?.filter(opt => opt.trim()) || [];
      const uniqueOptions = new Set(filledOptions.map(opt => opt.trim().toLowerCase()));
      if (uniqueOptions.size !== filledOptions.length) {
        errors.options = 'Options must be unique';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateExamForm()) return;
    
    try {
      const examData = {
        name: exam.name,
        subject: exam.subject,
        date: exam.date,
        duration: exam.duration,
        status: exam.status,
        questions: exam.questions,
        totalMarks: exam.totalMarks
      };

      if (id) {
        await examAPI.update(id, examData);
      } else {
        await examAPI.create(examData);
      }
      
      navigate('/exams');
    } catch (error) {
      console.error('Error saving exam:', error);
      alert('Failed to save exam. Please try again.');
    }
  };

  const handleAddQuestion = () => {
    if (editingQuestion) {
      if (!validateQuestion()) return;

      const updatedQuestions = exam.questions.map(q =>
        q.id === editingQuestion.id
          ? { ...currentQuestion, id: editingQuestion.id }
          : q
      );

      setExam({
        ...exam,
        questions: updatedQuestions,
        totalMarks: updatedQuestions.reduce((sum, q) => sum + q.marks, 0)
      });

      setEditingQuestion(null);
    } else {
      if (!validateQuestion()) return;

      const newQuestion: Question = {
        id: Math.random(),
        ...currentQuestion
      };

      setExam({
        ...exam,
        questions: [...exam.questions, newQuestion],
        totalMarks: exam.totalMarks + newQuestion.marks
      });
    }

    setCurrentQuestion({
      text: '',
      type: currentQuestion.type,
      options: ['', '', '', ''],
      marks: 1
    });
    setValidationErrors({});
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setCurrentQuestion({
      text: question.text,
      type: question.type,
      options: question.options || ['', '', '', ''],
      marks: question.marks
    });
    setValidationErrors({});
    
    if (questionFormRef.current) {
      questionFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleDeleteClick = (questionId: number) => {
    setDeletePrompt({ isOpen: true, questionId });
  };

  const handleDeleteConfirm = () => {
    if (deletePrompt.questionId !== null) {
      const questionToRemove = exam.questions.find(q => q.id === deletePrompt.questionId);
      setExam({
        ...exam,
        questions: exam.questions.filter(q => q.id !== deletePrompt.questionId),
        totalMarks: exam.totalMarks - (questionToRemove?.marks || 0)
      });
    }
    setDeletePrompt({ isOpen: false, questionId: null });
  };

  const handleDeleteCancel = () => {
    setDeletePrompt({ isOpen: false, questionId: null });
  };

  const filteredQuestions = exam.questions.filter(question => {
    if (!questionSearchQuery) return true;
    return question.text.toLowerCase().includes(questionSearchQuery.toLowerCase());
  });

  return (
    <div className="h-[calc(100vh-60px)] lg:h-[calc(100vh-120px)] overflow-y-auto">
      <div className="px-4 lg:px-8 py-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/exams')}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold text-foreground">
            {id ? 'Edit Exam' : 'Create Exam'}
          </h1>
        </div>

        <div className="max-w-4xl">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-card-foreground">Exam Name</label>
                  <input
                    type="text"
                    value={exam.name}
                    onChange={(e) => setExam({ ...exam, name: e.target.value })}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:ring-primary focus:border-primary bg-background text-foreground px-3 py-2 ${
                      formErrors.name ? 'border-destructive' : 'border-input'
                    }`}
                    required
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-destructive">{formErrors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-card-foreground">Subject</label>
                  <input
                    type="text"
                    value={exam.subject}
                    onChange={(e) => setExam({ ...exam, subject: e.target.value })}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:ring-primary focus:border-primary bg-background text-foreground px-3 py-2 ${
                      formErrors.subject ? 'border-destructive' : 'border-input'
                    }`}
                    required
                  />
                  {formErrors.subject && (
                    <p className="mt-1 text-sm text-destructive">{formErrors.subject}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-card-foreground">Date</label>
                  <input
                    type="date"
                    value={exam.date}
                    onChange={(e) => setExam({ ...exam, date: e.target.value })}
                    className={`mt-1 block w-full rounded-md shadow-sm focus:ring-primary focus:border-primary bg-background text-foreground px-3 py-2 ${
                      formErrors.date ? 'border-destructive' : 'border-input'
                    }`}
                    required
                  />
                  {formErrors.date && (
                    <p className="mt-1 text-sm text-destructive">{formErrors.date}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-card-foreground">Duration</label>
                  <select
                    value={exam.duration}
                    onChange={(e) => setExam({ ...exam, duration: e.target.value })}
                    className="mt-1 block w-full rounded-md border-input shadow-sm focus:border-primary focus:ring-primary bg-background text-foreground px-3 py-2 border"
                    required
                  >
                    {DURATION_OPTIONS.map((duration) => (
                      <option key={duration} value={duration}>
                        {duration}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-card-foreground">Status</label>
                  <select
                    value={exam.status}
                    onChange={(e) => setExam({ ...exam, status: e.target.value as 'upcoming' | 'active' | 'completed' })}
                    className="mt-1 block w-full rounded-md border-input shadow-sm focus:border-primary focus:ring-primary bg-background text-foreground px-3 py-2 border"
                    required
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-4">
                  <h3 className="text-lg font-semibold text-card-foreground">Questions</h3>
                  <div className="relative w-full sm:w-48 md:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search questions..."
                      value={questionSearchQuery}
                      onChange={(e) => setQuestionSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 border border-input rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground placeholder-muted-foreground text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  {filteredQuestions.map((question) => (
                    <div key={question.id} className="bg-muted p-4 rounded-lg relative">
                      <div className="absolute top-2 right-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditQuestion(question)}
                          className="text-primary hover:text-primary/80"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(question.id)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="font-medium text-card-foreground">{question.text}</p>
                      <p className="text-sm text-muted-foreground mt-1">Marks: {question.marks}</p>
                      {question.type === 'mcq' && question.options && (
                        <div className="mt-2 space-y-1">
                          {question.options.map((option, idx) => (
                            <div key={idx} className="flex items-center text-card-foreground">
                              <span className="w-6">{String.fromCharCode(65 + idx)}.</span>
                              <span>{option}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div ref={questionFormRef} className="bg-muted p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-card-foreground">Question Type</label>
                      <select
                        value={currentQuestion.type}
                        onChange={(e) => setCurrentQuestion({
                          ...currentQuestion,
                          type: e.target.value as 'mcq' | 'written'
                        })}
                        className="mt-1 block w-full rounded-md border-input shadow-sm focus:border-primary focus:ring-primary bg-background text-foreground px-3 py-2 border"
                      >
                        <option value="mcq">Multiple Choice</option>
                        <option value="written">Written</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-card-foreground">Marks</label>
                      <input
                        type="number"
                        value={currentQuestion.marks}
                        onChange={(e) => setCurrentQuestion({
                          ...currentQuestion,
                          marks: parseInt(e.target.value)
                        })}
                        className={`mt-1 block w-full rounded-md border shadow-sm focus:border-primary focus:ring-primary bg-background text-foreground px-3 py-2 ${
                          validationErrors.marks ? 'border-destructive' : 'border-input'
                        }`}
                        min="1"
                      />
                      {validationErrors.marks && (
                        <p className="mt-1 text-sm text-destructive">{validationErrors.marks}</p>
                      )}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-card-foreground">Question Text</label>
                    <textarea
                      value={currentQuestion.text}
                      onChange={(e) => setCurrentQuestion({
                        ...currentQuestion,
                        text: e.target.value
                      })}
                      className={`mt-1 block w-full rounded-md border shadow-sm focus:border-primary focus:ring-primary bg-background text-foreground px-3 py-2 ${
                        validationErrors.text ? 'border-destructive' : 'border-input'
                      }`}
                      rows={3}
                    />
                    {validationErrors.text && (
                      <p className="mt-1 text-sm text-destructive">{validationErrors.text}</p>
                    )}
                  </div>
                  {currentQuestion.type === 'mcq' && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-card-foreground">Options</label>
                      {currentQuestion.options?.map((option, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="w-6 text-card-foreground">{String.fromCharCode(65 + idx)}.</span>
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...(currentQuestion.options || [])];
                              newOptions[idx] = e.target.value;
                              setCurrentQuestion({
                                ...currentQuestion,
                                options: newOptions
                              });
                            }}
                            className={`flex-1 rounded-md border shadow-sm focus:border-primary focus:ring-primary bg-background text-foreground px-3 py-2 ${
                              validationErrors.options ? 'border-destructive' : 'border-input'
                            }`}
                            placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                          />
                        </div>
                      ))}
                      {validationErrors.options && (
                        <p className="mt-1 text-sm text-destructive">{validationErrors.options}</p>
                      )}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    {editingQuestion ? 'Update Question' : 'Add Question'}
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-6 border-t border-border">
                <button
                  type="button"
                  onClick={() => navigate('/exams')}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground bg-secondary hover:bg-secondary/80 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-md"
                >
                  {id ? 'Save Changes' : 'Create Exam'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <DeletePrompt
        isOpen={deletePrompt.isOpen}
        questionId={deletePrompt.questionId}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};

export default ExamForm;