'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('RepairInvoices', 'comment', {
      type: Sequelize.TEXT, 
      allowNull: true,                                          
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('RepairInvoices', 'comment');
  }
};
