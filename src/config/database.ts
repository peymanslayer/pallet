import { Sequelize } from 'sequelize-typescript';
import { Auth } from 'src/auth/auth.entity';
import { Order } from 'src/order/order.entity';
import { Driver } from 'src/driver/driver.entity';
import { OrderDriver } from 'src/order/orderDriver.entity';
import { Stock } from 'src/ReceiveStock/stock.entity';
import { Operator } from 'src/operator/operator.schema';
import { OperatorShop } from 'src/operatorShop/operatorShop.schema';
import { CheckList } from 'src/check-list/check-list.entity';
import { CheckListComment } from 'src/check-list-comment/check-list-comment.entity';
import { TruckBreakDown } from 'src/truck-break-down/truck-break-down.entity';
import { TruckBreakDownItems } from 'src/truck-break-down-items/truck-break-down-items.entity';
import { TruckInfo } from 'src/truck-info/truck-info.entity';
import { RepairInvoice } from 'src/repair-invoice/rapair-invoice.entity';
import { PeriodicTruckCheck } from 'src/periodic-truck-check/periodic-truck-check.entity';
import { PeriodicType } from 'src/periodic-type/periodic-type.entity';
import { Op } from 'sequelize';
import { Comment } from 'src/comment/comment..entity';
import { KilometerDetails } from 'src/driver-kilometer-details/entities/kilometer-detail.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'mysql',


        // host : 'himalayas.liara.cloud' ,
        // port : 33766 ,
        // username : 'root' ,
        // password : 'XY9n0YoCwwTmjF7W6zZPYSSm' ,
        // database : 'nifty_diffie' ,
        //-------------------------------db-chstseven/liara
        // host: 'localhost',
        // port: 3306,
        // username: 'root',
        // password: 'Peyman1378P$',
        // database: 'nifty_diffie',
        //---------------------------------------db local
        host: 'himalayas.liara.cloud',
        port: 33766,
        username: 'root',
        password: 'XY9n0YoCwwTmjF7W6zZPYSSm',
        database: 'nifty_diffie',

        logging: false,
        pool: {
          max: 15,
          min: 5,
          idle: 20000,
          evict: 15000,
          acquire: 30000,
        },
      });

      // افزودن مدل‌ها به Sequelize
      sequelize.addModels([
        Auth,
        Order,
        Driver,
        OrderDriver,
        Comment,
        Stock,
        Operator,
        OperatorShop,
        CheckList,
        CheckListComment,
        TruckBreakDown,
        TruckBreakDownItems,
        TruckInfo,
        RepairInvoice,
        PeriodicTruckCheck,
        PeriodicType,
        KilometerDetails
      ]);
    },
  },
];
