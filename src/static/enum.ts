//provided by "mr.aalayi"
export enum CAR_NUMBER {
  // userId = carNumber ,
  id140 = '۷۹ع۶۷۸', // "hamid ghiyasvand"
  //141 not have carNumber "hadi kiyan far"
  id142 = '۹۳َع۷۵۸', // "saeed ahmadi"
  id143 = '۹۹ع۹۷۸', // "mahdi rouzbayani"
  id145 = '۲۱ع۴۵۱', // "mahdi rajbar"
  id146 = '۹۱غ۹۶۳', // "akbar torabi"
  id147 = '۵۷ع۱۶۲', // "reza kamrani"
  id148 = '۱۹ع۹۴۹', // "nader shahroudi"
  id149 = '۹۶ع۱۵۸', // "amirhosein safar ali"
  id150 = '۶۵ع۴۶۲', // "mahdi pour atta"
  id151 = '۳۸ع۳۴۹', // "mohammad reza yamani"
  id152 = '۱۸ع۱۴۸', // "hasan ghoreyshi"
  id153 = '۹۴غ۶۵۷', // "ebrahim safari"
  id154 = '۷۵و۷۸۴', // "sadegh feli"
  id155 = '۱۹ع۲۴۸', // "omid shakhsi"
  id263 = '۹۹غ۴۶۲', // "davoud rahmani"
}

export enum ROLES {
  USER = 'user',
  DRIVER = 'driver',
  COMPANYDRIVER = 'companyDriver',
  OPERATOR = 'operator',
  ADMIN = 'admin',
  RECEIVESTOCK = 'ReceiveStock',
  USERADMIN = 'userAdmin',
  TRANSPORTADMIN = 'transportAdmin',
  LOGISTICMANAGER = 'logisticsManager',
  REPAIRSHOP = 'repairShop',
  SUPERADMIN = 'superAdmin',
}

export const FIELDS_OF_EXCEL_REPORT_TRANSPORT_ADMIN = [
  'driverName',
  'driverMobile',
  'numberOfBreakDown',
  'carNumber',
  'carLife',
  'hoursDriverRegister',
  'historyDriverRegister',
  'logisticConfirm',
  'transportComment',
  'historySendToRepair',
  'historyReciveToRepair',
  'historyDeliveryDriver',
  'piece',
  'repairmanComment',
  'hoursRepairComment',
  'historyRepairComment',
  'logisticComment',
];

export const getEnumsString = function (roles: object) {
  const values = Object.values(roles);
  let valuesString = [];
  for (let item of values) {
    valuesString.push(item);
  }
  return valuesString;
};

export enum CHECKLIST_ANSWERS {
  GOOD = 'good',
  MID = 'medium',
  BAD = 'weak',
}

export enum MESSAGE_ALERT {
  truckBreakDown_limit_register = 'شما یک ثبت خرابی بررسی نشده توسط تعمیرگاه دارید',
}
