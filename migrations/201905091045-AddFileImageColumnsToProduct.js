

'use strict';

let columnAndTypes = [];

// For user belongs to plan, plan has many users:
columnAndTypes = columnAndTypes.concat({
  name: 'FileId',
  type: (Sequelize) => {
    return {
      type: Sequelize.UUID,
      references: {
        model: 'Files', // name of Target model
        key: 'id', // key in Target model that we're referencing
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    }
  }
}, {
  name: 'ImageId',
  type: (Sequelize) => {
    return {
      type: Sequelize.UUID,
      references: {
        model: 'Files', // name of Target model
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
          'Products',
          c.name,
          c.type(Sequelize)
        )
      })
    )
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all(
      columnAndTypes.map(c => {
        return queryInterface.removeColumn(
          'Products',
          c.name,
        )
      })
    )
  }
};