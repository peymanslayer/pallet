import { Inject, Injectable } from '@nestjs/common';
import { PeriodicTruckCheck } from './periodic-truck-check.entity';

@Injectable()
export class PeriodicTruckCheckService {
  constructor(
    @Inject('PERIODIC_TRUCK_CHECK')
    private readonly periodicTruckRepository: typeof PeriodicTruckCheck,
  ) {}

  // HIGH: 1.create service
  // HIGH: 1.2.create dto
  async create(payload: any) {
    try {
      const result =
        await this.periodicTruckRepository.create<PeriodicTruckCheck>(payload);
      if (result)
        return { status: 200, data: true, message: 'add successfully' };
      else return { status: 500, data: false, message: 'field operation' };
    } catch (err) {
      console.log(err);
    }
  }
}
