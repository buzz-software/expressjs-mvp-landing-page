'use strict';


const columnAndTypes = [{
  name: 'is_admin',
  type: (Sequelize) => {
    return {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false
    }
  }
}];

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