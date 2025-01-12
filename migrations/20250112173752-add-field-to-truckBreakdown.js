'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('TruckBreakDowns', 'status', {
      type: Sequelize.ENUM('opened', 'closed'), 
      allowNull: false,                        
      defaultValue: 'opened',                  
    });
  },

  async down(queryInterface, Sequelize) {

    await queryInterface.removeColumn('TruckBreakDowns', 'status');

    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_TruckBreakDowns_status";');
  },
};
