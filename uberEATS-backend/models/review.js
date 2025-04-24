module.exports = (sequelize, DataTypes) => {
    const Review = sequelize.define('Review', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rating: {
        type: DataTypes.DECIMAL(3, 1),
        allowNull: false,
      },
      comment: {
        type: DataTypes.TEXT,
      },
    }, {
      timestamps: true,
      tableName: 'reviews',
    });
  
    // Review belongs to a single Restaurant
    Review.associate = (models) => {
      Review.belongsTo(models.Restaurant, {
        foreignKey: 'restaurant_id',
        as: 'restaurant',
      });
    };
  
    return Review;
  };
  