import { TruckBreakDownItems } from './truck-break-down-items.entity';

export const TruckBreakDownItemsProviders = [
  {
    provide: 'TRUCKBREAKDOWNITEMS_REPOSITORY',
    useValue: TruckBreakDownItems,
  },
];
