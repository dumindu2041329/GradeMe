import Student from '../models/Student.js';
import bcrypt from 'bcryptjs';

// Get all students
export const getStudents = async (req, res) => {
  try {
    const students = await Student.find().select('-password');
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single student
export const getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select('-password');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new student
export const createStudent = async (req, res) => {
  try {
    const { password, ...studentData } = req.body;
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const student = new Student({
      ...studentData,
      password: hashedPassword
    });
    
    const savedStudent = await student.save();
    const { password: _, ...studentResponse } = savedStudent.toObject();
    
    res.status(201).json(studentResponse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a student
export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    const { password, ...updateData } = req.body;
    
    // If password is being updated, hash it
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateData.password = hashedPassword;
    }
    
    Object.assign(student, updateData);
    const updatedStudent = await student.save();
    const { password: _, ...studentResponse } = updatedStudent.toObject();
    
    res.status(200).json(studentResponse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a student
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    await student.deleteOne();
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};