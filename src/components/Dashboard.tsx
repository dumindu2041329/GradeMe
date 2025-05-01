import React from 'react';
import { Users, BookOpen, FileSpreadsheet, Clock } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { title: 'Total Students', value: '1,234', icon: Users, color: 'bg-blue-500' },
    { title: 'Active Exams', value: '12', icon: BookOpen, color: 'bg-green-500' },
    { title: 'Completed Exams', value: '48', icon: FileSpreadsheet, color: 'bg-purple-500' },
    { title: 'Upcoming Exams', value: '6', icon: Clock, color: 'bg-yellow-500' },
  ];

  const recentExams = [
    { name: 'Mathematics Final', date: '2024-03-20', status: 'Upcoming' },
    { name: 'Physics Mid-term', date: '2024-03-15', status: 'Completed' },
    { name: 'Chemistry Quiz', date: '2024-03-10', status: 'Completed' },
  ];

  return (
    <div className="h-screen overflow-y-auto">
      <div className="px-4 lg:px-8 pt-6 pb-6">
        <h1 className="text-2xl font-bold mb-8 text-foreground">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-card rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-border">
              <div className={`inline-block p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mt-4 text-card-foreground">{stat.title}</h3>
              <p className="text-2xl font-bold text-primary">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-border mb-6 lg:mb-0">
          <h2 className="text-xl font-semibold mb-4 text-card-foreground">Recent Exams</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-muted-foreground">Exam Name</th>
                  <th className="text-left py-3 px-4 text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-4 text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentExams.map((exam, index) => (
                  <tr key={index} className="border-b border-border">
                    <td className="py-3 px-4 text-card-foreground">{exam.name}</td>
                    <td className="py-3 px-4 text-muted-foreground">{exam.date}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        exam.status === 'Upcoming' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                      }`}>
                        {exam.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;