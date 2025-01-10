'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('CheckLists', 'carNumber', {type : Sequelize.INTEGER});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('CheckLists', 'carNumber');
  }
};
