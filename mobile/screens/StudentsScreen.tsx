import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Text, Button, FAB, Portal, Modal, TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Student {
  id: number;
  name: string;
  email: string;
  class: string;
  enrollmentDate: string;
}

const StudentsScreen = () => {
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: 'John Doe', email: 'john@example.com', class: '12A', enrollmentDate: '2023-09-01' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', class: '12B', enrollmentDate: '2023-09-01' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', class: '12A', enrollmentDate: '2023-09-01' },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const showModal = (student?: Student) => {
    setSelectedStudent(student || null);
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setIsModalVisible(false);
    setSelectedStudent(null);
  };

  const handleDelete = (id: number) => {
    setStudents(students.filter(student => student.id !== id));
  };

  const filteredStudents = students.filter(student => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      student.name.toLowerCase().includes(searchTerm) ||
      student.email.toLowerCase().includes(searchTerm) ||
      student.class.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search students..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        mode="outlined"
        style={styles.searchInput}
        left={<TextInput.Icon icon="magnify" />}
      />

      <ScrollView style={styles.studentList}>
        {filteredStudents.map(student => (
          <Card key={student.id} style={styles.studentCard}>
            <Card.Content>
              <Title>{student.name}</Title>
              <Text style={styles.email}>{student.email}</Text>
              <View style={styles.details}>
                <View style={styles.detailItem}>
                  <Icon name="school" size={16} color="#6b7280" />
                  <Text style={styles.detailText}>Class {student.class}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Icon name="calendar" size={16} color="#6b7280" />
                  <Text style={styles.detailText}>{student.enrollmentDate}</Text>
                </View>
              </View>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => showModal(student)}>Edit</Button>
              <Button onPress={() => handleDelete(student.id)} textColor="#ef4444">Delete</Button>
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
              {selectedStudent ? 'Edit Student' : 'Add Student'}
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
  studentList: {
    padding: 16,
  },
  studentCard: {
    marginBottom: 16,
    elevation: 2,
  },
  email: {
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

export default StudentsScreen;