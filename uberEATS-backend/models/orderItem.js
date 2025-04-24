'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    static associate(models) {
      OrderItem.belongsTo(models.Order, { foreignKey: "orderId" });
    }
  }
  
  OrderItem.init({
    orderId: { type: DataTypes.INTEGER, allowNull: false },
    menuItemId: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING },
    image: { type: DataTypes.STRING },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
  }, {
    sequelize,
    modelName: 'OrderItem',  // Ensuring correct naming
  });

  return OrderItem;
};
