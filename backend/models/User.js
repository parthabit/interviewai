const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  college: String,
  targetRole: String,
  targetCompanies: [String],
  plan: { type: String, enum: ['Free', 'Pro', 'Premium'], default: 'Free' },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  streak: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now },
  totalInterviews: { type: Number, default: 0 },
  avgScore: { type: Number, default: 0 },
  certificates: [{ title: String, earnedAt: Date, category: String }],
  rank: { type: Number, default: 0 },
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.comparePassword = function(pwd) {
  return bcrypt.compare(pwd, this.password);
};

UserSchema.methods.toSafeObject = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', UserSchema);
