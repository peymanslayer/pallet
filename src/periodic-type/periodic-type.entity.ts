import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class PeriodicType extends Model<PeriodicType> {
  @Column
  name: string;

  @Column({ unique: true })
  type: string;

  @Column
  periodicKilometer: number;
}

//  { id: 1, name: 'روغن موتور', type: 'enginOil' },

// { id: 2, name: 'معاینه فنی', type: 'technicalInspection' },

// { id: 3, name: 'لاستیک', type: 'tire' },

// { id: 4, name: 'شمع', type: 'sparkPlug' },

// { id: 5, name: 'لنت', type: 'pad' },

// { id: 6, name: 'روغن گیربکس', type: 'gearboxOil' },

// { id: 7, name: 'دیسک ترمز', type: 'brakeDisc' },

// { id: 8, name: 'تسمه', type: 'belt' },

// { id: 9, name: 'صفحه کلاچ', type: 'clutch' },

// { id: 10, name: 'لنت کاسه ای', type: 'padBowl' },
