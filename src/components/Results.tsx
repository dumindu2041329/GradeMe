import React, { useState } from 'react';
import { Search, Download } from 'lucide-react';

interface Result {
  id: number;
  student: string;
  exam: string;
  score: number;
  grade: string;
  date: string;
}

const Results = () => {
  const [results] = useState<Result[]>([
    { id: 1, student: 'John Doe', exam: 'Mathematics Final', score: 92, grade: 'A', date: '2024-03-20' },
    { id: 2, student: 'Jane Smith', exam: 'Physics Mid-term', score: 88, grade: 'B+', date: '2024-03-15' },
    { id: 3, student: 'Mike Johnson', exam: 'Chemistry Quiz', score: 95, grade: 'A', date: '2024-03-10' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  const filteredResults = results.filter(result => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      result.student.toLowerCase().includes(searchTerm) ||
      result.exam.toLowerCase().includes(searchTerm) ||
      result.grade.toLowerCase().includes(searchTerm) ||
      result.score.toString().includes(searchTerm) ||
      result.date.includes(searchTerm)
    );
  });

  const handleExport = () => {
    const csvContent = [
      ['Student', 'Exam', 'Score', 'Grade', 'Date'],
      ...results.map(result => [
        result.student,
        result.exam,
        result.score.toString(),
        result.grade,
        result.date
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-foreground">Results</h1>
        <button 
          onClick={handleExport}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors"
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
          <table className="min-w-full">
            <thead>
              <tr className="bg-muted">
                <th className="text-left py-3 px-4 text-muted-foreground">Student</th>
                <th className="text-left py-3 px-4 text-muted-foreground">Exam</th>
                <th className="text-left py-3 px-4 text-muted-foreground">Score</th>
                <th className="text-left py-3 px-4 text-muted-foreground">Grade</th>
                <th className="text-left py-3 px-4 text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((result) => (
                <tr key={result.id} className="border-b border-border">
                  <td className="py-3 px-4 text-card-foreground">{result.student}</td>
                  <td className="py-3 px-4 text-card-foreground">{result.exam}</td>
                  <td className="py-3 px-4 text-card-foreground">{result.score}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      result.grade.startsWith('A') ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' :
                      result.grade.startsWith('B') ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' :
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                    }`}>
                      {result.grade}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{result.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Results;