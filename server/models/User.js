import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now },
  watchlist: [
    {
      movieId: { type: String, required: true },
      addedAt: { type: Date, default: Date.now }
    }
  ],
  ratings: [
    {
      movieId: { type: String, required: true },
      rating: { type: Number, required: true, min: 1, max: 5 },
      ratedAt: { type: Date, default: Date.now }
    }
  ]
})

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.model('User', userSchema, 'users')
