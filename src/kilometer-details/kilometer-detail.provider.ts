import { KilometerDetails } from "./entities/kilometer-detail.entity";

export const KilometerDetailsProviders = [
    {
      provide: 'KILOMETER_DETAIL_REPOSITORY',
      useValue: KilometerDetails,
    },
  ];
  