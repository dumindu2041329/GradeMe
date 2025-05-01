import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Text, Button, FAB, Portal, Modal, TextInput, List } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Question {
  id: number;
  text: string;
  type: 'mcq' | 'written';
  options?: string[];
  marks: number;
}

interface Exam {
  id: number;
  name: string;
  subject: string;
  date: string;
  duration: string;
  questions: Question[];
  totalMarks: number;
}

const DURATION_OPTIONS = [
  '30 minutes',
  '1 hour',
  '1 hour 30 minutes',
  '2 hours',
  '2 hours 30 minutes',
  '3 hours'
];

const ExamsScreen = () => {
  const [exams, setExams] = useState<Exam[]>([
    {
      id: 1,
      name: 'Mathematics Final',
      subject: 'Mathematics',
      date: '2024-03-20',
      duration: '3 hours',
      questions: [
        {
          id: 1,
          text: 'What is 2 + 2?',
          type: 'mcq',
          options: ['3', '4', '5', '6'],
          marks: 1
        }
      ],
      totalMarks: 1
    }
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const showModal = (exam?: Exam) => {
    setSelectedExam(exam || null);
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setIsModalVisible(false);
    setSelectedExam(null);
  };

  const handleDelete = (id: number) => {
    setExams(exams.filter(exam => exam.id !== id));
  };

  const filteredExams = exams.filter(exam => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      exam.name.toLowerCase().includes(searchTerm) ||
      exam.subject.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search exams..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        mode="outlined"
        style={styles.searchInput}
        left={<TextInput.Icon icon="magnify" />}
      />

      <ScrollView style={styles.examList}>
        {filteredExams.map(exam => (
          <Card key={exam.id} style={styles.examCard}>
            <Card.Content>
              <Title>{exam.name}</Title>
              <Text style={styles.subject}>{exam.subject}</Text>
              <View style={styles.details}>
                <View style={styles.detailItem}>
                  <Icon name="calendar" size={16} color="#6b7280" />
                  <Text style={styles.detailText}>{exam.date}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Icon name="clock-outline" size={16} color="#6b7280" />
                  <Text style={styles.detailText}>{exam.duration}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Icon name="star-outline" size={16} color="#6b7280" />
                  <Text style={styles.detailText}>{exam.totalMarks} marks</Text>
                </View>
              </View>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => showModal(exam)}>Edit</Button>
              <Button onPress={() => handleDelete(exam.id)} textColor="#ef4444">Delete</Button>
            </Card.Actions>
          </Card>
        ))}
      </ScrollView>

      <Portal>
        <Modal
          visible={isModalVisible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modalContent}
        >
          <ScrollView>
            <Title style={styles.modalTitle}>
              {selectedExam ? 'Edit Exam' : 'Create Exam'}
            </Title>
            {/* Modal content will be implemented in the next iteration */}
            <Button mode="contained" onPress={hideModal} style={styles.modalButton}>
              Close
            </Button>
          </ScrollView>
        </Modal>
      </Portal>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => showModal()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  searchInput: {
    margin: 16,
    backgroundColor: 'white',
  },
  examList: {
    padding: 16,
  },
  examCard: {
    marginBottom: 16,
    elevation: 2,
  },
  subject: {
    color: '#6b7280',
    marginBottom: 8,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
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
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#4f46e5',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  modalTitle: {
    marginBottom: 20,
  },
  modalButton: {
    marginTop: 20,
  },
});

export default ExamsScreen;