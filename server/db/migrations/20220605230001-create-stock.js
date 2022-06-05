'use strict'
module.exports = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('stocks')
  },
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('stocks', {
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      pageTitle: {
        type: Sequelize.TEXT,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      url: {
        type: Sequelize.TEXT,
      },
    })
  },
}
