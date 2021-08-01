'use strict'

module.exports = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'posts',
      [
        {
          title: 'jack trance',
          body: 'take me away to the post',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: 'pot of greed',
          body: 'next time down',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    )
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('posts', null, {})
  },
}
