const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Favorites extends Model {}

  Favorites.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users", // Ensure this matches the actual table name
          key: "id",
        },
        onDelete: "CASCADE",
      },
      restaurantId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "restaurants", // Ensure this matches the actual table name
          key: "id",
        },
        onDelete: "CASCADE",
      },
    },
    {
      sequelize,
      modelName: "Favorites",
      tableName: "favorites",
      timestamps: true,
    }
  );

  return Favorites;
};
