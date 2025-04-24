'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, { foreignKey: "customerId" });
      Order.belongsTo(models.Restaurant, { foreignKey: "restaurantId" });
      Order.hasMany(models.OrderItem, { foreignKey: "orderId", as: "items" }); // Updated to use OrderItem
    }
  }
  
  Order.init({
    customerId: { type: DataTypes.INTEGER, allowNull: false },
    restaurantId: { type: DataTypes.INTEGER, allowNull: false },
    restaurantProfileId: { type: DataTypes.INTEGER, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
    isDelivery: { type: DataTypes.BOOLEAN, allowNull: false },
    orderStatus: { type: DataTypes.STRING, defaultValue: 'Pending' },
  }, {
    sequelize,
    modelName: 'Order',
  });

  return Order;
};
