'use strict';

// Database representation of an AWS S3 file (object).
module.exports = (sequelize, DataTypes) => {
  const File = sequelize.define('File', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true,
      defaultValue: DataTypes.UUIDV4,
    },
    path: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
    },
    is_deletable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });
  File.associate = function(models) {
  }
  return File;
};