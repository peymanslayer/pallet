export class UpdateTruckBreakDownDto {
  repairmanComment: string;

  transportComment: string;

  transportCommentHistory?: string;

  historySendToRepair: string;

  historyReciveToRepair: string;

  histroyDeliveryTruck: string;

  historyDeliveryDriver: string;

  logisticConfirm: boolean;

  historyLogisticComment: string

  hoursTransportComment: string

  hoursLogisticComment: string

  piece: string;
}
