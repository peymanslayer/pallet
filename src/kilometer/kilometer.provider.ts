import { Kilometer } from "./entities/kilometer.entity";

export const KilometerProviders = [
    {
      provide: 'KILOMETER_REPOSITORY',
      useValue: Kilometer,
    },
  ];
  