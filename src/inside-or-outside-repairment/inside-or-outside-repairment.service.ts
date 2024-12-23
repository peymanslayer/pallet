import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { TruckBreakDown } from 'src/truck-break-down/truck-break-down.entity';
import { CartexDto } from './dto/add.dto';
import { count } from 'console';
import { AuthService } from 'src/auth/services/auth.service';
import { TruckBreakDownItems } from 'src/truck-break-down-items/truck-break-down-items.entity';
import { Op } from 'sequelize';

@Injectable()
export class InsideOrOutsideRepairmenttService {
    constructor(
        @Inject('TRUCKBREAKDOWN_REPOSITORY')
        private readonly truckBreakDownRepository: typeof TruckBreakDown,
        @Inject('TRUCKBREAKDOWNITEMS_REPOSITORY')
        private readonly truckBreakDownItemsRepository: typeof TruckBreakDownItems,
        private readonly authService: AuthService,
    ){}

    async setInOrOurRepairment(breakDownId: number, cartexDto: CartexDto) {    
        const validCartexTypes = ['insideCompany', 'outsideCompany'];
        if (!validCartexTypes.includes(cartexDto.cartexType)) {
            return {
                status: 200,
                data : [] ,
                message: "مقدار کارتکس نامعتبر است",
            };
        }
    
        const breakDown = await this.truckBreakDownRepository.findByPk(breakDownId);
        if (!breakDown) {
            return {
                status: 200,
                data : [] ,
                message: "خرابی مورد نظر یافت نشد",
            };
        }
    
        await this.truckBreakDownRepository.update(
            { cartexType: cartexDto.cartexType }, 
            { where: { id: breakDownId } }
        );
    
        const updatedBreakDown = await this.truckBreakDownRepository.findByPk(breakDownId);
    
        return {
            status: 200,
            data: updatedBreakDown,
            message: "کارتکس با موفقیت آپدیت شد",
        };
    }
    
    async getInsideOrOutsideCompanyRepairments(cartexDto: CartexDto) {
        const validCartexTypes = ['insideCompany', 'outsideCompany'];
        if (!validCartexTypes.includes(cartexDto.cartexType)) {
            return {
                status: 200,
                data: [],
                message: "مقدار کارتکس نامعتبر است",
            };
        }
    
        const getRepairments = await this.truckBreakDownRepository.findAndCountAll({
            where: {
                cartexType: cartexDto.cartexType,
                [Op.or]: [
                    { historyDeliveryDriver: null }, 
                    { historyDeliveryDriver: "" }    
                ],
            } ,
            order: [['id', 'DESC']],
            limit: 20,
        });
        
        
        if (getRepairments.count === 0) {
            return {
                status: 200,
                data: [],
                message: "هیچ خرابی با این نوع کارتکس یافت نشد",
            };
        }
    
        const driverIds = getRepairments.rows.map(item => item.driverId);
    
        const driverInfoMap = {};
        const driverInfoPromises = driverIds.map(driverId =>
            this.authService.getDriverInfo(driverId)
                .then(driverInfo => {
                    driverInfoMap[driverId] = driverInfo;
                })
                .catch(() => {
                    driverInfoMap[driverId] = null;
                })
        );
        await Promise.all(driverInfoPromises);
        const data = await Promise.all(
            getRepairments.rows.map(async item => {
                const driverInfo = driverInfoMap[item.driverId];
    
                let answers;
                try {
                    answers = await this.getBreakDownItemsById(item.truckBreakDownItemsId);
                } catch (err) {
                    answers = [];
                }
    
                return {
                    id: item.id,
                    numberOfBreakDown : item.numberOfBreakDown ,
                    hours : item.hoursDriverRegister,
                    history : item.historyDriverRegister ,
                    driverName: item.driverName,
                    driverMobile: item.driverMobile,
                    carNumber: item.carNumber,
                    kilometer: item.carLife,
                    transportComment: item.transportComment,
                    logisticConfirm: item.logisticConfirm,
                    repairmanComment: item.repairmanComment,
                    historySendToRepair: item.historySendToRepair,
                    historyReciveToRepair: item.historyReciveToRepair,
                    histroyDeliveryTruck: item.histroyDeliveryTruck,
                    historyDeliveryDriver: item.historyDeliveryDriver,
                    historyRepairComment : item.historyRepairComment ,
                    hoursRepairComment : item.hoursRepairComment,
                    piece: item.piece,
                    cartexType: item.cartexType ,
                    personlCode: driverInfo ? driverInfo.personelCode : null,
                    company: driverInfo ? driverInfo.company : null,
                    zone: driverInfo ? driverInfo.zone : null,
                    answers: answers,
                };
            })
        );
    
        return {
            status: 200,
            data: data,
            count: getRepairments.count,
        };
    }
    


    async getBreakDownItemsById(id: number) {
        let data = [];
      
        if (!id) {
          console.warn('Invalid id provided to getBreakDownItemsById:', id);
          return [];
        }
      
        const res = await this.truckBreakDownItemsRepository.findOne({
          where: { id: id },
        });
      
        if (!res) {
          console.warn(`No record found for truckBreakDownItems with id: ${id}`);
          return [];
        }
      
        const items = res.dataValues;
      
        for (let item = 1; item <= 20; item++) {
          if (items[`answer_${item}`] != null) {
            data.push({
              type: items[`type_${item}`],
              comment: items[`answer_${item}`],
              number: item,
            });
          }
        }
      
        return data;
      }
      
    
}
