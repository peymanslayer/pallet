import { Body, Inject, Injectable } from '@nestjs/common';
import { Order } from '../order,entity';
import { InsertOrderDto } from '../dtos/insert.order.dto';
import { FindOrderDto } from '../dtos/find.order.dto';
import { DeleteOrderDto } from '../dtos/delete.order.dto';
import { CommentService } from 'src/comment/services/comment.service';
import { DriverService } from 'src/driver/services/driver.service';
import { forwardRef } from '@nestjs/common';
import { OrderDriver } from '../orderDriver.entity';
import { GenerateCode } from './generate.code';
import { Op } from 'sequelize';
import { Comment } from 'src/comment/comment..entity';
import { Driver } from 'src/driver/driver.entity';
import moment from 'moment';
import { Workbook } from 'exceljs';

@Injectable()
export class OrderService {
  constructor(
    @Inject('ORDER_REPOSITORY') private readonly orderRepository: typeof Order,
    @Inject('ORDERDRIVER_REPOSITORY')
    private readonly orderDriverrRepository: typeof OrderDriver,
    @Inject(forwardRef(() => DriverService))
    private readonly driverSerice: DriverService,
    private readonly commentService: CommentService,
    private readonly generateService: GenerateCode,
  ) {}

  async insertOrder(body: InsertOrderDto) {
    const parts = body.history.split('/');
    const year = parts[0];
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);
    const fullDate = `${year}/${month}/${day}`;
    const insertOrder = await this.orderRepository.create<Order>({
      ...body,
      history: fullDate,
    });
    const findOrderByUser = await this.orderRepository.findAll({
      where: {},
    });
    for (let i = 0; i < findOrderByUser.length; i++) {
      await this.orderRepository.update(
        {
          numberOfOrder: 100 + 1 + i,
        },
        {
          where: { id: findOrderByUser[i].id },
        },
      );
    }
    if (insertOrder) {
      return {
        status: 201,
        message: insertOrder,
      };
    } else {
      return {
        status: 401,
        message: 'order not created',
      };
    }
  }

  async findOrder(body: FindOrderDto) {
    let findAll = [];
    const findOrder = await this.orderRepository.findAll({
      where: { shopId: body.shopId },
    });
    const findOrderDriverById = await this.orderDriverrRepository.findAll({
      where: { driverId: body.userId },
    });
    for (let i = 0; i < findOrder.length; i++) {
      for (let j = 0; j < findOrderDriverById.length; j++) {
        if (findOrder[i].id !== findOrderDriverById[j].orderId) {
          findAll.push(findOrder[i]);
        }
      }
    }
    const removeDuplicate = [...new Set(findAll)];
    if (findOrder) {
      return {
        status: 200,
        message: removeDuplicate,
      };
    } else {
      return {
        status: 400,
        message: 'order not founded',
      };
    }
  }

  async findRegisteredOrderByDriver(body: FindOrderDto) {
    let findAll = [];
    let findOrder = [];
    if (body.afterHistory && body.beforeHistory) {
      findOrder = await this.orderRepository.findAll({
        where: {
          driver: body.userId,
          shopId: body.shopId,
          deletedAt: null,
          isRegisteredByDriver: {
            [Op.ne]: null,
          },
          historyOfDriver: {
            [Op.between]: [body.beforeHistory, body.afterHistory],
          },
        },
        order: [['historyOfDriver', 'DESC']],
      });
    } else {
      findOrder = await this.orderRepository.findAll({
        where: {
          driver: body.userId,
          shopId: body.shopId,
          deletedAt: null,
          isRegisteredByDriver: {
            [Op.ne]: null,
          },
        },
        order: [['historyOfDriver', 'DESC']],
      });
    }
    const findOrderDriverById = await this.orderDriverrRepository.findAll({
      where: { driverId: body.userId },
    });
    for (let i = 0; i < findOrder.length; i++) {
      for (let j = 0; j < findOrderDriverById.length; j++) {
        if (findOrder[i].id === findOrderDriverById[j].orderId) {
          findAll.push(findOrder[i]);
        }
      }
    }
    return await this.findRegisteredOrderByDriverMessage(findAll, findOrder);
  }

  async findRegisteredOrderByDriverMessage(
    findAll: Array<InsertOrderDto>,
    findOrder: Order[],
  ) {
    const removeDuplicate = [...new Set(findAll)];
    if (findOrder) {
      return {
        status: 200,
        message: findOrder,
      };
    } else {
      return {
        status: 400,
        message: 'order not founded',
      };
    }
  }

  async findOrderByShopId(body: FindOrderDto) {
    const findOrder = await this.orderRepository.findAll({
      where: {
        [Op.and]: {
          shopId: body.shopId,
          // isDeletedByDriver:null,
          // registeredPassword:null,
          deletedAt: null,
          isRegisteredByDriver: null,
        },
      },
    });
    return {
      status: 200,
      message: findOrder,
    };
  }

  async findOrderByUserId(userId: number) {
    const today = new Date().getTime();
    const yesterday = today - 1 * 24 * 60 * 60 * 1000;

    const findOrderByUserId = await this.orderRepository.findAndCountAll({
      where: {
        [Op.and]: {
          userId: userId,
          isDeletedByDriver: null,
          deletedAt: null,
          isRegisteredByDriver: null,
        },
      },
      order: [['id', 'DESC']],
    });

    findOrderByUserId.rows = findOrderByUserId.rows.filter(
      (item) => yesterday < new Date(item.updatedAt).getTime(),
    );
    findOrderByUserId.count = findOrderByUserId.rows.length;
    return {
      status: 200,
      message: findOrderByUserId,
    };
  }
  async deleteOrderAndUpdateComment(body: DeleteOrderDto) {
    console.log(body);

    const insertComment = await this.orderRepository.update(
      {
        commentText: body.comment,
      },
      {
        where: {
          id: body.id,
        },
      },
    );
    if (insertComment[0] == 0) {
      return {
        status: 400,
        message: 'comment not inserted',
      };
    } else {
      return await this.deleteOrderProcess(body.id, body.userId);
    }
  }

  async deleteOrderProcess(id: number, userId: number) {
    const time = Date.now();
    const deleteOrder = await this.orderRepository.update(
      {
        deletedAt: time,
      },
      {
        where: { id: id },
      },
    );
    const findAllOrder = await this.orderRepository.findAndCountAll({
      where: {
        [Op.and]: {
          userId: userId,
          deletedAt: null,
        },
      },
    });
    if (deleteOrder) {
      return {
        status: 200,
        message: findAllOrder,
      };
    } else {
      return {
        status: 400,
        message: 'order not deleted',
      };
    }
  }

  async updateOrderDriver(driverId: number, shopId: number, orderId: number) {
    let array = [];
    await this.orderDriverrRepository.create({
      driverId: driverId,
      orderId: orderId,
    });
    // const findDriver = await this.driverSerice.findDriver(driverId);
    const updateOrder = await this.orderDriverrRepository.findAll({
      where: { orderId: orderId },
    });
    for (let i = 0; i < updateOrder.length; i++) {
      let driver = await this.driverSerice.findDriver(updateOrder[i].driverId);
      array.push(driver);
    }
    return {
      status: 200,
      message: array,
    };
  }

  async findOrderById(id: number) {
    const findOrderById = await this.orderRepository.findByPk(id);
    return findOrderById;
  }

  async updateOrderByPassword(password: number, shopId: number) {
    let generateCode: number;
    const findOneOrder = await this.orderRepository.findByPk(shopId);
    let passwords = findOneOrder.Password5Number;
    if (passwords == null) {
      generateCode = this.generateService.generateCode().message;
    } else {
      generateCode = passwords;
    }
    const updateOrder = await this.orderRepository.update(
      {
        Password5Number: generateCode,
      },
      {
        where: { id: shopId },
      },
    );

    if (updateOrder[0] == 0) {
      return {
        status: 400,
        message: 'order not update',
      };
    } else {
      return {
        status: 200,
        message: findOneOrder,
      };
    }
  }
  async updateOrder(id: number, body: InsertOrderDto) {
    const updateOrder = await this.orderRepository.update(
      { ...body },
      {
        where: { id: id },
      },
    );
    if (updateOrder[0] == 0) {
      return {
        status: 400,
        message: 'order not updated',
      };
    } else {
      const findOrderById = await this.orderRepository.findByPk(id);
      return {
        status: 200,
        message: findOrderById,
      };
    }
  }

  async getOrderById(id: number) {
    const findOrderById = await this.orderRepository.findByPk(id);
    if (!findOrderById) {
      return {
        status: 400,
        message: 'order not found',
      };
    }
    return {
      status: 200,
      message: findOrderById,
    };
  }

  async findAllDeletedOrderByShopId(
    userId: number,
    shopId: number,
    body: FindOrderDto,
  ) {
    let comments = [];
    let findAllDeletedOrderByShopId: Array<Order>;
    if (body.afterHistory && body.afterHistory) {
      findAllDeletedOrderByShopId = await this.orderRepository.findAll({
        where: {
          [Op.and]: {
            userId: userId,
            shopId: shopId,
            deletedAt: {
              [Op.ne]: null,
            },
            history: {
              [Op.between]: [body.beforeHistory, body.afterHistory],
            },
          },
        },
        order: [['history', 'DESC']],
      });
    } else {
      findAllDeletedOrderByShopId = await this.orderRepository.findAll({
        where: {
          [Op.and]: {
            userId: userId,
            shopId: shopId,
            deletedAt: {
              [Op.ne]: null,
            },
          },
        },
        order: [['history', 'DESC']],
      });
    }

    for (let i = 0; i < findAllDeletedOrderByShopId.length; i++) {
      console.log(findAllDeletedOrderByShopId[i].id, i);

      const findComments = await this.commentService.findCommentByShopId(
        findAllDeletedOrderByShopId[i].id,
      );
      if (findComments) {
        comments.push(findComments);
      }
    }

    return {
      message: {
        findAllDeletedOrderByShopId,
        comments,
      },
    };
  }

  async findDeletedOrderByDriver(shopId: number, body: FindOrderDto) {
    let drivers = [];
    let findDeletedOrderByDriver: Array<Order>;
    if (body.afterHistory && body.beforeHistory) {
      findDeletedOrderByDriver = await this.orderRepository.findAll({
        where: {
          shopId: shopId,
          isDeletedByDriver: {
            [Op.ne]: null,
          },
          history: {
            [Op.between]: [body.beforeHistory, body.afterHistory],
          },
        },
        order: [
          ['history', 'DESC'],
          ['hours', 'DESC'],
        ],
      });
    } else {
      findDeletedOrderByDriver = await this.orderRepository.findAll({
        where: {
          shopId: shopId,
          isDeletedByDriver: {
            [Op.ne]: null,
          },
        },
        order: [
          ['history', 'DESC'],
          ['hours', 'DESC'],
        ],
      });
    }
    for (let i = 0; i < findDeletedOrderByDriver.length; i++) {
      const findInformaionDriver = await this.driverSerice.findDriver(
        findDeletedOrderByDriver[i].driver,
      );
      if (findInformaionDriver) {
        drivers.push(findInformaionDriver);
      }
    }
    return {
      message: {
        findDeletedOrderByDriver,
        drivers,
      },
    };
  }

  async findAllRegisteredOrderByUser(shopId: number, body: FindOrderDto) {
    let findAllDeletedOrderByShopId: Array<Order>;
    if (body.afterHistory && body.beforeHistory) {
      findAllDeletedOrderByShopId = await this.orderRepository.findAll({
        where: {
          [Op.and]: {
            shopId: shopId,
            deletedAt: {
              [Op.eq]: null,
            },
            history: {
              [Op.between]: [body.beforeHistory, body.afterHistory],
            },
          },
        },
        order: [['history', 'DESC']],
      });
    } else {
      findAllDeletedOrderByShopId = await this.orderRepository.findAll({
        where: {
          [Op.and]: {
            shopId: shopId,
            deletedAt: {
              [Op.eq]: null,
            },
          },
        },
        order: [
          ['history', 'DESC'],
          ['hours', 'DESC'],
        ],
      });
    }
    return findAllDeletedOrderByShopId;
  }

  async findOrderList(shopId: number, userId: number, body: FindOrderDto) {
    const findAllDeletedOrderByShopId = await this.findAllDeletedOrderByShopId(
      userId,
      shopId,
      body,
    );
    const findAllRegisteredOrderByUser =
      await this.findAllRegisteredOrderByUser(shopId, body);
    const findDeletedOrderByDriver = await this.findDeletedOrderByDriver(
      shopId,
      body,
    );
    return {
      status: 200,
      message: {
        findAllDeletedOrderByShopId: findAllDeletedOrderByShopId.message,
        findAllRegisteredOrderByUser,
        findDeletedOrderByDriver,
      },
    };
  }

  async findAllOrdersByDriverId(body: FindOrderDto) {
    const findByDriverId = await this.driverSerice.findDriverByName(body.name);
    if (findByDriverId.message) {
      const findAllOrdersByDriverId = await this.orderRepository.findAll({
        where: {
          driver: findByDriverId.message.id,
          isRegisteredByDriver: 'ثبت شده توسط راننده',
          isRegisteredByStock: null,
          deletedAt: null,
        },
      });
      return {
        status: 200,
        message: findAllOrdersByDriverId,
      };
    } else {
      return {
        status: 400,
        message: 'driver not found',
      };
    }
  }

  async findAllOrdersRegisteredByStock(stockId: number, body: FindOrderDto) {
    let findAllOrdersRegisteredByStock = [];
    if (body.beforeHistory && body.afterHistory) {
      findAllOrdersRegisteredByStock = await this.orderRepository.findAll({
        where: {
          stockId: stockId,
          isRegisteredByStock: {
            [Op.ne]: null,
          },
          deletedAt: null,
          historyOfStock: {
            [Op.between]: [body.beforeHistory, body.afterHistory],
          },
        },
        order: [['historyOfStock', 'DESC']],
      });
    } else {
      findAllOrdersRegisteredByStock = await this.orderRepository.findAll({
        where: {
          stockId: stockId,
          isRegisteredByStock: {
            [Op.ne]: null,
          },
          deletedAt: null,
        },
        order: [['historyOfStock', 'DESC']],
      });
    }
    return {
      status: 200,
      message: findAllOrdersRegisteredByStock,
    };
  }

  async findAllOrdersNotRegisteredByStock(stockId: number) {
    const findAllOrdersNotRegisteredByStock =
      await this.orderRepository.findAll({
        where: {
          driver: stockId,
          isRegisteredByDriver: {
            [Op.ne]: null,
          },
        },
      });
    return {
      status: 200,
      message: findAllOrdersNotRegisteredByStock,
    };
  }

  async registerOrderByStock(body: FindOrderDto) {
    const registerOrderByStock = await this.orderRepository.update(
      {
        stockId: body.stockId,
        isRegisteredByStock: 'ثبت شده توسط انبار',
        hoursOfRegisterStock: body.hoursOfRegisterStock,
        historyOfStock: body.historyOfStock,
        stockName: body.name,
      },
      {
        where: { id: body.id },
      },
    );
    const update = await this.orderRepository.update(
      {
        ...body,
      },
      {
        where: { id: body.id },
      },
    );
    if (registerOrderByStock[0] == 0) {
      return {
        status: 400,
        message: 'order not update',
      };
    } else {
      return {
        status: 200,
        message: 'order update',
      };
    }
  }

  async deleteOrderForStockUser(stockId: number, orderId: number) {
    const deleteOrderForStockUser = await this.orderRepository.update(
      {
        isRegisteredByStock: null,
        stockId: null,
      },
      {
        where: {
          id: orderId,
        },
      },
    );
    if (deleteOrderForStockUser[0] == 0) {
      return {
        status: 400,
        message: 'order not deleted',
      };
    } else {
      return {
        status: 200,
        message: 'order deleted',
      };
    }
  }

  getTime() {
    const date = new Date();
    const time = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const result = `${time}/${month}/${day}`;
    const hourss = date.getHours();
    const minute = date.getMinutes();
    const hours = `${hourss}:${minute}`;
    return {
      status: 200,
      message: {
        result,
        hours,
      },
    };
  }

  async outPutNotDeletedOrderExcel(req) {
    let data = [];
    let findAllOrder = [];
    if (req.shopId) {
      if (req.beforeHistory && req.afterHistory) {
        console.log('shop id before and after history');

        findAllOrder = await this.orderRepository.findAll({
          where: {
            deletedAt: {
              [Op.ne]: null,
            },
            history: {
              [Op.between]: [req.beforeHistory, req.afterHistory],
            },
          },
        });
      } else {
        console.log('shop id');

        findAllOrder = await this.orderRepository.findAll({
          where: {
            // deletedAt: {  //#update by #jml
            //   [Op.ne]: null,
            // },
            shopId: req.shopId,
          },
        });
      }
    } else if (req.beforeHistory && req.afterHistory) {
      console.log('history');

      findAllOrder = await this.orderRepository.findAll({
        where: {
          deletedAt: {
            [Op.ne]: null,
          },
          history: {
            [Op.between]: [req.beforeHistory, req.afterHistory],
          },
        },
      });
    } else {
      findAllOrder = await this.orderRepository.findAll({
        where: {
          deletedAt: {
            [Op.ne]: null,
          },
        },
      });
    }
    for (let i = 0; i < findAllOrder.length; i++) {
      data.push({
        shopId: findAllOrder[i].shopId,
        numberOfOrder: findAllOrder[i].numberOfOrder,
        woodPallet: findAllOrder[i].woodPallet,
        woodPalletCode: findAllOrder[i].woodPalletCode,
        plasticPallet: findAllOrder[i].plasticPallet,
        plasticPalletCode: findAllOrder[i].plasticPalletCode,
        basketOfPegahYogurt: findAllOrder[i].basketOfPegahYogurt,
        basketOfPegahYogurtCode: findAllOrder[i].basketOfPegahYogurtCode,
        basketOfPegahِDough: findAllOrder[i].basketOfPegahِDough,
        basketOfPegahِDoughCode: findAllOrder[i].basketOfPegahِDoughCode,
        dominoBasket: findAllOrder[i].dominoBasket,
        dominoBasketCode: findAllOrder[i].dominoBasketCode,
        harazBasket: findAllOrder[i].harazBasket,
        harazBasketCode: findAllOrder[i].harazBasketCode,
        kallehBasket: findAllOrder[i].kallehBasket,
        kallehBasketCode: findAllOrder[i].kallehBasketCode,
        basketOfpaakDough: findAllOrder[i].basketOfpaakDough,
        basketOfpaakDoughCode: findAllOrder[i].basketOfpaakDoughCode,
        boxBasket: findAllOrder[i].boxBasket,
        shopUser: findAllOrder[i].shopUser,
        history: findAllOrder[i].history,
        hours: findAllOrder[i].hours,
        isRegisteredByDriver: findAllOrder[i].isRegisteredByDriver,
        driverName: findAllOrder[i].driverName,
        historyOfDriver: findAllOrder[i].historyOfDriver,
        hoursOfRegisterDriver: findAllOrder[i].hoursOfRegisterDriver,
        stockName: findAllOrder[i].stockName,
        historyOfStock: findAllOrder[i].historyOfStock,
        hoursOfRegisterStock: findAllOrder[i].hoursOfRegisterStock,
      });
    }
    const book = new Workbook();
    const workSheet = book.addWorksheet('stock');
    workSheet.columns = [
      { key: 'کد فروشگاه', header: 'کد فروشگاه', width: 20 },
      { key: 'شماره سفارش', header: 'شماره سفارش', width: 20 },
      { key: 'پالت چوبی', header: 'پالت چوبی', width: 20 },
      { key: 'کد پالت چوبی', header: 'کد پالت چوبی', width: 20 },
      { key: 'پالت پلاستیکی', header: 'پالت پلاستیکی', width: 20 },
      { key: 'کد پالت پلاستیکی', header: 'کد پالت پلاستیکی', width: 20 },
      { key: 'سبد ماست پگاه', header: 'سبد ماست پگاه', width: 20 },
      { key: 'کد سبد ماست پگاه', header: 'کد سبد ماست پگاه', width: 20 },
      { key: 'سبد دوغ پگاه', header: 'سبد دوغ پگاه', width: 20 },
      { key: 'کد سبد دوغ پگاه', header: 'کد سبد دوع پگاه', width: 20 },
      { key: 'سبد دومینو', header: 'سبد دومینو', width: 20 },
      { key: 'کد سبد دومینو', header: 'کد سبد دومینو', width: 20 },
      { key: 'سبد هراز', header: 'سبد هراز', width: 20 },
      { key: 'کد سبد هراز', header: 'کد سبد هراز', width: 20 },
      { key: 'سبد کاله', header: 'سبد کاله', width: 20 },
      { key: 'کد سبد کاله', header: 'کد سبد کاله', width: 20 },
      { key: 'سبد پاک', header: 'سبد پاک', width: 20 },
      { key: 'کد سبد پاک', header: 'کد سبد پاک', width: 20 },
      { key: ' سبد کارتن', header: 'سبد کارتن', width: 20 },
      { key: 'کاربر فروشگاه', header: 'کاربر فروشگاه', width: 20 },
      { key: 'تاریخ ثبت فروشگاه', header: 'تاریخ ثبت فروشگاه', width: 20 },
      { key: 'ساعت ثبت فروشگاه', header: 'ساعت ثبت فروشگاه', width: 20 },
      { key: 'ثبت شده توسط راننده', header: 'ثبت شده توسط راننده', width: 20 },
      { key: 'نام راننده', header: 'نام راننده', width: 20 },
      { key: 'تاریخ ثبت راننده', header: 'تاریخ ثبت راننده', width: 20 },
      { key: 'ساعت ثبت راننده', header: 'ساعت ثبت راننده', width: 20 },
      { key: 'نام کارگر انبار', header: 'نام کارگر انبار', width: 20 },
      { key: 'تاریخ ثبت انبار', header: 'تاریخ ثبت انبار', width: 20 },
      { key: 'ساعت ثبت انبار', header: 'ساعت ثبت انبار', width: 20 },
    ];
    data.forEach((x) => {
      workSheet.addRow(Object.values(x));
    });
    const buffer = await book.xlsx.writeBuffer();
    return buffer;
  }

  async deletedExcelOfOrder(req: any) {
    let data = [];
    let findAllOrder = [];
    if (req.shopId) {
      if (req.beforeHistory && req.afterHistory) {
        console.log('shop id before and after history');

        findAllOrder = await this.orderRepository.findAll({
          where: {
            deletedAt: {
              [Op.ne]: null,
            },
            history: {
              [Op.between]: [req.beforeHistory, req.afterHistory],
            },
          },
        });
      } else {
        console.log('shop id');

        findAllOrder = await this.orderRepository.findAll({
          where: {
            deletedAt: {
              [Op.ne]: null,
            },
            shopId: req.shopId,
          },
        });
      }
    } else if (req.beforeHistory && req.afterHistory) {
      console.log('history');

      findAllOrder = await this.orderRepository.findAll({
        where: {
          deletedAt: {
            [Op.ne]: null,
          },
          history: {
            [Op.between]: [req.beforeHistory, req.afterHistory],
          },
        },
      });
    } else {
      findAllOrder = await this.orderRepository.findAll({
        where: {
          deletedAt: {
            [Op.ne]: null,
          },
        },
      });
    }
    for (let i = 0; i < findAllOrder.length; i++) {
      data.push({
        shopId: findAllOrder[i].shopId,
        numberOfOrder: findAllOrder[i].numberOfOrder,
        woodPallet: findAllOrder[i].woodPallet,
        woodPalletCode: findAllOrder[i].woodPalletCode,
        plasticPallet: findAllOrder[i].plasticPallet,
        plasticPalletCode: findAllOrder[i].plasticPalletCode,
        basketOfPegahYogurt: findAllOrder[i].basketOfPegahYogurt,
        basketOfPegahYogurtCode: findAllOrder[i].basketOfPegahYogurtCode,
        basketOfPegahِDough: findAllOrder[i].basketOfPegahِDough,
        basketOfPegahِDoughCode: findAllOrder[i].basketOfPegahِDoughCode,
        dominoBasket: findAllOrder[i].dominoBasket,
        dominoBasketCode: findAllOrder[i].dominoBasketCode,
        harazBasket: findAllOrder[i].harazBasket,
        harazBasketCode: findAllOrder[i].harazBasketCode,
        kallehBasket: findAllOrder[i].kallehBasket,
        kallehBasketCode: findAllOrder[i].kallehBasketCode,
        boxBasket: findAllOrder[i].boxBasket,
        shopUser: findAllOrder[i].shopUser,
        history: findAllOrder[i].history,
        hours: findAllOrder[i].hours,
        commentText: findAllOrder[i].commentText,
      });
    }

    const book = new Workbook();
    const workSheet = book.addWorksheet('stock');
    workSheet.columns = [
      { key: 'کد فروشگاه', header: 'کد فروشگاه', width: 20 },
      { key: 'شماره سفارش', header: 'شماره سفارش', width: 20 },
      { key: 'پالت چوبی', header: 'پالت چوبی', width: 20 },
      { key: 'کد پالت چوبی', header: 'کد پالت چوبی' },
      { key: 'پالت پلاستیکی', header: 'پالت پلاستیکی', width: 20 },
      { key: 'کد پالت پلاستیکی', header: 'کد پالت پلاستیکی' },
      { key: 'سبد ماست پگاه', header: 'سبد ماست پگاه', width: 20 },
      { key: 'کد سبد ماست پگاه', header: 'کد سبد ماست پگاه' },
      { key: 'سبد دوغ پگاه', header: 'سبد دوغ پگاه', width: 20 },
      { key: 'کد سبد دوغ پگاه', header: 'کد سبد دوغ پگاه' },
      { key: 'سبد دومینو', header: 'سبد دومینو', width: 20 },
      { key: 'کد سبد دومینو', header: 'کد سبد دومینو' },
      { key: 'سبد هراز', header: 'سبد هراز', width: 20 },
      { key: 'کد سبد هراز', header: 'کد سبد هراز' },
      { key: 'سبد کاله', header: 'سبد کاله', width: 20 },
      { key: 'کد سبد کاله', header: 'کد سبد کاله' },
      { key: ' سبد کارتن', header: 'سبد کارتن', width: 20 },
      { key: 'کاربر فروشگاه', header: 'کاربر فروشگاه', width: 20 },
      { key: 'تاریخ ثبت فروشگاه', header: 'تاریخ ثبت فروشگاه', width: 20 },
      { key: 'ساعت ثبت فروشگاه', header: 'ساعت ثبت فروشگاه', width: 20 },
      { key: 'کامنت', header: 'کامنت' },
    ];
    data.forEach((x) => {
      workSheet.addRow(Object.values(x));
    });
    const buffer = await book.xlsx.writeBuffer();
    return buffer;
  }

  async isGeneratedPasswordByDriver(id: number) {
    const findOneOrder = await this.orderRepository.findByPk(id);
    findOneOrder.isGeneratedPasswordByDriver = true;
    findOneOrder.save();
    return {
      status: 200,
      message: findOneOrder,
    };
  }

  async listOfExcelOrderByShopCode(shopCode: string) {
    let data = [];
    const findAllOrder = await this.orderRepository.findAll({
      where: {
        shopId: shopCode,
      },
    });
    for (let i = 0; i < findAllOrder.length; i++) {
      data.push({
        shopId: findAllOrder[i].shopId,
        numberOfOrder: findAllOrder[i].numberOfOrder,
        woodPallet: findAllOrder[i].woodPallet,
        woodPalletCode: findAllOrder[i].woodPalletCode,
        plasticPallet: findAllOrder[i].plasticPallet,
        plasticPalletCode: findAllOrder[i].plasticPalletCode,
        basketOfPegahYogurt: findAllOrder[i].basketOfPegahYogurt,
        basketOfPegahYogurtCode: findAllOrder[i].basketOfPegahYogurtCode,
        basketOfPegahِDough: findAllOrder[i].basketOfPegahِDough,
        basketOfPegahِDoughCode: findAllOrder[i].basketOfPegahِDoughCode,
        dominoBasket: findAllOrder[i].dominoBasket,
        dominoBasketCode: findAllOrder[i].dominoBasketCode,
        harazBasket: findAllOrder[i].harazBasket,
        harazBasketCode: findAllOrder[i].harazBasketCode,
        kallehBasket: findAllOrder[i].kallehBasket,
        kallehBasketCode: findAllOrder[i].kallehBasketCode,
        basketOfpaakDough: findAllOrder[i].basketOfpaakDough,
        basketOfpaakDoughCode: findAllOrder[i].basketOfpaakDoughCode,
        boxBasket: findAllOrder[i].boxBasket,
        shopUser: findAllOrder[i].shopUser,
        history: findAllOrder[i].history,
        hours: findAllOrder[i].hours,
        isRegisteredByDriver: findAllOrder[i].isRegisteredByDriver,
        driverName: findAllOrder[i].driverName,
        historyOfDriver: findAllOrder[i].historyOfDriver,
        hoursOfRegisterDriver: findAllOrder[i].hoursOfRegisterDriver,
        stockName: findAllOrder[i].stockName,
        historyOfStock: findAllOrder[i].historyOfStock,
        hoursOfRegisterStock: findAllOrder[i].hoursOfRegisterStock,
      });
    }
    const book = new Workbook();
    const workSheet = book.addWorksheet('stock');
    workSheet.columns = [
      { key: 'کد فروشگاه', header: 'کد فروشگاه', width: 20 },
      { key: 'شماره سفارش', header: 'شماره سفارش' },
      { key: 'پالت چوبی', header: 'پالت چوبی', width: 20 },
      { key: 'کد پالت چوبی', header: 'کد پالت چوبی', width: 20 },
      { key: 'پالت پلاستیکی', header: 'پالت پلاستیکی', width: 20 },
      { key: 'کد پالت پلاستیکی', header: 'کد پالت پلاستیکی', width: 20 },
      { key: 'سبد ماست پگاه', header: 'سبد ماست پگاه', width: 20 },
      { key: 'کد سبد ماست پگاه', header: 'کد سبد ماست پگاه', width: 20 },
      { key: 'سبد دوغ پگاه', header: 'سبد دوغ پگاه', width: 20 },
      { key: 'کد سبد دوغ پگاه', header: 'کد سبد دوع پگاه', width: 20 },
      { key: 'سبد دومینو', header: 'سبد دومینو', width: 20 },
      { key: 'کد سبد دومینو', header: 'کد سبد دومینو', width: 20 },
      { key: 'سبد هراز', header: 'سبد هراز', width: 20 },
      { key: 'کد سبد هراز', header: 'کد سبد هراز', width: 20 },
      { key: 'سبد کاله', header: 'سبد کاله', width: 20 },
      { key: 'کد سبد کاله', header: 'کد سبد کاله', width: 20 },
      { key: 'سبد پاک', header: 'سبد پاک', width: 20 },
      { key: 'کد سبد پاک', header: 'کد سبد پاک', width: 20 },
      { key: ' سبد کارتن', header: 'سبد کارتن', width: 20 },
      { key: 'کاربر فروشگاه', header: 'کاربر فروشگاه', width: 20 },
      { key: 'تاریخ ثبت فروشگاه', header: 'تاریخ ثبت فروشگاه', width: 20 },
      { key: 'ساعت ثبت فروشگاه', header: 'ساعت ثبت فروشگاه', width: 20 },
      { key: 'ثبت شده توسط راننده', header: 'ثبت شده توسط راننده', width: 20 },
      { key: 'نام راننده', header: 'نام راننده', width: 20 },
      { key: 'تاریخ ثبت راننده', header: 'تاریخ ثبت راننده', width: 20 },
      { key: 'ساعت ثبت راننده', header: 'ساعت ثبت راننده', width: 20 },
      { key: 'نام کارگر انبار', header: 'نام کارگر انبار', width: 20 },
      { key: 'تاریخ ثبت انبار', header: 'تاریخ ثبت انبار', width: 20 },
      { key: 'ساعت ثبت انبار', header: 'ساعت ثبت انبار', width: 20 },
    ];
    data.forEach((x) => {
      workSheet.addRow(Object.values(x));
    });
    const buffer = await book.xlsx.writeBuffer();
    return buffer;
  }

  async findAllByShopCode(shopCode: string, body: FindOrderDto) {
    const findMin = await this.orderRepository.findAll({});
    console.log(findMin);

    const todayHistory = this.getTime().message.result;
    if (body.afterHistory && body.beforeHistory) {
      const findAllByShopCode = await this.orderRepository.findAll({
        where: {
          shopId: shopCode,

          history: {
            [Op.in]: [body.beforeHistory, body.afterHistory],
          },
        },
      });
      return {
        status: 200,
        message: findAllByShopCode,
      };
    }
    const findAllByShopCode = await this.orderRepository.findAll({
      where: {
        shopId: shopCode,
        history: {
          [Op.in]: [todayHistory, todayHistory],
        },
      },
    });
    return {
      status: 200,
      message: findAllByShopCode,
    };
  }

  async findAllOrdersByFilter(body: FindOrderDto) {
    const findMin = await this.orderRepository.min('history');
    console.log(findMin);
    const todayHistory = this.getTime().message.result;
    if (body.afterHistory && body.beforeHistory) {
      const findAllByShopCode = await this.orderRepository.findAll({
        where: {
          history: {
            [Op.in]: [body.beforeHistory, body.afterHistory],
          },
        },
      });
      return {
        status: 200,
        message: findAllByShopCode,
      };
    }
    const findAllByShopCode = await this.orderRepository.findAll({
      where: {
        history: {
          [Op.in]: [todayHistory, todayHistory],
        },
      },
    });
    return {
      status: 200,
      message: findAllByShopCode,
    };
  }

  async findByOrderSub(orderSub: string) {
    const todayHistory = this.getTime().message.result;
    const findByOrderSub = await this.orderRepository.findAll({
      where: {
        orderSub: orderSub,
        history: {
          [Op.between]: [todayHistory, todayHistory],
        },
      },
      order: [
        ['history', 'DESC'],
        ['hours', 'DESC'],
      ],
    });
    return {
      status: 200,
      message: findByOrderSub,
    };
  }
}
