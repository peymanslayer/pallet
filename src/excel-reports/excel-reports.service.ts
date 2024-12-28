import { Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { Auth } from 'src/auth/auth.entity';
import { TruckBreakDown } from 'src/truck-break-down/truck-break-down.entity';

@Injectable()
export class ExcelReportsService {

    constructor(
        @Inject('TRUCKBREAKDOWN_REPOSITORY')
        private readonly truckBreakDownRepository: typeof TruckBreakDown,
        @Inject('AUTH_REPOSITORY')
        private readonly authRepository: typeof Auth,
    ){}

    async generateExcelReportForBreakdowns(name: string, carNumber: string , zone: string , company: string){
        const query: any = {};

        if (name) query.driverName = { [Op.like]: `%${name}%` };
        if (carNumber) query.carNumber = { [Op.like]: `%${carNumber}%` };

        if (zone || company) {
        const authWhere: any = {};
        if (zone) authWhere.zone = zone;
        if (company) authWhere.company = company;

        const drivers = await this.authRepository.findAll({
            where: authWhere,
            attributes: ['id'], // فقط آیدی رانندگان مورد نیاز است
        });

        const driverIds = drivers.map((driver) => driver.id);

        if (driverIds.length > 0) {
            query.driverId = { [Op.in]: driverIds };
        } else {
            return [];
        }
        }

        const breakdowns = await this.truckBreakDownRepository.findAll({
        where: query,
        });

        console.log(breakdowns);

          
    }

}
