import React from 'react';
import { Users, BookOpen, FileSpreadsheet, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

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
            <Card key={index} className="hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className={`inline-block p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mt-4 text-card-foreground">{stat.title}</h3>
                <p className="text-2xl font-bold text-primary">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mb-6 lg:mb-0">
          <CardHeader>
            <CardTitle>Recent Exams</CardTitle>
          </CardHeader>
          <ScrollArea className="h-[400px]">
            <div className="p-6">
              <table className="w-full">
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
                        <Badge 
                          variant={exam.status === 'Upcoming' ? 'warning' : 'success'}
                        >
                          {exam.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;