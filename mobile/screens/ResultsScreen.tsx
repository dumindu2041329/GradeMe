import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Share } from 'react-native';
import { Card, Title, Text, Button, TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Result {
  id: number;
  student: string;
  exam: string;
  score: number;
  grade: string;
  date: string;
}

const ResultsScreen = () => {
  const [results] = useState<Result[]>([
    { id: 1, student: 'John Doe', exam: 'Mathematics Final', score: 92, grade: 'A', date: '2024-03-20' },
    { id: 2, student: 'Jane Smith', exam: 'Physics Mid-term', score: 88, grade: 'B+', date: '2024-03-15' },
    { id: 3, student: 'Mike Johnson', exam: 'Chemistry Quiz', score: 95, grade: 'A', date: '2024-03-10' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  const handleExport = async () => {
    try {
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

      await Share.share({
        message: csvContent,
        title: 'Exam Results',
      });
    } catch (error) {
      console.error('Error sharing results:', error);
    }
  };

  const filteredResults = results.filter(result => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      result.student.toLowerCase().includes(searchTerm) ||
      result.exam.toLowerCase().includes(searchTerm) ||
      result.grade.toLowerCase().includes(searchTerm)
    );
  });

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return { bg: '#dcfce7', text: '#166534' };
    if (grade.startsWith('B')) return { bg: '#dbeafe', text: '#1e40af' };
    return { bg: '#fef3c7', text: '#92400e' };
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          placeholder="Search results..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          mode="outlined"
          style={styles.searchInput}
          left={<TextInput.Icon icon="magnify" />}
        />
        <Button
          mode="contained"
          onPress={handleExport}
          icon="download"
          style={styles.exportButton}
        >
          Export
        </Button>
      </View>

      <ScrollView style={styles.resultList}>
        {filteredResults.map(result => (
          <Card key={result.id} style={styles.resultCard}>
            <Card.Content>
              <Title>{result.student}</Title>
              <Text style={styles.examName}>{result.exam}</Text>
              <View style={styles.details}>
                <View style={styles.scoreContainer}>
                  <Text style={styles.score}>{result.score}</Text>
                  <View style={[
                    styles.gradeBadge,
                    { backgroundColor: getGradeColor(result.grade).bg }
                  ]}>
                    <Text style={[
                      styles.gradeText,
                      { color: getGradeColor(result.grade).text }
                    ]}>
                      {result.grade}
                    </Text>
                  </View>
                </View>
                <View style={styles.detailItem}>
                  <Icon name="calendar" size={16} color="#6b7280" />
                  <Text style={styles.detailText}>{result.date}</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'white',
  },
  exportButton: {
    backgroundColor: '#4f46e5',
  },
  resultList: {
    padding: 16,
  },
  resultCard: {
    marginBottom: 16,
    elevation: 2,
  },
  examName: {
    color: '#6b7280',
    marginBottom: 8,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  score: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  gradeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  gradeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 4,
    color: '#6b7280',
    fontSize: 14,
  },
});

export default ResultsScreen;