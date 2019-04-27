'use strict';
module.exports = (sequelize, DataTypes) => {

  // This is our own Plan model that also incorporates Stripe plan structure.
  var Plan = sequelize.define('Plan', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING
    },
    price_per_period: {
      type: DataTypes.INTEGER,
    },
    billing_period: {
      type: DataTypes.ENUM('monthly', 'yearly'),
    },
    discount_pct: {
      type: DataTypes.INTEGER,
    },
    stripe_PlanId: {
      type: DataTypes.STRING,
    },
    stripe_ProductId: { 
      type: DataTypes.STRING,
    },
    /* Features as text */
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

  Plan.associate = function(models) {
    Plan.hasMany(models.User);
  }
  return Plan;
};