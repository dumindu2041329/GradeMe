import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, GraduationCap } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { studentAPI } from '../services/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; studentId: string | null }>({
    isOpen: false,
    studentId: null,
  });

  const { data: studentsData, isLoading } = useQuery('students', studentAPI.getAll);

  const deleteMutation = useMutation(
    (id: string) => studentAPI.delete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('students');
      }
    }
  );

  const handleDeleteClick = (id: string) => {
    setDeleteDialog({ isOpen: true, studentId: id });
  };

  const handleDeleteConfirm = async () => {
    if (deleteDialog.studentId) {
      await deleteMutation.mutateAsync(deleteDialog.studentId);
    }
    setDeleteDialog({ isOpen: false, studentId: null });
  };

  const students = studentsData?.data || [];
  const filteredStudents = students.filter((student: Student) => {
    return (
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.class.toLowerCase().includes(searchQuery.toLowerCase())
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
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-foreground">Students</h1>
            <Button
              onClick={() => navigate('/students/new')}
              size="sm"
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:brightness-110"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Student
            </Button>
          </div>

          {/* Search */}
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardContent>
          </Card>

          {/* Students Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStudents.map((student: Student) => (
              <Card key={student._id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigate(`/students/${student._id}/edit`)}
                      >
                        <Edit2 className="h-4 w-4 text-primary" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteClick(student._id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-lg font-semibold mt-3">
                    {student.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{student.email}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Class:</span>
                      <span className="font-medium">{student.class}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Enrolled:</span>
                      <span className="font-medium">
                        {new Date(student.enrollmentDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No students found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      <DeletePrompt
        isOpen={deleteDialog.isOpen}
        title="Delete Student"
        message="Are you sure you want to delete this student? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialog({ isOpen: false, studentId: null })}
      />
    </div>
  );
};

export default Students;