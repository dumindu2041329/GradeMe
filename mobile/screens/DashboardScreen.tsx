import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const DashboardScreen = () => {
  const stats = [
    { title: 'Total Students', value: '1,234', icon: 'account-group', color: '#3b82f6' },
    { title: 'Active Exams', value: '12', icon: 'book-open-page-variant', color: '#22c55e' },
    { title: 'Completed Exams', value: '48', icon: 'clipboard-check', color: '#8b5cf6' },
    { title: 'Upcoming Exams', value: '6', icon: 'clock', color: '#eab308' },
  ];

  const recentExams = [
    { name: 'Mathematics Final', date: '2024-03-20', status: 'Upcoming' },
    { name: 'Physics Mid-term', date: '2024-03-15', status: 'Completed' },
    { name: 'Chemistry Quiz', date: '2024-03-10', status: 'Completed' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>Dashboard</Title>

      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <Card key={index} style={styles.statCard}>
            <Card.Content>
              <View style={[styles.iconContainer, { backgroundColor: stat.color + '20' }]}>
                <Icon name={stat.icon} size={24} color={stat.color} />
              </View>
              <Text style={styles.statTitle}>{stat.title}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
            </Card.Content>
          </Card>
        ))}
      </View>

      <Card style={styles.recentExamsCard}>
        <Card.Content>
          <Title style={styles.cardTitle}>Recent Exams</Title>
          {recentExams.map((exam, index) => (
            <View key={index} style={styles.examItem}>
              <View>
                <Text style={styles.examName}>{exam.name}</Text>
                <Text style={styles.examDate}>{exam.date}</Text>
              </View>
              <View style={[
                styles.statusBadge,
                { backgroundColor: exam.status === 'Upcoming' ? '#fef3c7' : '#dcfce7' }
              ]}>
                <Text style={[
                  styles.statusText,
                  { color: exam.status === 'Upcoming' ? '#92400e' : '#166534' }
                ]}>
                  {exam.status}
                </Text>
              </View>
            </View>
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: '48%',
    marginBottom: 16,
    elevation: 2,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  recentExamsCard: {
    marginBottom: 20,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  examItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  examName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  examDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default DashboardScreen;