'use strict';
module.exports = (sequelize, DataTypes) => {

  // This is our own Plan model that also incorporates Stripe plan structure.
  var Product = sequelize.define('Product', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING
    },
    price: {
      type: DataTypes.INTEGER,
    },
    description: {
      type: DataTypes.INTEGER,
    },
    discount_pct: {
      type: DataTypes.INTEGER,
    },
    stripe_ProductId: { 
      type: DataTypes.STRING,
    },
    stripe_SkuId: {
      type: DataTypes.STRING
    },
    feature1: {
      type: DataTypes.STRING
    },
    feature2: {
      type: DataTypes.STRING
    },
    feature3: {
      type: DataTypes.STRING
    },
    feature4: {
      type: DataTypes.STRING
    },
    feature5: {
      type: DataTypes.STRING
    },
    feature6: {
      type: DataTypes.STRING
    },
    feature7: {
      type: DataTypes.STRING
    },
    feature8: {
      type: DataTypes.STRING
    },
    feature9: {
      type: DataTypes.STRING
    },
    feature10: {
      type: DataTypes.STRING
    },
    // Call to action
    cta: {
      type: DataTypes.STRING
    },
    /* Order on page. */
    rank: {
      type: DataTypes.INTEGER
    },
  });

  // ForeignKey: How you want to name this model's key in the join table.
  // OtherKey: How you want to name the opposite model's key in the join table.

  Product.associate = function(models) {
    Product.belongsToMany(models.User, { through: "PurchasedProduct", as: "Buyers", foreignKey: "ProductId", otherKey: "UserId"  });
  }
  return Product;
};