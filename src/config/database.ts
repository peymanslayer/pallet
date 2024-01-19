import { Sequelize } from 'sequelize-typescript';
import { Auth } from 'src/auth/auth.entity';
import { Order } from 'src/order/order,entity';
import { Comment } from 'src/comment/comment..entity';
import { Driver } from 'src/driver/driver.entity';
import { OrderDriver } from 'src/order/orderDriver.entity';
import { Stock } from 'src/ReceiveStock/stock.entity';
import { Operator } from 'src/operator/operator.schema';
import { OperatorShop } from 'src/operatorShop/operatorShop.schema';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        dialect: 'mysql',
        host: 'himalayas.liara.cloud',
        port: 32679,
        username: 'root',
        password: 'XY9n0YoCwwTmjF7W6zZPYSSm',
        database: 'nifty_diffie',
        pool: {
          max: 15,
          min: 5,
          idle: 20000,
          evict: 15000,
          acquire: 30000,
        },
      });
      sequelize.addModels([Auth]);
      sequelize.addModels([Order, Driver, OrderDriver, Comment]);
      sequelize.addModels([Stock]);
      sequelize.addModels([Operator, OperatorShop, Auth]);
      await sequelize.sync().then((e) => console.log(e));
      return sequelize;
    },
  },
];
