'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // لیستی از ستون‌ها و مقادیر پیش‌فرض
    const columns = [
      { name: 'question_1', defaultValue: 'سیستم سوخت رسانی' },
      { name: 'question_2', defaultValue: 'فنرهای جلو و عقب' },
      { name: 'question_3', defaultValue: 'سرویس روغن' },
      { name: 'question_4', defaultValue: 'جلوبندی' },
      { name: 'question_5', defaultValue: 'گیربکس (دیسک صفحه)' },
      { name: 'question_6', defaultValue: 'موتور' },
      { name: 'question_7', defaultValue: 'صافکاری - نقاشی' },
      { name: 'question_8', defaultValue: 'استیکر تبلیغاتی' },
      { name: 'question_9', defaultValue: 'لاستیک' },
      { name: 'question_10', defaultValue: 'سرویس های چرخ (ترمز - لنت و...)' },
      { name: 'question_11', defaultValue: 'سیم کشی - باطری سازی' },
      { name: 'question_12', defaultValue: 'کولر ( سیستم خنک کننده )' },
      { name: 'question_13', defaultValue: 'هیدرولیک' },
      { name: 'question_14', defaultValue: 'سیستم (ABS)' },
      { name: 'question_15', defaultValue: 'شیشه و بالابر' },
      { name: 'question_16', defaultValue: 'دیفرانسیل' },
      { name: 'question_17', defaultValue: 'تزیینات داخلی ماشین' },
      { name: 'question_18', defaultValue: 'کارواش' },
      { name: 'question_19', defaultValue: 'کانتین' },
      { name: 'question_20', defaultValue: 'لیفت بک' },
      { name: 'question_21', defaultValue: 'انژکتور (پمپ و..)' },
      { name: 'question_22', defaultValue: 'بخاری (سیستم گرمایشی)' },
      { name: 'question_23', defaultValue: 'تراشکاری' },
      { name: 'question_24', defaultValue: 'جک پالت' },
      { name: 'question_25', defaultValue: 'چادر سازی' },
      { name: 'question_26', defaultValue: 'کابین عقب و جلو' },
      { name: 'question_27', defaultValue: 'لوازم یدکی' },
      { name: 'question_28', defaultValue: 'حمل با جرثقیل' },
      { name: 'question_29', defaultValue: 'کانتین و چادر' },
      { name: 'question_30', defaultValue: 'صندلی' },
      { name: 'question_31', defaultValue: 'اگزوز ماشین' },
      { name: 'question_32', defaultValue: 'زاپاس بند' },
      { name: 'question_33', defaultValue: 'تعمیر توربو شارژ' },
      { name: 'question_34', defaultValue: 'اجرت خدمات' },
    ];

    // تنظیم مقادیر پیش‌فرض
    for (const column of columns) {
      await queryInterface.changeColumn('TruckBreakDownItems', column.name, {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: column.defaultValue,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const columns = [
      'question_1',
      'question_2',
      'question_3',
      'question_4',
      'question_5',
      'question_6',
      'question_7',
      'question_8',
      'question_9',
      'question_10',
      'question_11',
      'question_12',
      'question_13',
      'question_14',
      'question_15',
      'question_16',
      'question_17',
      'question_18',
      'question_19',
      'question_20',
      'question_21',
      'question_22',
      'question_23',
      'question_24',
      'question_25',
      'question_26',
      'question_27',
      'question_28',
      'question_29',
      'question_30',
      'question_31',
      'question_32',
      'question_33',
      'question_34',
    ];

    // حذف مقادیر پیش‌فرض
    for (const column of columns) {
      await queryInterface.changeColumn('TruckBreakDownItems', column, {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null,
      });
    }
  },
};
