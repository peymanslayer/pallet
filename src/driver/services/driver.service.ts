import { Inject, Injectable } from '@nestjs/common';
import { Driver } from '../driver.entity';
import { InsertDriverDto } from '../dto/insert.driver.dto';
import { Order } from 'src/order/order,entity';
import { OrderService } from 'src/order/services/order.service';
import { forwardRef } from '@nestjs/common';
import { OrderDriverService } from 'src/order/services/orderDriver.service';

@Injectable()
export class DriverService {
  constructor(
    @Inject('DRIVER_REPOSITORY')
    private readonly driverRepository: typeof Driver,
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService,
    @Inject(forwardRef(() => OrderDriverService))
    private readonly orderDriverService: OrderDriverService,
  ) {}
  // comment: not used in front. depricated
  async insertDriver(name: string) {
    const minNumberOfPassword = 10000;
    const maxNumberOfPassword = 99999;
    const insertDriver = await this.driverRepository.create({
      driverName: name,
    });
    insertDriver.driverPassword =
      Math.floor(
        Math.random() * (maxNumberOfPassword - minNumberOfPassword + 1),
      ) + minNumberOfPassword;
    insertDriver.save();
    return {
      status: 200,
      message: insertDriver,
    };
  }

  // async updateDriverName(Name:string){
  //  const updateDriverByName=await this.driverRepository.update({
  //   driverName:Name
  //  });
  //  if(updateDriverByName[0]==0){
  //   return{
  //     status:400,
  //     message:'driver not update'
  //   }
  //  }else{
  //   return{
  //     status:200,
  //     mesaage:"driver updated"
  //   }
  //  }
  // }

  async findOneDriverById(id: number) {
    const findOneDriverById = await this.driverRepository.findByPk(id);
    const findOrder = await this.driverRepository.findOne({
      where: { orderId: findOneDriverById.orderId },
      include: { model: Order },
    });
    if (findOneDriverById) {
      return findOrder;
    } else {
      return 'driver not found';
    }
  }

  async findDriver(driverId: number) {
    const findDriver = await this.driverRepository.findByPk(driverId);
    return {
      status: 200,
      message: findDriver,
    };
  }
  // comment: not used in front. depricated
  async findDriverByName(name: string) {
    const findDriverByName = await this.driverRepository.findOne({
      where: { driverName: name },
    });
    return {
      status: 200,
      message: findDriverByName,
    };
  }

  async deleteDriverByName(name: string) {
    const deleteDriverByName = await this.driverRepository.destroy({
      where: { driverName: name },
    });
    return deleteDriverByName;
  }

  async updateDriver(beforeName: string, afterName: string) {
    const updateDriver = await this.driverRepository.update(
      {
        driverName: afterName,
      },
      {
        where: { driverName: beforeName },
      },
    );
    return updateDriver;
  }
}
