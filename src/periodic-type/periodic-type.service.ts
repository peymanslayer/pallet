import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { PeriodicType } from './periodic-type.entity';

@Injectable()
export class PeriodicTypeService {
  constructor(
    @Inject('PERIODIC_TYPE_REPOSITORY')
    private readonly periodicType: typeof PeriodicType,
  ) {}
  // HIGH: 1. dto create periodic type
  async create(payload: any) {
    try {
      const res = await this.periodicType.create(payload);
      return {
        data: res,
        status: HttpStatus.OK,
        message: 'periodic type created',
      };
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'error creating periodic type',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAll() {
    try {
      const res = await this.periodicType.findAll();
      return {
        data: res,
        status: HttpStatus.OK,
        message: 'successfully operation',
      };
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'error creating periodic type',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getOneById(id: string) {
    try {
      return await this.periodicType.findOne({
        where: { id: id },
      });
    } catch (err) {
      console.error(err);
      throw new HttpException(
        'error creating periodic type',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
