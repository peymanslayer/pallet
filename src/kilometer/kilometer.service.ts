import { Inject, Injectable } from '@nestjs/common';
import { CreateKilometerDto } from './dto/create-kilometer.dto';
import { UpdateKilometerDto } from './dto/update-kilometer.dto';
import { TruckInfo } from 'src/truck-info/truck-info.entity';
import { Kilometer } from './entities/kilometer.entity';

@Injectable()
export class KilometerService {
  constructor(
    @Inject('TRUCKINFO_REPOSITORY')
    private truckInfoRepository: typeof TruckInfo,
    @Inject('KILOMETER_REPOSITORY')
    private kilometerRepository: typeof Kilometer,
  ){}



  // create(createKilometerDto: CreateKilometerDto) {
  //   return 'This action adds a new kilometer';
  // }

  findAll() {
    return `This action returns all kilometer`;
  }

  async findOne(carNumber: string) {
    const kilometer = this.kilometerRepository.findOne({where : {carNumber}})
    if(!kilometer) {
      return {
        status: 200 , 
        data : [] ,
        message : "کیلومتر برای پلاک مورد نظر یافت نشد"
      }
    }

    return {
      status: 201 , 
      data : kilometer ,
      message: "کیلومتر با موفقیت یافت شد"
    }
  }

  async create(carNumber: string, currenrKilometer: number , previousKilometer: number) {
    const truck = await this.truckInfoRepository.findOne({where : {carNumber}})
    if(!truck) {
      return {
        status: 200 , 
        data : [] ,
        message : "ماشین مورد نظر یافت نشد"
      }
    }

    const existingKilometer = await this.kilometerRepository.findOne({
      where: { truckId: truck.id },
    });
    
    if (existingKilometer) {
      await existingKilometer.update({
        currenrKilometer,
        previousKilometer,
        carNumber,
      });
    } else {
      await this.kilometerRepository.create({
        truckId: truck.id,
        currenrKilometer,
        previousKilometer,
        carNumber,
      });
    }

   return {
    status : 201 ,
    data: true ,
    message: "کیلومتر با موفقیت ثبت شد"
   }

  }

  
}
