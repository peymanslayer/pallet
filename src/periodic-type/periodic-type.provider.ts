import { PeriodicType } from './periodic-type.entity';

export const PeriodicTypeProvider = [
  {
    provide: 'PERIODIC_TYPE_REPOSITORY',
    useValue: PeriodicType,
  },
];
