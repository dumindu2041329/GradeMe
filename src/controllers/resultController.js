import Result from '../models/Result.js';

// Get all results
export const getResults = async (req, res) => {
  try {
    const results = await Result.find()
      .populate('student', '-password')
      .populate('exam');
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single result
export const getResult = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate('student', '-password')
      .populate('exam');
    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get results by student
export const getStudentResults = async (req, res) => {
  try {
    const results = await Result.find({ student: req.params.studentId })
      .populate('exam')
      .sort('-submittedAt');
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get results by exam
export const getExamResults = async (req, res) => {
  try {
    const results = await Result.find({ exam: req.params.examId })
      .populate('student', '-password')
      .sort('-submittedAt');
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new result
export const createResult = async (req, res) => {
  try {
    const result = new Result(req.body);
    const savedResult = await result.save();
    const populatedResult = await Result.findById(savedResult._id)
      .populate('student', '-password')
      .populate('exam');
    res.status(201).json(populatedResult);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a result (e.g., for grading)
export const updateResult = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }
    
    Object.assign(result, req.body);
    if (req.body.answers) {
      result.gradedAt = new Date();
    }
    
    const updatedResult = await result.save();
    const populatedResult = await Result.findById(updatedResult._id)
      .populate('student', '-password')
      .populate('exam');
    
    res.status(200).json(populatedResult);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a result
export const deleteResult = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }
    
    await result.deleteOne();
    res.status(200).json({ message: 'Result deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};