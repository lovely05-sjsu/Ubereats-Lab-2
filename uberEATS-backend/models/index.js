'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '../config/config.json'))[env]; // ✅ Fixed path issue

// Force the host to be "mysql-db" if not overridden by an environment variable
config.host = process.env.DB_HOST || 'mysql';
console.log("Using DB host:", config.host);

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Read all model files and initialize them
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Establish associations if they exist
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Restaurant = require("./restaurant")(sequelize, Sequelize.DataTypes);
db.MenuItem = require('./menuItem')(sequelize, Sequelize.DataTypes);
db.Review = require('./review')(sequelize, Sequelize.DataTypes);
db.RestaurantProfile = require("./restaurantProfile")(sequelize, Sequelize.DataTypes);
db.Favorite = require("./favorites")(sequelize, Sequelize.DataTypes);

// Define associations
db.Restaurant.hasMany(db.MenuItem, { foreignKey: 'restaurant_id', as: 'menuItems' });
db.Restaurant.hasMany(db.Review, { foreignKey: 'restaurant_id', as: 'reviews' });
db.MenuItem.belongsTo(db.Restaurant, { foreignKey: 'restaurant_id', as: 'restaurant' });
db.Review.belongsTo(db.Restaurant, { foreignKey: 'restaurant_id', as: 'restaurant' });
db.Favorites.belongsTo(db.Restaurant, { foreignKey: "restaurantId", as: 'restaurant' });


module.exports = db;
