import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { examAPI } from '../services/api';
import DeletePrompt from './DeletePrompt';

interface Question {
  id: number;
  text: string;
  type: 'mcq' | 'written';
  options?: string[];
  marks: number;
}

interface Exam {
  _id: string;
  name: string;
  subject: string;
  date: string;
  duration: string;
  questions: Question[];
  totalMarks: number;
}

const Exams = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [deletePrompt, setDeletePrompt] = useState<{ isOpen: boolean; examId: string | null }>({
    isOpen: false,
    examId: null,
  });

  const { data: exams = [], isLoading } = useQuery('exams', async () => {
    const response = await examAPI.getAll();
    return response.data;
  });

  const deleteMutation = useMutation(
    (id: string) => examAPI.delete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('exams');
      }
    }
  );

  const handleDeleteClick = (id: string) => {
    setDeletePrompt({ isOpen: true, examId: id });
  };

  const handleDeleteConfirm = async () => {
    if (deletePrompt.examId) {
      await deleteMutation.mutateAsync(deletePrompt.examId);
    }
    setDeletePrompt({ isOpen: false, examId: null });
  };

  const handleDeleteCancel = () => {
    setDeletePrompt({ isOpen: false, examId: null });
  };

  const filteredExams = exams.filter((exam: Exam) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      exam.name.toLowerCase().includes(searchTerm) ||
      exam.subject.toLowerCase().includes(searchTerm) ||
      exam.date.includes(searchTerm) ||
      exam.duration.toLowerCase().includes(searchTerm)
    );
  });

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-60px)] lg:h-[calc(100vh-120px)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-60px)] lg:h-[calc(100vh-120px)] overflow-y-auto">
      <div className="px-4 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Exams</h1>
          <button 
            onClick={() => navigate('/exams/new')}
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
            <div className="min-w-[800px] lg:min-w-full">
              <table className="w-full">
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
                  {filteredExams.map((exam: Exam) => (
                    <tr key={exam._id} className="border-b border-border">
                      <td className="py-3 px-4 text-card-foreground">{exam.name}</td>
                      <td className="py-3 px-4 text-card-foreground">{exam.subject}</td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {new Date(exam.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{exam.duration}</td>
                      <td className="py-3 px-4 text-primary font-semibold">{exam.totalMarks}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button 
                            className="text-primary hover:text-primary/80"
                            onClick={() => navigate(`/exams/${exam._id}/edit`)}
                          >
                            <Edit2 className="h-5 w-5" />
                          </button>
                          <button 
                            className="text-destructive hover:text-destructive/80"
                            onClick={() => handleDeleteClick(exam._id)}
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
        </div>

        <DeletePrompt
          isOpen={deletePrompt.isOpen}
          title="Delete Exam"
          message="Are you sure you want to delete this exam? This action cannot be undone and will remove all associated questions."
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      </div>
    </div>
  );
};

export default Exams;