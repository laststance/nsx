'use strict'

module.exports = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('authors', null, {})
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'authors',
      [
        {
          name: 'John Doe',
          // hash of 'popcoon',
          createdAt: new Date(),
          password:
            '$2b$10$PDIcmRmxvgVeIaa/c9AWiu4wRQD7EwBjczFqVDjgMtsj4.To0W5aC',
          updatedAt: new Date(),
        },
      ],
      {},
    )
  },
}
