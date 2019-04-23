'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Plans', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING
      },
      price_per_period: {
        type: Sequelize.INTEGER,
      },
      billing_period: {
        type: Sequelize.ENUM('monthly', 'yearly'),
      },
      discount_pct: {
        type: Sequelize.INTEGER,
      },
      stripe_PlanId: {
        type: Sequelize.STRING,
      },
      stripe_ProductId: {
        type: Sequelize.STRING,
      },
      /* Features as text */
      feature1: {
        type: Sequelize.STRING
      },
      feature2: {
        type: Sequelize.STRING
      },
      feature3: {
        type: Sequelize.STRING
      },
      feature4: {
        type: Sequelize.STRING
      },
      feature5: {
        type: Sequelize.STRING
      },
      feature6: {
        type: Sequelize.STRING
      },
      feature7: {
        type: Sequelize.STRING
      },
      feature8: {
        type: Sequelize.STRING
      },
      feature9: {
        type: Sequelize.STRING
      },
      feature10: {
        type: Sequelize.STRING
      },
      cta: {
        type: Sequelize.STRING,
      },
      /* Order on page. */
      rank: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Plans');
  }
};