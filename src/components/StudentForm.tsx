import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface Student {
  name: string;
  email: string;
  class: string;
  enrollmentDate: string;
  password?: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  class?: string;
  enrollmentDate?: string;
  password?: string;
}

const StudentForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [student, setStudent] = useState<Student>({
    name: '',
    email: '',
    class: '',
    enrollmentDate: new Date().toISOString().split('T')[0],
    password: ''
  });

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!student.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!student.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(student.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!student.class.trim()) {
      errors.class = 'Class is required';
    }

    if (!student.enrollmentDate) {
      errors.enrollmentDate = 'Enrollment date is required';
    }

    if (!id && !student.password) {
      errors.password = 'Password is required for new students';
    } else if (!id && student.password && student.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Here you would normally save the data
    console.log('Student data:', student);
    navigate('/students');
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
              <label className="block text-sm font-medium text-card-foreground mb-1">
                Name
              </label>
              <input
                type="text"
                value={student.name}
                onChange={(e) => setStudent({ ...student, name: e.target.value })}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-primary focus:border-primary bg-background text-foreground px-3 py-2 ${
                  formErrors.name ? 'border-destructive' : 'border-input'
                }`}
              />
              {formErrors.name && (
                <p className="mt-1 text-sm text-destructive">{formErrors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                Email
              </label>
              <input
                type="email"
                value={student.email}
                onChange={(e) => setStudent({ ...student, email: e.target.value })}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-primary focus:border-primary bg-background text-foreground px-3 py-2 ${
                  formErrors.email ? 'border-destructive' : 'border-input'
                }`}
              />
              {formErrors.email && (
                <p className="mt-1 text-sm text-destructive">{formErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                Class
              </label>
              <input
                type="text"
                value={student.class}
                onChange={(e) => setStudent({ ...student, class: e.target.value })}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-primary focus:border-primary bg-background text-foreground px-3 py-2 ${
                  formErrors.class ? 'border-destructive' : 'border-input'
                }`}
              />
              {formErrors.class && (
                <p className="mt-1 text-sm text-destructive">{formErrors.class}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                Enrollment Date
              </label>
              <input
                type="date"
                value={student.enrollmentDate}
                onChange={(e) => setStudent({ ...student, enrollmentDate: e.target.value })}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-primary focus:border-primary bg-background text-foreground px-3 py-2 ${
                  formErrors.enrollmentDate ? 'border-destructive' : 'border-input'
                }`}
              />
              {formErrors.enrollmentDate && (
                <p className="mt-1 text-sm text-destructive">{formErrors.enrollmentDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-card-foreground mb-1">
                {id ? 'New Password (leave blank to keep current)' : 'Password'}
              </label>
              <input
                type="password"
                value={student.password}
                onChange={(e) => setStudent({ ...student, password: e.target.value })}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-primary focus:border-primary bg-background text-foreground px-3 py-2 ${
                  formErrors.password ? 'border-destructive' : 'border-input'
                }`}
                placeholder={id ? '••••••••' : ''}
              />
              {formErrors.password && (
                <p className="mt-1 text-sm text-destructive">{formErrors.password}</p>
              )}
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