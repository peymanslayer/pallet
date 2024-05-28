import { Inject, Injectable } from '@nestjs/common';
import { TruckInfo } from './truck-info.entity';
import { TruckInfoInsertDto } from './dto/truck-info.insert.dto';
@Injectable()
export class TruckInfoService {
  constructor(
    @Inject('TRUCKINFO_REPOSITORY')
    private truckInfoRepository: typeof TruckInfo,
  ) {}

  async get(driverId: number) {
    try {
      const truckInfoDriver = await this.truckInfoRepository.findOne({
        where: {
          driverId: driverId,
        },
      });
      return truckInfoDriver;
    } catch (err) {
      console.log(err);
    }
  }
  async add(body: TruckInfoInsertDto) {
    try {
      // body['driverId'] = driverId;
      const truckInfoAdd = await this.truckInfoRepository.create(body);
    } catch (err) {
      console.log(err);
    }
  }
  async update(driverId: number, body: any) {
    try {
      const infoUpdate = await this.truckInfoRepository.update(body, {
        where: {
          driverId: driverId,
        },
      });
    } catch (err) {
      console.log(err);
    }
  }
}
