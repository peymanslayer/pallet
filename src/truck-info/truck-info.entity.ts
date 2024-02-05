import { Column, Model, Table } from 'sequelize-typescript';

@Table
// used for info truck in "truck-break-down"
export class TruckInfo extends Model<TruckInfo> {
  @Column
  driverId: number;

  @Column
  lastCarLife: string;

  // store last state of truck based on lowest asnwer's of checkList daily
  @Column
  state: string;

  @Column
  carNumber: string;

  @Column
  type: string;

  @Column
  zone: string;
}
