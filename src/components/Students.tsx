import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { studentAPI } from '../services/api';
import DeletePrompt from './DeletePrompt';

interface Student {
  _id: string;
  name: string;
  email: string;
  class: string;
  enrollmentDate: string;
}

const Students = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [deletePrompt, setDeletePrompt] = useState<{ isOpen: boolean; studentId: string | null }>({
    isOpen: false,
    studentId: null,
  });

  const { data: students = [], isLoading } = useQuery('students', studentAPI.getAll, {
    refetchInterval: 3000, // Poll every 3 seconds
  });

  const deleteMutation = useMutation(
    (id: string) => studentAPI.delete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('students');
      }
    }
  );

  const handleDeleteClick = (id: string) => {
    setDeletePrompt({ isOpen: true, studentId: id });
  };

  const handleDeleteConfirm = async () => {
    if (deletePrompt.studentId) {
      await deleteMutation.mutateAsync(deletePrompt.studentId);
    }
    setDeletePrompt({ isOpen: false, studentId: null });
  };

  const handleDeleteCancel = () => {
    setDeletePrompt({ isOpen: false, studentId: null });
  };

  const filteredStudents = students.filter((student: Student) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      student.name.toLowerCase().includes(searchTerm) ||
      student.email.toLowerCase().includes(searchTerm) ||
      student.class.toLowerCase().includes(searchTerm) ||
      student.enrollmentDate.includes(searchTerm)
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
          <h1 className="text-2xl font-bold text-foreground">Students</h1>
          <button 
            onClick={() => navigate('/students/new')}
            className="action-button"
          >
            <Plus className="h-5 w-5" />
            Add Student
          </button>
        </div>

        <div className="bg-card rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-border">
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <input
                type="text"
                placeholder="Search students..."
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
                    <th className="text-left py-3 px-4 text-muted-foreground">Name</th>
                    <th className="text-left py-3 px-4 text-muted-foreground">Email</th>
                    <th className="text-left py-3 px-4 text-muted-foreground">Class</th>
                    <th className="text-left py-3 px-4 text-muted-foreground">Enrollment Date</th>
                    <th className="text-left py-3 px-4 text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student: Student) => (
                    <tr key={student._id} className="border-b border-border">
                      <td className="py-3 px-4 text-card-foreground">{student.name}</td>
                      <td className="py-3 px-4 text-card-foreground">{student.email}</td>
                      <td className="py-3 px-4 text-card-foreground">{student.class}</td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {new Date(student.enrollmentDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button 
                            className="text-primary hover:text-primary/80"
                            onClick={() => navigate(`/students/${student._id}/edit`)}
                          >
                            <Edit2 className="h-5 w-5" />
                          </button>
                          <button 
                            className="text-destructive hover:text-destructive/80"
                            onClick={() => handleDeleteClick(student._id)}
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
          title="Delete Student"
          message="Are you sure you want to delete this student? This action cannot be undone."
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      </div>
    </div>
  );
};

export default Students;