'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('CheckLists', 'truckId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'TruckInfos', // نام جدول مقصد (TruckInfo)
        key: 'id', // نام کلید اصلی در جدول مقصد
      },
      onUpdate: 'CASCADE', // وقتی رکورد در جدول مقصد تغییر می‌کند
      onDelete: 'SET NULL', // وقتی رکورد در جدول مقصد حذف می‌شود
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('CheckList', 'truckId');
  }
};
