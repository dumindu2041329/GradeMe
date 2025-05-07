import React, { useState } from 'react';
import { Search, Download } from 'lucide-react';
import { useQuery } from 'react-query';
import { resultAPI } from '../services/api';

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
  const [searchQuery, setSearchQuery] = useState('');

  const { data: results = [], isLoading } = useQuery('results', async () => {
    const response = await resultAPI.getAll();
    return response.data;
  }, {
    refetchInterval: 3000, // Poll every 3 seconds
  });

  const handleExport = () => {
    const csvContent = [
      ['Student', 'Exam', 'Score', 'Date'],
      ...results.map((result: Result) => [
        result.student.name,
        result.exam.name,
        result.score.toString(),
        new Date(result.submittedAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `exam_results_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const filteredResults = results.filter((result: Result) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      result.student.name.toLowerCase().includes(searchTerm) ||
      result.exam.name.toLowerCase().includes(searchTerm) ||
      result.score.toString().includes(searchTerm) ||
      new Date(result.submittedAt).toLocaleDateString().includes(searchTerm)
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
          <h1 className="text-2xl font-bold text-foreground">Results</h1>
          <button 
            onClick={handleExport}
            className="action-button"
          >
            <Download className="h-5 w-5" />
            Export Results
          </button>
        </div>

        <div className="bg-card rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border border-border">
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <input
                type="text"
                placeholder="Search results..."
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
                    <th className="text-left py-3 px-4 text-muted-foreground">Student</th>
                    <th className="text-left py-3 px-4 text-muted-foreground">Exam</th>
                    <th className="text-left py-3 px-4 text-muted-foreground">Score</th>
                    <th className="text-left py-3 px-4 text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResults.map((result: Result) => (
                    <tr key={result._id} className="border-b border-border">
                      <td className="py-3 px-4 text-card-foreground">{result.student.name}</td>
                      <td className="py-3 px-4 text-card-foreground">{result.exam.name}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-full text-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                          {result.score}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {new Date(result.submittedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;