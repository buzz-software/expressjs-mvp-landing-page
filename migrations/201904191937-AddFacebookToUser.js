'use strict';

// All the columns will be added here 
const stringColumnNames = [
  'facebookId', 'facebookAccessToken', 'facebookRefreshToken', 'facebookUsername', 'facebookDisplayName'
];

const columnAndTypes = stringColumnNames.map(c => {
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
    );
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

