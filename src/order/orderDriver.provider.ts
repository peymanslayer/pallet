import { OrderDriver } from "./orderDriver.entity";

export const OrderDriverProviders = [
  {
    provide: 'ORDERDRIVER_REPOSITORY',
    useValue: OrderDriver,
  },
];
