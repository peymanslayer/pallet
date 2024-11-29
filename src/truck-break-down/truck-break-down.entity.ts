import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { TruckBreakDownStatus } from 'src/common/enum';

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

  @Column({ defaultValue: false })
  logisticConfirm: boolean;

  @Column
  logisticComment: string;

  @Column(DataType.ENUM('necessary', 'notNecessary', 'immediately'))
  transportComment: string;

  @Column
  transportCommentHistory: string;

  @Column({ defaultValue: false })
  notifyTransportComment: boolean;

  @Column
  repairmanComment: string;

  @Column({ defaultValue: false })
  notifyRepairmanComment: boolean;

  @Column
  hoursRepairComment: string;

  @Column
  historyRepairComment: string;

  @Column
  historySendToRepair: string;

  @Column
  historyReciveToRepair: string;

  @Column
  histroyDeliveryTruck: string;

  // history of register repairman "deliver truck to driver after repair"
  @Column
  historyDeliveryDriver: string;

  @Column
  piece: string;

  @Column
  lastFetch: Date;

  // MID: manage filter "TruckBreakDown"
  // @Column
  // status: TruckBreakDownStatus;
}
