import { TruckBreakDown } from './truck-break-down.entity';

export const TruckBreakDownProviders = [
  {
    provide: 'TRUCKBREAKDOWN_REPOSITORY',
    useValue: TruckBreakDown,
  },
];
