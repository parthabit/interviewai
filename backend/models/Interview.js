const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['technical', 'hr', 'system'], required: true },
  topic: String,
  company: String,
  messages: [{ role: { type: String, enum: ['user', 'ai'] }, content: String, timestamp: { type: Date, default: Date.now } }],
  scores: { overall: Number, communication: Number, confidence: Number, clarity: Number, technical: Number },
  duration: Number,
  status: { type: String, enum: ['active', 'completed', 'abandoned'], default: 'active' },
  feedback: [{ text: String, type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Interview', InterviewSchema);
