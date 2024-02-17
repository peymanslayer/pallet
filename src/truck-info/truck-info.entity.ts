import { Column, Model, Table } from 'sequelize-typescript';

@Table
// comment: used for info truck in "truck-break-down"
export class TruckInfo extends Model<TruckInfo> {
  // comment: driverId in this model derived from "id" of driver model !!!
  // comment: this impelement by peyman(first devloper of project)
  @Column
  driverId: number;

  // @Column
  // driverName: string;

  // @Column
  // driverMobile: string;

  @Column
  lastCarLife: string;

  // comment: store last state of truck based on lowest asnwer's of checkList daily
  @Column
  state: string;

  @Column
  carNumber: string;

  @Column
  type: string;

  @Column
  zone: string;
}
