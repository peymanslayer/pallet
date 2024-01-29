import { TruckInfo } from './truck-info.entity';

export const TruckInfoProviders = [
  {
    provide: 'TRUCKINFO_REPOSITORY',
    useValue: TruckInfo,
  },
];
