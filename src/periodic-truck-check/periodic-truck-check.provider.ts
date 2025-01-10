import { PeriodicTruckCheck } from './periodic-truck-check.entity';

export const PeriodicTruckCheckProviders = [
  {
    provide: 'PERIODIC_TRUCK_CHECK_REPOSITORY',
    useValue: PeriodicTruckCheck,
  },
];
