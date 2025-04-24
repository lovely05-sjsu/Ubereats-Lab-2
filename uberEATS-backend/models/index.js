'use strict';

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const db = {};
const basename = path.basename(__filename);
const modelsPath = __dirname;

// Read all model files in the current directory (except this file and any test files)
// and add the Mongoose models to the db object.
fs.readdirSync(modelsPath)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(modelsPath, file));
    // Ensure the model has a modelName property (as Mongoose models do)
    if (model.modelName) {
      db[model.modelName] = model;
    }
  });

// Optionally, you can also export the mongoose connection itself
db.mongoose = mongoose;

module.exports = db;
