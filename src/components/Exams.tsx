import React, { useState, useRef } from 'react';
import { Plus, Search, Edit2, Trash2, X, ArrowUp } from 'lucide-react';

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

const DURATION_OPTIONS = [
  '30 minutes',
  '1 hour',
  '1 hour 30 minutes',
  '2 hours',
  '2 hours 30 minutes',
  '3 hours'
];

const Exams = () => {
  const modalRef = useRef<HTMLDivElement>(null);
  const questionFormRef = useRef<HTMLDivElement>(null);
  const [exams, setExams] = useState<Exam[]>([
    {
      id: 1,
      name: 'Mathematics Final',
      subject: 'Mathematics',
      date: '2024-03-20',
      duration: '3 hours',
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
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [questionSearchQuery, setQuestionSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [validationErrors, setValidationErrors] = useState<FormErrors>({});
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [newExam, setNewExam] = useState<Omit<Exam, 'id'>>({
    name: '',
    subject: '',
    date: '',
    duration: DURATION_OPTIONS[0],
    questions: [],
    totalMarks: 0
  });
  const [currentQuestion, setCurrentQuestion] = useState<Omit<Question, 'id'>>({
    text: '',
    type: 'mcq',
    options: ['', '', '', ''],
    marks: 1
  });

  const validateExamForm = () => {
    const errors: FormErrors = {};
    const specialCharsRegex = /[!@#$%^&*(),.?":{}|<>]/;

    if (specialCharsRegex.test(editingExam ? editingExam.name : newExam.name)) {
      errors.name = 'Name cannot contain special characters';
    }

    if (specialCharsRegex.test(editingExam ? editingExam.subject : newExam.subject)) {
      errors.subject = 'Subject cannot contain special characters';
    }

    const selectedDate = new Date(editingExam ? editingExam.date : newExam.date);
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

  const handleEditClick = (exam: Exam) => {
    setEditingExam(exam);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleCreateClick = () => {
    setEditingExam(null);
    setFormErrors({});
    setNewExam({
      name: '',
      subject: '',
      date: '',
      duration: DURATION_OPTIONS[0],
      questions: [],
      totalMarks: 0
    });
    setCurrentQuestion({
      text: '',
      type: 'mcq',
      options: ['', '', '', ''],
      marks: 1
    });
    setValidationErrors({});
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this exam?')) {
      setExams(exams.filter(exam => exam.id !== id));
    }
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
    
    setTimeout(() => {
      questionFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleUpdateQuestion = () => {
    if (!editingQuestion || !validateQuestion()) return;

    const updatedQuestion: Question = {
      ...editingQuestion,
      ...currentQuestion
    };

    if (editingExam) {
      const oldQuestion = editingExam.questions.find(q => q.id === editingQuestion.id);
      const marksDiff = updatedQuestion.marks - (oldQuestion?.marks || 0);
      
      const updatedExam = {
        ...editingExam,
        questions: editingExam.questions.map(q => 
          q.id === editingQuestion.id ? updatedQuestion : q
        ),
        totalMarks: editingExam.totalMarks + marksDiff
      };
      setEditingExam(updatedExam);
    } else {
      const oldQuestion = newExam.questions.find(q => q.id === editingQuestion.id);
      const marksDiff = updatedQuestion.marks - (oldQuestion?.marks || 0);

      setNewExam({
        ...newExam,
        questions: newExam.questions.map(q => 
          q.id === editingQuestion.id ? updatedQuestion : q
        ),
        totalMarks: newExam.totalMarks + marksDiff
      });
    }

    setEditingQuestion(null);
    setCurrentQuestion({
      text: '',
      type: 'mcq',
      options: ['', '', '', ''],
      marks: 1
    });
    setValidationErrors({});
  };

  const handleAddQuestion = () => {
    if (editingQuestion) {
      handleUpdateQuestion();
      return;
    }

    if (!validateQuestion()) return;

    const newQuestion: Question = {
      id: Math.random(),
      ...currentQuestion
    };

    if (editingExam) {
      const updatedExam = {
        ...editingExam,
        questions: [...editingExam.questions, newQuestion],
        totalMarks: editingExam.totalMarks + newQuestion.marks
      };
      setEditingExam(updatedExam);
    } else {
      setNewExam({
        ...newExam,
        questions: [...newExam.questions, newQuestion],
        totalMarks: newExam.totalMarks + newQuestion.marks
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

  const handleRemoveQuestion = (questionId: number) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    if (editingExam) {
      const questionToRemove = editingExam.questions.find(q => q.id === questionId);
      const updatedExam = {
        ...editingExam,
        questions: editingExam.questions.filter(q => q.id !== questionId),
        totalMarks: editingExam.totalMarks - (questionToRemove?.marks || 0)
      };
      setEditingExam(updatedExam);
    } else {
      const questionToRemove = newExam.questions.find(q => q.id === questionId);
      setNewExam({
        ...newExam,
        questions: newExam.questions.filter(q => q.id !== questionId),
        totalMarks: newExam.totalMarks - (questionToRemove?.marks || 0)
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateExamForm()) return;
    
    if (editingExam) {
      setExams(exams.map(exam => 
        exam.id === editingExam.id ? editingExam : exam
      ));
    } else {
      const newId = Math.max(...exams.map(e => e.id), 0) + 1;
      setExams([...exams, { ...newExam, id: newId }]);
    }
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingExam(null);
    setQuestionSearchQuery('');
    setFormErrors({});
    setValidationErrors({});
  };

  const scrollToTop = () => {
    modalRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const filteredExams = exams.filter(exam => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      exam.name.toLowerCase().includes(searchTerm) ||
      exam.subject.toLowerCase().includes(searchTerm) ||
      exam.date.includes(searchTerm) ||
      exam.duration.toLowerCase().includes(searchTerm)
    );
  });

  const filteredQuestions = (questions: Question[]) => {
    if (!questionSearchQuery) return questions;
    
    const searchTerm = questionSearchQuery.toLowerCase();
    return questions.filter(question => 
      question.text.toLowerCase().includes(searchTerm)
    );
  };

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">Exams</h1>
        <button 
          onClick={handleCreateClick}
          className="action-button"
        >
          <Plus className="h-5 w-5" />
          Create Exam
        </button>
      </div>

      <div className="bg-card rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-border">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <input
              type="text"
              placeholder="Search exams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-input rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground placeholder-muted-foreground"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-muted">
                <th className="text-left py-3 px-4 text-muted-foreground">Exam Name</th>
                <th className="text-left py-3 px-4 text-muted-foreground">Subject</th>
                <th className="text-left py-3 px-4 text-muted-foreground">Date</th>
                <th className="text-left py-3 px-4 text-muted-foreground">Duration</th>
                <th className="text-left py-3 px-4 text-muted-foreground">Total Marks</th>
                <th className="text-left py-3 px-4 text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExams.map((exam) => (
                <tr key={exam.id} className="border-b border-border">
                  <td className="py-3 px-4 text-card-foreground">{exam.name}</td>
                  <td className="py-3 px-4 text-card-foreground">{exam.subject}</td>
                  <td className="py-3 px-4 text-muted-foreground">{exam.date}</td>
                  <td className="py-3 px-4 text-muted-foreground">{exam.duration}</td>
                  <td className="py-3 px-4 text-primary font-semibold">{exam.totalMarks}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button 
                        className="text-primary hover:text-primary/80"
                        onClick={() => handleEditClick(exam)}
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                      <button 
                        className="text-destructive hover:text-destructive/80"
                        onClick={() => handleDelete(exam.id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div ref={modalRef} className="bg-card rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative border border-border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-card-foreground">{editingExam ? 'Edit Exam' : 'Create Exam'}</h2>
              <button 
                onClick={handleCloseModal}
                className="text-muted-foreground hover:text-card-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-card-foreground">Exam Name</label>
                    <input
                      type="text"
                      value={editingExam ? editingExam.name : newExam.name}
                      onChange={(e) => {
                        const value = e.target.value;
                        editingExam 
                          ? setEditingExam({ ...editingExam, name: value })
                          : setNewExam({ ...newExam, name: value });
                      }}
                      className={`mt-1 block w-full rounded-md border shadow-sm focus:border-primary focus:ring-primary bg-background text-foreground px-3 py-2 ${
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
                      value={editingExam ? editingExam.subject : newExam.subject}
                      onChange={(e) => {
                        const value = e.target.value;
                        editingExam
                          ? setEditingExam({ ...editingExam, subject: value })
                          : setNewExam({ ...newExam, subject: value });
                      }}
                      className={`mt-1 block w-full rounded-md border shadow-sm focus:border-primary focus:ring-primary bg-background text-foreground px-3 py-2 ${
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
                      value={editingExam ? editingExam.date : newExam.date}
                      onChange={(e) => editingExam
                        ? setEditingExam({ ...editingExam, date: e.target.value })
                        : setNewExam({ ...newExam, date: e.target.value })
                      }
                      className={`mt-1 block w-full rounded-md border shadow-sm focus:border-primary focus:ring-primary bg-background text-foreground px-3 py-2 ${
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
                      value={editingExam ? editingExam.duration : newExam.duration}
                      onChange={(e) => editingExam
                        ? setEditingExam({ ...editingExam, duration: e.target.value })
                        : setNewExam({ ...newExam, duration: e.target.value })
                      }
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
                </div>

                <div className="border-t border-border pt-4 mt-4">
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
                  
                  {/* Question List */}
                  <div className="space-y-4 mb-6">
                    {filteredQuestions(editingExam ? editingExam.questions : newExam.questions).map((question) => (
                      <div key={question.id} className="bg-muted p-4 rounded-lg relative">
                        <div className="absolute top-2 right-2 flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditQuestion(question)}
                            className="text-primary hover:text-primary/80"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveQuestion(question.id)}
                            className="text-destructive hover:text-destructive/80"
                          >
                            <X className="h-4 w-4" />
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

                  {/* Add/Edit Question Form */}
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

                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-sm font-medium text-muted-foreground bg-secondary hover:bg-secondary/80 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-md"
                  >
                    {editingExam ? 'Save Changes' : 'Create Exam'}
                  </button>
                </div>
              </div>
            </form>

            {/* Go to Top Button */}
            <button
              onClick={scrollToTop}
              className="fixed bottom-8 right-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 z-50"
              title="Go to top"
            >
              <ArrowUp className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exams;