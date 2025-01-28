'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('TruckBreakDowns', 'hoursLogisticComment', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn('TruckBreakDowns', 'historyLogisticComment', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn('TruckBreakDowns', 'hoursTransportComment', {
      type: Sequelize.STRING,
      allowNull: false, 
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('TruckBreakDowns', 'hoursLogisticComment');
    await queryInterface.removeColumn('TruckBreakDowns', 'historyLogisticComment');
    await queryInterface.removeColumn('TruckBreakDowns', 'hoursTransportComment');
  }
};