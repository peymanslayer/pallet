export const PeriodicTruckCheckType = [
  { id: 1, name: 'روغن موتور', type: 'enginOil' },

  { id: 2, name: 'معاینه فنی', type: 'technicalInspection' },

  { id: 3, name: 'لاستیک', type: 'tire' },

  { id: 4, name: 'شمع', type: 'sparkPlug' },

  { id: 5, name: 'لنت', type: 'pad' },

  { id: 6, name: 'روغن گیربکس', type: 'gearboxOil' },

  { id: 7, name: 'دیسک ترمز', type: 'brakeDisc' },

  { id: 8, name: 'تسمه', type: 'belt' },

  { id: 9, name: 'صفحه کلاچ', type: 'clutch' },

  { id: 10, name: 'لنت کاسه ای', type: 'padBowl' },
];
export enum PeriodicTruckCheckTypes {
  enginOil = 'enginOil',
  technicalInspection = 'technicalInspection',
  tire = 'tire',
  sparkPlug = 'sparkPlug',
  pad = 'pad',
  gearboxOil = 'gearboxOil',
  brakeDisc = 'brakeDisc',
  belt = 'belt',
  clutch = 'clutch',
  padBowl = 'padBowl',
}
export const offsetDaysEndDatePeriodicTruckCheck = 1;
export const alertKilometerPeriodicTruckCheck = 5000;
// MID: check how to impact to a structure ? usefully?
export const offsetKilometerPeriodicTargetTire = 80000;
export const offsetKilometerPeriodicTargetSparkPlug = 20000;
export const offsetKilometerPeriodicTargetEngineOil = 5000;
export const offsetKilometerPeriodicTargetPad = 20000;
export const offsetKilometerPeriodicTargetBrakeDisc = 60000;
export const offsetKilometerPeriodicTargetGearboxOil = 60000;
export const offsetKilometerPeriodicTargetBelt = 50000;
export const offsetKilometerPeriodicTargetPadBowl = 80000;
export const offsetKilometerPeriodicTargetClutch = 60000;
