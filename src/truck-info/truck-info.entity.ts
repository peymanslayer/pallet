import { Column, Model, Table } from 'sequelize-typescript';

@Table
// used for info truck in "truck-break-down"
export class TruckInfo extends Model<TruckInfo> {
  @Column
  driverId: number;

  @Column
  lastCarLife: string;

  @Column
  carNumber: string;
}
