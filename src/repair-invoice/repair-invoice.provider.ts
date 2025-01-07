import { RepairInvoice } from "./rapair-invoice.entity";

export const RepairInvoiceProviders = [
    {
      provide: 'REPAIRINVOICE_REPOSITORY',
      useValue: RepairInvoice,
    },
  ];
  