import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Calendar, Clock, Award } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { examAPI } from '../services/api';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Exam {
  _id: string;
  name: string;
  subject: string;
  date: string;
  duration: string;
  status: 'upcoming' | 'active' | 'completed';
  totalMarks: number;
}

const Exams = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; examId: string | null }>({
    isOpen: false,
    examId: null,
  });

  const { data: examsData, isLoading } = useQuery('exams', examAPI.getAll, {
    refetchInterval: 3000,
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
    setDeleteDialog({ isOpen: true, examId: id });
  };

  const handleDeleteConfirm = async () => {
    if (deleteDialog.examId) {
      await deleteMutation.mutateAsync(deleteDialog.examId);
    }
    setDeleteDialog({ isOpen: false, examId: null });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'warning';
      case 'active':
        return 'success';
      case 'completed':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const exams = examsData?.data || [];
  const filteredExams = exams.filter((exam: Exam) => {
    const matchesSearch = (
      exam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.date.includes(searchQuery) ||
      exam.duration.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.status.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const matchesStatus = statusFilter === 'all' || exam.status === statusFilter;

    return matchesSearch && matchesStatus;
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
            <h1 className="text-2xl font-bold text-foreground">Exams</h1>
            <Button
              onClick={() => navigate('/exams/new')}
              size="sm"
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:brightness-110"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Exam
            </Button>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search exams..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Exams Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExams.map((exam: Exam) => (
              <Card key={exam._id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <Badge variant={getStatusColor(exam.status)} className="capitalize mb-2">
                      {exam.status}
                    </Badge>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigate(`/exams/${exam._id}/edit`)}
                      >
                        <Edit2 className="h-4 w-4 text-primary" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteClick(exam._id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-lg font-semibold line-clamp-1">
                    {exam.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{exam.subject}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(exam.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2" />
                      {exam.duration}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Award className="h-4 w-4 mr-2" />
                      Total Marks: {exam.totalMarks}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredExams.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No exams found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      <AlertDialog 
        open={deleteDialog.isOpen} 
        onOpenChange={(isOpen) => 
          setDeleteDialog({ isOpen, examId: isOpen ? deleteDialog.examId : null })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Exam</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this exam? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Exams;