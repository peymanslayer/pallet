import { KilometerDetails } from "./entities/kilometer-detail.entity";

export const DriverKilometerDetailsProviders = [
    {
      provide: 'KILOMETER_DETAIL_REPOSITORY',
      useValue: KilometerDetails,
    },
  ];
  