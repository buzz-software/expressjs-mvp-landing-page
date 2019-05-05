/* jshint indent: 2 */

'use strict';
module.exports = (sequelize, DataTypes) => {
  var Lead = sequelize.define('Mailchimp', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    listid: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    api_key: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return Lead;
};