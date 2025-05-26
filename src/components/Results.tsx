import React, { useState } from 'react';
import { Search, FileSpreadsheet, Download, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { resultAPI } from '../services/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DeletePrompt from './DeletePrompt';

interface Result {
  _id: string;
  student: {
    name: string;
  };
  exam: {
    name: string;
  };
  score: number;
  submittedAt: string;
}

const Results = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('recent');
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; resultId: string | null }>({
    isOpen: false,
    resultId: null,
  });

  const { data: resultsData, isLoading } = useQuery('results', resultAPI.getAll);

  const deleteMutation = useMutation(
    (id: string) => resultAPI.delete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('results');
      }
    }
  );

  const handleDeleteClick = (id: string) => {
    setDeleteDialog({ isOpen: true, resultId: id });
  };

  const handleDeleteConfirm = async () => {
    if (deleteDialog.resultId) {
      await deleteMutation.mutateAsync(deleteDialog.resultId);
    }
    setDeleteDialog({ isOpen: false, resultId: null });
  };

  const results = resultsData?.data || [];
  const filteredResults = results.filter((result: Result) => {
    return (
      result.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.exam.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }).sort((a: Result, b: Result) => {
    switch (sortBy) {
      case 'score-high':
        return b.score - a.score;
      case 'score-low':
        return a.score - b.score;
      case 'recent':
      default:
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
    }
  });

  const downloadResults = () => {
    // In a real app, implement CSV download
    alert('Downloading results...');
  };

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
            <h1 className="text-2xl font-bold text-foreground">Exam Results</h1>
            <Button
              onClick={downloadResults}
              size="sm"
              variant="outline"
              className="hover:bg-primary hover:text-primary-foreground"
            >
              <Download className="h-5 w-5 mr-2" />
              Export Results
            </Button>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search results..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select
                value={sortBy}
                onValueChange={setSortBy}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="score-high">Highest Score</SelectItem>
                  <SelectItem value="score-low">Lowest Score</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResults.map((result: Result) => (
              <Card key={result._id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileSpreadsheet className="h-6 w-6 text-primary" />
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteClick(result._id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <CardTitle className="text-lg font-semibold mt-3">
                    {result.exam.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{result.student.name}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Score:</span>
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center">
                          <span className="text-primary font-semibold">{result.score}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Submitted:</span>
                      <span className="font-medium">
                        {new Date(result.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredResults.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No results found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      <DeletePrompt
        isOpen={deleteDialog.isOpen}
        title="Delete Result"
        message="Are you sure you want to delete this result? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialog({ isOpen: false, resultId: null })}
      />
    </div>
  );
};

export default Results;