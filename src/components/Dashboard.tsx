import React from 'react';
import { Users, BookOpen, FileSpreadsheet, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  const stats = [
    { 
      title: 'Total Students',
      value: '1,234',
      change: '+12.5%',
      trend: 'up',
      description: 'Compared to last month',
      icon: Users,
      color: 'bg-blue-500'
    },
    { 
      title: 'Active Exams',
      value: '12',
      change: '+8.2%',
      trend: 'up',
      description: 'Active exams this week',
      icon: BookOpen,
      color: 'bg-green-500'
    },
    { 
      title: 'Completed Exams',
      value: '48',
      change: '-3.4%',
      trend: 'down',
      description: 'Compared to last week',
      icon: FileSpreadsheet,
      color: 'bg-purple-500'
    },
    { 
      title: 'Upcoming Exams',
      value: '6',
      change: '+2.3%',
      trend: 'up',
      description: 'Scheduled for next week',
      icon: Clock,
      color: 'bg-yellow-500'
    },
  ];

  const recentExams = [
    { name: 'Mathematics Final', date: '2024-03-20', status: 'Upcoming', avgScore: null },
    { name: 'Physics Mid-term', date: '2024-03-15', status: 'Completed', avgScore: 85 },
    { name: 'Chemistry Quiz', date: '2024-03-10', status: 'Completed', avgScore: 78 },
    { name: 'Biology Test', date: '2024-03-25', status: 'Upcoming', avgScore: null },
    { name: 'English Essay', date: '2024-03-12', status: 'Completed', avgScore: 92 },
  ];

  const topPerformers = [
    { name: 'John Smith', class: '12A', avgScore: 95 },
    { name: 'Emma Davis', class: '12B', avgScore: 93 },
    { name: 'Michael Chen', class: '12A', avgScore: 91 },
    { name: 'Sarah Wilson', class: '12C', avgScore: 90 },
    { name: 'David Brown', class: '12B', avgScore: 89 },
  ];

  return (
    <div className="h-screen overflow-y-auto">
      <div className="px-4 lg:px-8 pt-6 pb-6">
        <div className="flex flex-col gap-4 md:gap-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <div className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleString()}
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between space-x-4">
                    <div className={`p-3 rounded-full ${stat.color} bg-opacity-10`}>
                      <stat.icon className={`h-6 w-6 ${stat.color} text-white`} />
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className={`text-sm ${
                        stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {stat.change}
                      </span>
                      {stat.trend === 'up' ? (
                        <ArrowUpRight className="h-4 w-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    <h2 className="text-2xl font-bold text-card-foreground">{stat.value}</h2>
                    <p className="text-sm font-medium text-muted-foreground mt-1">{stat.title}</p>
                    <p className="text-xs text-muted-foreground mt-2">{stat.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Exams and Top Performers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Recent Exams */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Exams</CardTitle>
                <CardDescription>Overview of recent and upcoming examinations</CardDescription>
              </CardHeader>
              <ScrollArea className="h-[400px]">
                <div className="p-6">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-muted-foreground">Exam Name</th>
                        <th className="text-left py-3 px-4 text-muted-foreground">Date</th>
                        <th className="text-left py-3 px-4 text-muted-foreground">Status</th>
                        <th className="text-left py-3 px-4 text-muted-foreground">Avg. Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentExams.map((exam, index) => (
                        <tr key={index} className="border-b border-border">
                          <td className="py-3 px-4 text-card-foreground">{exam.name}</td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {new Date(exam.date).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <Badge 
                              variant={exam.status === 'Upcoming' ? 'warning' : 'success'}
                            >
                              {exam.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-card-foreground">
                            {exam.avgScore ? `${exam.avgScore}%` : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </ScrollArea>
            </Card>

            {/* Top Performers */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>Students with highest average scores</CardDescription>
              </CardHeader>
              <ScrollArea className="h-[400px]">
                <div className="p-6">
                  <div className="space-y-6">
                    {topPerformers.map((student, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              index === 0 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                              index === 1 ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' :
                              index === 2 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' :
                              'bg-muted text-muted-foreground'
                            }`}>
                              {index + 1}
                            </div>
                          </div>
                          <div>
                            <p className="font-medium text-card-foreground">{student.name}</p>
                            <p className="text-sm text-muted-foreground">Class {student.class}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center">
                            <span className="text-primary font-semibold">{student.avgScore}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;