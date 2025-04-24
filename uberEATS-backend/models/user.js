'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required.']
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, 'Please use a valid email address.']
    },
    password: {
      type: String,
      required: [true, 'Password is required.']
    },
    address: {
      type: String,
      required: [true, 'Address is required.']
    },
    country: {
      type: String,
      required: [true, 'Country is required.']
    },
    state: {
      type: String,
      required: [true, 'State is required.']
    },
    type: {
      type: String,
      required: [true, 'User type is required.'],
      enum: {
        values: ['customer', 'restaurant'],
        message: 'User type must be either customer or restaurant.'
      }
    }
  },
  { timestamps: true }
);

// Pre-save middleware to hash the password if it has been modified (or is new)
userSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) return next();
    // Generate a salt and hash the password using bcrypt
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Instance method to compare a plaintext password with the hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
