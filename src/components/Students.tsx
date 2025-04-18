import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react';
import DeletePrompt from './DeletePrompt';

interface Student {
  id: number;
  name: string;
  email: string;
  class: string;
  enrollmentDate: string;
}

const Students = () => {
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: 'John Doe', email: 'john@example.com', class: '12A', enrollmentDate: '2023-09-01' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', class: '12B', enrollmentDate: '2023-09-01' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', class: '12A', enrollmentDate: '2023-09-01' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletePrompt, setDeletePrompt] = useState<{ isOpen: boolean; studentId: number | null }>({
    isOpen: false,
    studentId: null,
  });
  const [newStudent, setNewStudent] = useState<Omit<Student, 'id'>>({
    name: '',
    email: '',
    class: '',
    enrollmentDate: ''
  });

  const handleEditClick = (student: Student) => {
    setEditingStudent(student);
    setIsModalOpen(true);
  };

  const handleCreateClick = () => {
    setEditingStudent(null);
    setNewStudent({ name: '', email: '', class: '', enrollmentDate: '' });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeletePrompt({ isOpen: true, studentId: id });
  };

  const handleDeleteConfirm = () => {
    if (deletePrompt.studentId !== null) {
      setStudents(students.filter(student => student.id !== deletePrompt.studentId));
    }
    setDeletePrompt({ isOpen: false, studentId: null });
  };

  const handleDeleteCancel = () => {
    setDeletePrompt({ isOpen: false, studentId: null });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudent) {
      setStudents(students.map(student => 
        student.id === editingStudent.id ? editingStudent : student
      ));
    } else {
      const newId = Math.max(...students.map(s => s.id), 0) + 1;
      setStudents([...students, { ...newStudent, id: newId }]);
    }
    setIsModalOpen(false);
    setEditingStudent(null);
  };

  const filteredStudents = students.filter(student => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      student.name.toLowerCase().includes(searchTerm) ||
      student.email.toLowerCase().includes(searchTerm) ||
      student.class.toLowerCase().includes(searchTerm) ||
      student.enrollmentDate.includes(searchTerm)
    );
  });

  return (
    <div className="h-[calc(100vh-60px)] lg:h-[calc(100vh-120px)] overflow-y-auto">
      <div className="px-4 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Students</h1>
          <button 
            onClick={handleCreateClick}
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
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="border-b border-border">
                      <td className="py-3 px-4 text-card-foreground">{student.name}</td>
                      <td className="py-3 px-4 text-card-foreground">{student.email}</td>
                      <td className="py-3 px-4 text-card-foreground">{student.class}</td>
                      <td className="py-3 px-4 text-muted-foreground">{student.enrollmentDate}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button 
                            className="text-primary hover:text-primary/80"
                            onClick={() => handleEditClick(student)}
                          >
                            <Edit2 className="h-5 w-5" />
                          </button>
                          <button 
                            className="text-destructive hover:text-destructive/80"
                            onClick={() => handleDeleteClick(student.id)}
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

        {isModalOpen && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-[99999]">
            <div className="bg-card rounded-lg p-6 w-full max-w-md mx-8 border border-border relative z-[100000]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-card-foreground">{editingStudent ? 'Edit Student' : 'Add Student'}</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-muted-foreground hover:text-card-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-card-foreground">Name</label>
                    <input
                      type="text"
                      value={editingStudent ? editingStudent.name : newStudent.name}
                      onChange={(e) => editingStudent
                        ? setEditingStudent({ ...editingStudent, name: e.target.value })
                        : setNewStudent({ ...newStudent, name: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-input shadow-sm focus:border-primary focus:ring-primary bg-background text-foreground px-3 py-2 border"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-card-foreground">Email</label>
                    <input
                      type="email"
                      value={editingStudent ? editingStudent.email : newStudent.email}
                      onChange={(e) => editingStudent
                        ? setEditingStudent({ ...editingStudent, email: e.target.value })
                        : setNewStudent({ ...newStudent, email: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-input shadow-sm focus:border-primary focus:ring-primary bg-background text-foreground px-3 py-2 border"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-card-foreground">Class</label>
                    <input
                      type="text"
                      value={editingStudent ? editingStudent.class : newStudent.class}
                      onChange={(e) => editingStudent
                        ? setEditingStudent({ ...editingStudent, class: e.target.value })
                        : setNewStudent({ ...newStudent, class: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-input shadow-sm focus:border-primary focus:ring-primary bg-background text-foreground px-3 py-2 border"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-card-foreground">Enrollment Date</label>
                    <input
                      type="date"
                      value={editingStudent ? editingStudent.enrollmentDate : newStudent.enrollmentDate}
                      onChange={(e) => editingStudent
                        ? setEditingStudent({ ...editingStudent, enrollmentDate: e.target.value })
                        : setNewStudent({ ...newStudent, enrollmentDate: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-input shadow-sm focus:border-primary focus:ring-primary bg-background text-foreground px-3 py-2 border"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2 mt-6">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 text-sm font-medium text-muted-foreground bg-secondary hover:bg-secondary/80 rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-md"
                    >
                      {editingStudent ? 'Save Changes' : 'Add Student'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

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