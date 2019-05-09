/* jshint indent: 2 */

/* Tracks all products a user has already purchased */

'use strict';
module.exports = (sequelize, DataTypes) => {
  var PurchasedProduct = sequelize.define('PurchasedProduct', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
  });
  return PurchasedProduct;
};
