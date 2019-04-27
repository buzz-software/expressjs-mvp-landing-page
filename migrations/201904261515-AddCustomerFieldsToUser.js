'use strict';

// All the columns will be added here 
const stringColumnNames = [
  'stripe_SubscriptionId', 'stripe_CustomerId',
];

let columnAndTypes = stringColumnNames.map(c => {
  return {
    name: c,
    type: (Sequelize) => {
      return {
        type: Sequelize.STRING,
        allowNull: true,
      }
    }
  }
});


columnAndTypes = columnAndTypes.concat({
  name: 'is_customer',
  type: (Sequelize) => {
    return {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false
    }
  }
});

// For user belongs to plan, plan has many users:
columnAndTypes = columnAndTypes.concat({
  name: 'PlanId',
  type: (Sequelize) => {
    return {
      type: Sequelize.UUID,
      references: {
        model: 'Plans', // name of Target model
        key: 'id', // key in Target model that we're referencing
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    }
  }
});

// Don't change it
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all(
      columnAndTypes.map(c => {
        return queryInterface.addColumn(
          'Users',
          c.name,
          c.type(Sequelize)
        )
      })
    ).then(() => {
      return queryInterface.addColumn('Users', 'PlanId', {
        type: Sequelize.UUID,
        references: {
          model: 'Plans', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      })
    });
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all(
      columnAndTypes.map(c => {
        return queryInterface.removeColumn(
          'Users',
          c.name,
        )
      })
    )
  }
};

