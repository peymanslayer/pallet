// MID: use for filter and manage status "truckBreakDown"
export enum TruckBreakDownStatus {
  todo, // activity necessary to do
  inprogress, // activity inProgress
  done, // activity done
}

export enum PeriodicTruckCheckType {
  engineOil = 'engineOil',

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

export enum CartexType {
  insideCompany = 'insideCompany' ,
  outsideCompany = 'outsideCompany' ,
  insideZone = 'insideZone' ,
  inTehran = 'inTehran'
}

export enum SwaggerConsumes {
  Urlencoded = "application/x-www-form-urlencoded",
  Json = "application/json",
  Multipart = "multipart/form-data",
}


// export enum PeriodicTruckCheckType {
//   engineOil = 'روغن موتور',

//   technicalInspection = 'معاینه فنی',

//   tire = 'لاستیک',

//   sparkPlug = 'شمع',

//   pad = 'لنت',

//   gearboxOil = 'روغن گیربکس',

//   brakeDisc = 'دیسک ترمز',

//   belt = 'تسمه',

//   clutch = 'صفحه کلاچ',

//   padBowl = 'لنت کاسه ای',
// }
