'use strict'
module.exports = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('authors')
  },

  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('authors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      password: {
        type: Sequelize.TEXT,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },
}
