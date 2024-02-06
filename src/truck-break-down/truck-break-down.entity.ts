import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class TruckBreakDown extends Model {
  @Column
  truckBreakDownItemsId: number;

  @Column
  driverId: string;

  @Column
  driverName: string;

  @Column
  driverMobile: string;

  @Column
  numberOfBreakDown: number;

  //this field in truckInfo not used in this report(maybe) FALSE
  // for not join in each report add this model
  @Column
  carNumber: string;

  @Column
  carLife: number;

  @Column
  hoursDriverRegister: string;

  @Column
  historyDriverRegister: string;

  @Column
  repairComment: string;

  @Column
  hoursRepairComment: string;

  @Column
  historyRepairComment: string;

  @Column
  hoursSendToRepair: string;

  @Column
  historySendToRepair: string;

  @Column
  hoursReciveToRepair: string;

  @Column
  historyReciveToRepair: string;
}
