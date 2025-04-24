module.exports = (sequelize, DataTypes) => {
    const MenuItem = sequelize.define('MenuItem', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
      },
      rating: {
        type: DataTypes.DECIMAL(3, 1),
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
      },
    }, {
      timestamps: true,
      tableName: 'menu_items',
    });
  
    // MenuItem belongs to a single Restaurant
    MenuItem.associate = (models) => {
      MenuItem.belongsTo(models.Restaurant, {
        foreignKey: 'restaurant_id',
        as: 'restaurant',
      });
    };
  
    return MenuItem;
  };
  