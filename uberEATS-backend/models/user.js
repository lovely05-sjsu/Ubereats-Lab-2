'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // User can have many orders
      User.hasMany(models.Order, { foreignKey: "customerId" }); 
    }
  }

  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false, // Name is required
    },
    email: {
      type: DataTypes.STRING,
      unique: true, // Email must be unique
      allowNull: false, // Email is required
      validate: {
        isEmail: true // Ensure it's a valid email
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    address:{
      type: DataTypes.STRING,
      allowNull: false, 
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false, // Country is required
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false, // State is required
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false, // Type could indicate if user is a customer or restaurant
      validate: {
        isIn: [['customer', 'restaurant']] // Ensure it's either customer or restaurant
      }
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};
