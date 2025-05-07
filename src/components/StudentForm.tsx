import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { studentAPI } from '../services/api';

interface Student {
  id: number;
  name: string;
  email: string;
  class: string;
  enrollmentDate: string;
}

const StudentForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [student, setStudent] = useState<Student>({
    id: 0,
    name: '',
    email: '',
    class: '',
    enrollmentDate: ''
  });

  useEffect(() => {
    if (id) {
      // In a real app, fetch student data from API
      const mockStudent: Student = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        class: '12A',
        enrollmentDate: '2023-09-01'
      };
      setStudent(mockStudent);
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const studentData = {
        name: student.name,
        email: student.email,
        class: student.class,
        enrollmentDate: student.enrollmentDate,
        password: 'defaultPassword123' // In a real app, this would be handled properly
      };

      if (id) {
        await studentAPI.update(id, studentData);
      } else {
        await studentAPI.create(studentData);
      }
      
      navigate('/students');
    } catch (error) {
      console.error('Error saving student:', error);
      alert('Failed to save student. Please try again.');
    }
  };

  return (
    <div className="h-[calc(100vh-60px)] lg:h-[calc(100vh-120px)] overflow-y-auto">
      <div className="px-4 lg:px-8 py-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/students')}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold text-foreground">
            {id ? 'Edit Student' : 'Add Student'}
          </h1>
        </div>

        <div className="max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-card-foreground">Name</label>
              <input
                type="text"
                value={student.name}
                onChange={(e) => setStudent({ ...student, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-input shadow-sm focus:border-primary focus:ring-primary bg-background text-foreground px-3 py-2 border"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground">Email</label>
              <input
                type="email"
                value={student.email}
                onChange={(e) => setStudent({ ...student, email: e.target.value })}
                className="mt-1 block w-full rounded-md border-input shadow-sm focus:border-primary focus:ring-primary bg-background text-foreground px-3 py-2 border"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground">Class</label>
              <input
                type="text"
                value={student.class}
                onChange={(e) => setStudent({ ...student, class: e.target.value })}
                className="mt-1 block w-full rounded-md border-input shadow-sm focus:border-primary focus:ring-primary bg-background text-foreground px-3 py-2 border"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-card-foreground">Enrollment Date</label>
              <input
                type="date"
                value={student.enrollmentDate}
                onChange={(e) => setStudent({ ...student, enrollmentDate: e.target.value })}
                className="mt-1 block w-full rounded-md border-input shadow-sm focus:border-primary focus:ring-primary bg-background text-foreground px-3 py-2 border"
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-6 border-t border-border">
              <button
                type="button"
                onClick={() => navigate('/students')}
                className="px-4 py-2 text-sm font-medium text-muted-foreground bg-secondary hover:bg-secondary/80 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-md"
              >
                {id ? 'Save Changes' : 'Add Student'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentForm;