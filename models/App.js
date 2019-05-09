/* jshint indent: 2 */

'use strict';
module.exports = (sequelize, DataTypes) => {
  var App  = sequelize.define('App', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      
      allowNull: false,
      primaryKey: true
    },
    domain: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return App;
};