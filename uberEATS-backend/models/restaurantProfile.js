'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RestaurantProfile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here (if needed in future)
      // Example: RestaurantProfile.hasMany(models.Order, { foreignKey: "restaurantId" });
    }
  }

  RestaurantProfile.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING, 
      allowNull: false,
      unique: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  }, {
    sequelize,
    modelName: 'RestaurantProfile',
    tableName: 'restaurantProfile',
    timestamps: false, // Disable updatedAt
  });

  return RestaurantProfile;
};
