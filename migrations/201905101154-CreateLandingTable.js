'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Landings', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      title_tag: {
        type: Sequelize.STRING,
      },
      description_tag: {
        type: Sequelize.STRING,
      },
      /* Features as text */
      title: {
        type: Sequelize.STRING
      },
      subtitle: {
        type: Sequelize.STRING
      },
      paragraph1: {
        type: Sequelize.STRING
      },
      paragraph2: {
        type: Sequelize.STRING
      },
      paragraph3: {
        type: Sequelize.STRING
      },
      button_cta: {
        type: Sequelize.STRING
      },
      video_url: {
        type: Sequelize.STRING
      },
      redirect_url: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('Landings');
  }
};