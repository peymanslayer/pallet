import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PeriodicTruckCheck } from './periodic-truck-check.entity';
import { PeriodicTruckCheckType } from 'src/common/constants';

@Injectable()
export class PeriodicTruckCheckService {
  constructor(
    @Inject('PERIODIC_TRUCK_CHECK')
    private readonly periodicTruckRepository: typeof PeriodicTruckCheck,
  ) {}

  async create(payload: any) {
    try {
      const result =
        await this.periodicTruckRepository.create<PeriodicTruckCheck>(payload);
      if (result)
        return { status: 200, data: true, message: 'add successfully' };
      else return { status: 500, data: false, message: 'field operation' };
    } catch (err) {
      console.log(err);
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getTypes() {
    try {
      console.log('PeriodicTruckCheckType: ', PeriodicTruckCheckType);
      return {
        data: PeriodicTruckCheckType,
        status: HttpStatus.OK,
        message: 'find successfully',
      };
    } catch (err) {
      console.log(err);
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // findTypePeriodicFromValue (value: string){
  //   return Object.keys(PeriodicTruckCheckType).find((key)=>{

  //   })
  // }

  // async getOne(periodicId: number) {
  //   try {
  //     const result = await this.periodicTruckRepository.findOne({
  //       where: {
  //         id: periodicId,
  //       },
  //    //   include: [{ model: TruckInfo }],  // BuG not relation with TruckInfo
  //     });

  //     if (result)
  //       return {
  //         status: 200,
  //         data: result.dataValues,
  //         message: 'add successfully',
  //       };
  //     else return { status: 200, data: {}, message: 'data not exist' };
  //   } catch (err) {
  //     console.log(err);
  //     throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }
}
