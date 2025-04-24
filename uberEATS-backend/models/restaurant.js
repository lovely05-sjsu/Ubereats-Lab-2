module.exports = (sequelize, DataTypes) => {
    const Restaurant = sequelize.define('Restaurant', {
      // Primary key (id)
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
  
      // Restaurant name
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
  
       // Restaurant category
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      // City (optional if needed)
      city: {
        type: DataTypes.STRING,
      },
  
      // Rating (using DECIMAL to store floating-point numbers with one decimal place)
      rating: {
        type: DataTypes.DECIMAL(3, 1),
        allowNull: false,
        defaultValue: 0
      },
  
      // Delivery fee (DECIMAL for monetary values)
      deliveryFee: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 1.5
      },
  
      // Arrival time (in minutes)
      arrivalTime: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 30
      },
  
      // Full address of the restaurant
      address: {
        type: DataTypes.STRING,
      },
  
      // Distance in minutes (calculated or hardcoded)
      distance: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
  
      // A short description of the restaurant
      description: {
        type: DataTypes.STRING,
      },
  
      // Image path to the restaurant's image
      image: {
        type: DataTypes.STRING,
      },
  
      // Email (unique, if used for contact or authentication purposes)
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
  
    }, {
      // Timestamps for createdAt and updatedAt
      timestamps: true,
  
      // Optionally, define table name explicitly
      tableName: 'restaurants',
    });
  
    // Restaurant has many menu items
    Restaurant.associate = (models) => {
      Restaurant.hasMany(models.MenuItem, {
        foreignKey: 'restaurant_id',
        as: 'menuItems',
      });
      Restaurant.hasMany(models.Review, {
        foreignKey: 'restaurant_id',
        as: 'reviews',
      });
    };
  
    return Restaurant;
  };
  