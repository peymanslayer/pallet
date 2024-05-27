import { Inject, Injectable } from '@nestjs/common';
import { TruckInfo } from './truck-info.entity';
@Injectable()
export class TruckInfoService {
  constructor(
    @Inject('TRUCKINFO_REPOSITORY')
    private truckInfoRepository: typeof TruckInfo,
  ) {}

  async get(driverId: number) {
    const truckInfoDriver = await this.truckInfoRepository.findOne({
      where: {
        driverId: driverId,
      },
    });
    return truckInfoDriver;
  }

  async update(driverId: number, body: any) {
    const infoUpdate = await this.truckInfoRepository.update(body, {
      where: {
        driverId: driverId,
      },
    });
  }
}
