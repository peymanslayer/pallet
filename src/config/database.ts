import { Sequelize } from 'sequelize-typescript';
import { Auth } from 'src/auth/auth.entity';
import { Order } from 'src/order/order.entity';
import { Comment } from 'src/comment/comment..entity';
import { Driver } from 'src/driver/driver.entity';
import { OrderDriver } from 'src/order/orderDriver.entity';
import { Stock } from 'src/ReceiveStock/stock.entity';
import { Operator } from 'src/operator/operator.schema';
import { OperatorShop } from 'src/operatorShop/operatorShop.schema';
import { CheckList } from 'src/check-list/check-list.entity';
import { CheckListComment } from 'src/check-list-comment/check-list-comment.entity';
import { TruckBreakDown } from 'src/truck-break-down/truck-break-down.entity';
import { TruckBreakDownItems } from 'src/truck-break-down-items/truck-break-down-items.entity';
// import { Chat } from 'src/chat/chat.entity';
import { TruckInfo } from 'src/truck-info/truck-info.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'mysql',
        //---------------------------------------- production db
        host: 'himalayas.liara.cloud',
        port: 32679,
        username: 'root',
        password: 'XY9n0YoCwwTmjF7W6zZPYSSm',
        database: 'nifty_diffie',
        //---------------------------------------- test db
        // host: 'localhost',
        // port: 3306,
        // username: 'test',
        // password: '123123',
        // database: 'chstseven_test',

        pool: {
          max: 15,
          min: 5,
          idle: 20000,
          evict: 15000,
          acquire: 30000,
        },
      });
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
        // Chat,
      ]);
      //{ alter: true }
      await sequelize.sync().then((e) => console.log(e));
      return sequelize;
    },
  },
];
