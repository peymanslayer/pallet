'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // افزودن ایندکس به ستون carNumber در جدول TruckInfos
    await queryInterface.addIndex('TruckInfos', ['carNumber'], {
      name: 'idx_truckinfos_carnumber',
      unique: true, // در صورت نیاز به یکتایی
    });

    // افزودن کلید خارجی به ستون carNumber در جدول RepairInvoices
    await queryInterface.addConstraint('RepairInvoices', {
      fields: ['carNumber'],
      type: 'foreign key',
      name: 'fk_repairinvoice_truckinfo',
      references: {
        table: 'TruckInfos',
        field: 'carNumber',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });
  },

  async down(queryInterface, Sequelize) {
    // حذف کلید خارجی از جدول RepairInvoices
    await queryInterface.removeConstraint('RepairInvoices', 'fk_repairinvoice_truckinfo');

    // حذف ایندکس از ستون carNumber در جدول TruckInfos
    await queryInterface.removeIndex('TruckInfos', 'idx_truckinfos_carnumber');
  },
};
