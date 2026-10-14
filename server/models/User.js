import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    name: String,
    avatar: String,
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', userSchema);