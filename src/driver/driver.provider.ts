import { Driver } from './driver.entity';

export const DriverProviders = [
  {
    provide: 'DRIVER_REPOSITORY',
    useValue: Driver,
  },
];
