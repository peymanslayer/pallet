const { QueryTypes } = require('sequelize');

async function updateQuestions(queryInterface) {
  const defaultValues = {
    question_1: "سیستم سوخت رسانی",
    question_2: "فنرهای جلو و عقب",
    question_3: "سرویس روغن",
    question_4: "جلوبندی",
    question_5: "گیربکس (دیسک صفحه)",
    question_6: "موتور",
    question_7: "صافکاری - نقاشی",
    question_8: "استیکر تبلیغاتی",
    question_9: "لاستیک",
    question_10: "سرویس های چرخ (ترمز - لنت و...)",
    question_11: "سیم کشی - باطری سازی",
    question_12: "کولر ( سیستم خنک کننده )",
    question_13: "هیدرولیک",
    question_14: "سیستم (ABS)",
    question_15: "شیشه و بالابر",
    question_16: "دیفرانسیل",
    question_17: "تزیینات داخلی ماشین",
    question_18: "کارواش",
    question_19: "کانتین",
    question_20: "لیفت بک",
    question_21: "انژکتور (پمپ و..)",
    question_22: "بخاری (سیستم گرمایشی)",
    question_23: "تراشکاری",
    question_24: "جک پالت",
    question_25: "چادر سازی",
    question_26: "کابین عقب و جلو",
    question_27: "لوازم یدکی",
    question_28: "حمل با جرثقیل",
    question_29: "کانتین و چادر",
    question_30: "صندلی",
    question_31: "اگزوز ماشین",
    question_32: "زاپاس بند",
    question_33: "تعمیر توربو شارژ",
    question_34: "اجرت خدمات",
  };

  for (const [question, defaultValue] of Object.entries(defaultValues)) {
    await queryInterface.sequelize.query(
      `UPDATE \`TruckBreakDownItems\` 
       SET \`${question}\` = :defaultValue 
       WHERE \`${question}\` IS NULL;`,
      {
        replacements: { defaultValue },
        type: QueryTypes.UPDATE,
      }
    );
  }
}

module.exports = {
  up: async (queryInterface) => {
    await updateQuestions(queryInterface);
  },
  down: async (queryInterface) => {
    // در صورت نیاز، این بخش برای بازگرداندن تغییرات کامل شود.
  },
};
