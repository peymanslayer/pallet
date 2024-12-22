import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { TruckBreakDown } from 'src/truck-break-down/truck-break-down.entity';
import { CartexDto } from './dto/add.dto';
import { count } from 'console';

@Injectable()
export class InsideOrOutsideRepairmenttService {
    constructor(
        @Inject('TRUCKBREAKDOWN_REPOSITORY')
        private readonly truckBreakDownRepository: typeof TruckBreakDown,
    ){}

    async setInOrOurRepairment(breakDownId: number, cartexDto: CartexDto) {    
        const validCartexTypes = ['insideCompany', 'outsideCompany'];
        if (!validCartexTypes.includes(cartexDto.cartexType)) {
            return {
                status: 400,
                data : [] ,
                message: "مقدار کارتکس نامعتبر است",
            };
        }
    
        const breakDown = await this.truckBreakDownRepository.findByPk(breakDownId);
        if (!breakDown) {
            return {
                status: 404,
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
                status: 400,
                data : [] ,
                message: "مقدار کارتکس نامعتبر است",
            };
        }

        const getRepairments = await this.truckBreakDownRepository.findAndCountAll({
            where: { cartexType: cartexDto.cartexType },
            order: [['id', 'DESC']],
            limit: 20,
        });
    
        if (getRepairments.count === 0) {
            return {
                status: 404,
                data : [] ,
                message: "هیچ خرابی با این نوع کارتکس یافت نشد",
            };
        }
    
        return {
            status: 200,
            data: getRepairments.rows,
            count: getRepairments.count,
        };
    }
    
}
