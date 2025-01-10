import {
  Controller,
  Get,
  Body,
  Res,
  Post,
  Delete,
  Param,
  Put,
  Req,
  Patch,
} from '@nestjs/common';
import { InsertOrderDto } from '../dtos/insert.order.dto';
import { Response, response } from 'express';
import { OrderService } from '../services/order.service';
import { FindOrderDto } from '../dtos/find.order.dto';
import { DeleteOrderDto } from '../dtos/delete.order.dto';
import { GenerateCode } from '../services/generate.code';
import { OrderDriverService } from '../services/orderDriver.service';
import { UpdateOrderDto } from '../dtos/update.order.dto';
import { HttpService } from '@nestjs/axios';
import { Workbook } from 'exceljs';
import * as path from 'path';
import { ExcelDto } from '../dtos/excelDto';

@Controller()
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly generateCodeService: GenerateCode,
    private readonly orderDriverService: OrderDriverService,
    private readonly httpService: HttpService,
  ) {}
  // jamal comment : i know this uri method most patch but, i can't describe this for teammate
  @Post('/api/insertorder')
  async insertOrder(@Body() body: InsertOrderDto, @Res() response: Response) {
    try {
      const insertOrder = await this.orderService.insertOrder(body);
      response.status(insertOrder.status).json(insertOrder.message);
    } catch (err) {
      console.log(err);
      response.status(500).json('internal server error');
    }
  }

  @Post('/api/findOrder')
  async findOrder(@Body() body: FindOrderDto, @Res() response: Response) {
    try {
      const findOrder = await this.orderService.findOrder(body);
      response.status(findOrder.status).json(findOrder.message);
    } catch (err) {
      console.log(err);

      response.status(500).json('internal server error');
    }
  }

  @Delete('/api/deleteOrder')
  async deleteOrder(@Body() body: DeleteOrderDto, @Res() response: Response) {
    try {
      const deleteOrder =
        await this.orderService.deleteOrderAndUpdateComment(body);
      response.status(deleteOrder.status).json(deleteOrder.message);
    } catch (err) {
      console.log(err);

      response.status(500).json('internal server error');
    }
  }

  @Post('/api/ShopPassword')
  generatePassword(@Res() response: Response) {
    try {
      const generatePassword = this.generateCodeService.generateCode();
      response.status(generatePassword.status).json(generatePassword.message);
    } catch (err) {
      response.status(500).json('internal server error');
    }
  }

  @Get('/api/getOrderByDriver/:id')
  async getOrderByDriver(@Res() response: Response, @Param() id: any) {
    try {
      const getOrderByDriver =
        await this.orderDriverService.findAllOrderOfDriver(id.id);
      response.status(getOrderByDriver.status).json(getOrderByDriver.message);
    } catch (err) {
      console.log(err);

      response.status(500).json('internal server error');
    }
  }
  @Post('/api/updateOrderDriver')
  async updateOrderDriver(
    @Body() body: UpdateOrderDto,
    @Res() response: Response,
  ) {
    try {
      const updateOrderDriver = await this.orderService.updateOrderDriver(
        body.driverId,
        body.shopId,
        body.orderId,
      );
      response.status(updateOrderDriver.status).json(updateOrderDriver.message);
    } catch (err) {
      console.log(err);
      response.status(500).json('internal server error');
    }
  }
  // hint : call for register order by id
  @Post('/api/insertOrderDriverById')
  async insertOrderDriverById(
    @Body() body: UpdateOrderDto,
    @Res() response: Response,
  ) {
    try {
      const insertOrderDriverById =
        await this.orderDriverService.insertOrderByDriver(
          body.driverId,
          body.orderId,
          body,
        );
      response
        .status(insertOrderDriverById.status)
        .json(insertOrderDriverById.message);
    } catch (err) {
      console.log(err);
      response.status(500).json(err.mesaage);
    }
  }
  @Post('/api/getOrderById')
  async getOrderById(@Body() body: FindOrderDto, @Res() response: Response) {
    try {
      const getOrderById = await this.orderService.getOrderById(body.id);
      response.status(getOrderById.status).json(getOrderById.message);
    } catch (err) {
      response.status(500).json('internal server error');
    }
  }

  @Post('/api/getNewOrderNumber')
  async getNewOrderNumber(@Body() body: any, @Res() response: Response) {
    try {
      const getNewOrderNumber = await this.orderService.getNewOrderNumber(body);
      response.status(201).json(getNewOrderNumber);
    } catch (err) {
      response.status(500).json('internal server Error');
    }
  }
  // #hint: front url: store-order/details -> button ثبت سفارش
  @Post('/api/getOrdersByUser')
  async getOrdersByUser(@Body() body: FindOrderDto, @Res() response: Response) {
    try {
      const getOrdersByUser = await this.orderService.findOrderByUserId(
        body.userId,
      );
      response.status(getOrdersByUser.status).json(getOrdersByUser.message);
    } catch (err) {
      response.status(500).json('internal server Error');
    }
  }
  // #hint :
  @Post('/api/updateOrder')
  async updateOrderByPassword(
    @Body() body: InsertOrderDto,
    @Res() response: Response,
  ) {
    try {
      const updateOrder = await this.orderService.updateOrderByPassword(
        body.Password5Number,
        body.shopId,
      );
      response.status(updateOrder.status).json(updateOrder.message);
    } catch (err) {
      response.status(500).json('internal server error');
    }
  }

  @Put('/api/updateOrderById')
  async updateOrderById(
    @Body() body: InsertOrderDto,
    @Res() response: Response,
  ) {
    try {
      const updateOrderById = await this.orderService.updateOrder(
        body.id,
        body,
      );
      response.status(updateOrderById.status).json(updateOrderById.message);
    } catch (err) {
      response.status(500).json('internal server error');
    }
  }

  @Post('/api/insertToOrderDriver')
  async insertToOrderDriver(
    @Body() body: FindOrderDto,
    @Res() response: Response,
  ) {
    try {
      const insertToOrderDriver =
        await this.orderDriverService.insertToOrderDriver(
          body.shopId,
          body.userId,
        );
      response
        .status(insertToOrderDriver.status)
        .json(insertToOrderDriver.message);
    } catch (err) {
      console.log(err);
      response.status(500).json('internal server error');
    }
  }

  @Post('/api/findRegisteredOrderByDriver')
  async findRegisteredOrderByDriver(
    @Body() body: FindOrderDto,
    @Res() response: Response,
  ) {
    try {
      const findRegisteredOrderByDriver =
        await this.orderService.findRegisteredOrderByDriver(body);
      response
        .status(findRegisteredOrderByDriver.status)
        .json(findRegisteredOrderByDriver.message);
    } catch (err) {
      console.log(err);

      response.status(500).json('internal server error');
    }
  }
  @Post('/api/findOrderByShopId')
  async findOrderByShopId(
    @Body() body: FindOrderDto,
    @Res() response: Response,
  ) {
    try {
      const findOrderByShopId = await this.orderService.findOrderByShopId(body);
      response.status(findOrderByShopId.status).json(findOrderByShopId.message);
    } catch (err) {
      response.status(500).json('internal server error');
    }
  }
  // #hint: front url : list-orders
  @Post('/api/orderList')
  async OrderList(@Body() body: FindOrderDto, @Res() response: Response) {
    try {
      const orderList = await this.orderService.findOrderList(
        body.shopId,
        body.userId,
        body,
      );
      response.status(orderList.status).send(orderList);
    } catch (err) {
      console.log(err);
      response.status(500).json('inetrnal server error');
    }
  }

  @Delete('/api/deleteOrderDriver')
  async deleteOrderDriver(
    @Body() body: FindOrderDto,
    @Res() response: Response,
  ) {
    try {
      const deleteOrderDriver =
        await this.orderDriverService.deleteOrderDriverService(
          body.userId,
          body.shopId,
        );
      response.status(deleteOrderDriver.status).json(deleteOrderDriver.message);
    } catch (err) {
      console.log(err);

      response.status(500).json('internal server error');
    }
  }

  @Post('/api/findAllOrdersByDriverId')
  async findAllOrdersByDriverId(
    @Body() body: FindOrderDto,
    @Res() response: Response,
  ) {
    try {
      const findAllOrdersByDriverId =
        await this.orderService.findAllOrdersByDriverId(body);
      response
        .status(findAllOrdersByDriverId.status)
        .json(findAllOrdersByDriverId.message);
    } catch (err) {
      console.log(err);

      response.status(500).json('internal server error');
    }
  }

  @Post('/api/findAllOrdersRegisteredByStock')
  async findAllOrdersRegisteredByStock(
    @Body() body: FindOrderDto,
    @Res() response: Response,
  ) {
    try {
      const findAllOrdersRegisteredByStock =
        await this.orderService.findAllOrdersRegisteredByStock(
          body.stockId,
          body,
        );
      response
        .status(findAllOrdersRegisteredByStock.status)
        .json(findAllOrdersRegisteredByStock.message);
    } catch (err) {
      response.status(500).json('internal server error');
    }
  }

  @Post('/api/findAllOrdersNotRegisteredByStock')
  async findAllOrdersNotRegisteredByStock(
    @Body() body: FindOrderDto,
    @Res() response: Response,
  ) {
    try {
      const findAllOrdersNotRegisteredByStock =
        await this.orderService.findAllOrdersNotRegisteredByStock(body.userId);
      response
        .status(findAllOrdersNotRegisteredByStock.status)
        .json(findAllOrdersNotRegisteredByStock.message);
    } catch (err) {
      console.log(err);

      response.status(500).json('internal server error');
    }
  }

  @Put('/api/registerOrderByStock')
  async registerOrderByStock(
    @Body() body: FindOrderDto,
    @Res() response: Response,
  ) {
    try {
      const registerOrderByStock =
        await this.orderService.registerOrderByStock(body);
      response
        .status(registerOrderByStock.status)
        .json(registerOrderByStock.message);
    } catch (err) {
      response.status(500).json('internal server error');
    }
  }

  @Delete('/api/deleteOrderForStockUser')
  async deleteOrderForStockUser(
    @Body() body: FindOrderDto,
    @Res() response: Response,
  ) {
    try {
      const deleteOrderForStockUser =
        await this.orderService.deleteOrderForStockUser(body.stockId, body.id);
      response
        .status(deleteOrderForStockUser.status)
        .json(deleteOrderForStockUser.message);
    } catch (err) {
      response.status(500).json('internal server error');
    }
  }

  @Get('/api/getTime')
  async getTime(@Res() response: Response) {
    try {
      const getTime = this.orderService.getTime();
      response.status(getTime.status).json(getTime.message);
    } catch (err) {
      response.status(500).json('internal server error');
    }
  }
  @Get('/api/notDeletedExcel')
  async outPutNotDeletedOrderExcel(@Res() response: Response, @Req() req: any) {
    try {
      const excelPath = path.join(__dirname, '../../../uploads', 'import');
      const outPutNotDeletedOrderExcel =
        await this.orderService.outPutNotDeletedOrderExcel(req.query);
      response.setHeader(
        'Content-Disposition',
        'attachment; filename="exported-data.xlsx"',
      );
      response.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      response.send(outPutNotDeletedOrderExcel);
    } catch (err) {
      response.status(500).json('internal server error');
    }
  }

  @Get('/api/deletedOrderExcel')
  async deletedOrderExcel(@Res() response: Response, @Req() req: any) {
    try {
      const deletedOrderExcel = await this.orderService.deletedExcelOfOrder(
        req.query,
      );
      response.setHeader(
        'Content-Disposition',
        'attachment; filename="exported-data.xlsx"',
      );
      response.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      response.send(deletedOrderExcel);
    } catch (err) {
      response.status(500).json('internal server error');
    }
  }

  @Post('/api/isGeneratedPasswordByDriver')
  async isGeneratedPasswordByDriver(
    @Body() body: FindOrderDto,
    @Res() response: Response,
  ) {
    try {
      const isGeneratedPasswordByDriver =
        await this.orderService.isGeneratedPasswordByDriver(body.id);
      response
        .status(isGeneratedPasswordByDriver.status)
        .json(isGeneratedPasswordByDriver.message);
    } catch (err) {
      console.log(err);

      response.status(500).json('internal server error');
    }
  }

  @Get('/api/listOfExcelOrderByShopCode/:shopId')
  async listOfExcelOrderByShopCode(
    @Req() request: any,
    @Param('shopId') shopId: string,
    @Res() response: Response,
  ) {
    try {
      const listOfExcelOrderByShopCode =
        await this.orderService.listOfExcelOrderByShopCode(shopId);
      response.setHeader(
        'Content-Disposition',
        'attachment; filename="exported-data.xlsx"',
      );
      response.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      response.send(listOfExcelOrderByShopCode);
    } catch (err) {
      console.log(err);

      response.status(500).json('internal server error');
    }
  }

  @Post('/api/findAllByShopCode')
  async findAllByShopCode(
    @Body() body: FindOrderDto,
    @Res() response: Response,
  ) {
    try {
      const findAllByShopCode = await this.orderService.findAllByShopCode(
        body.shopCode,
        body,
      );
      response.status(findAllByShopCode.status).json(findAllByShopCode.message);
    } catch (err) {
      console.log(err);

      response.status(500).json('internal server error');
    }
  }

  @Post('/api/findAllOrdersByFilter')
  async findAllOrdersByFilter(
    @Body() body: FindOrderDto,
    @Res() response: Response,
  ) {
    try {
      const findAllOrdersByFilter =
        await this.orderService.findAllOrdersByFilter(body);
      response
        .status(findAllOrdersByFilter.status)
        .json(findAllOrdersByFilter.message);
    } catch (err) {
      console.log(err);
      response.status(500).json('internal server error');
    }
  }

  @Post('/api/findByOrderSub')
  async findByOrderSub(@Body() orderSub: any, @Res() response: Response) {
    try {
      const findByOrderSub = await this.orderService.findByOrderSub(
        orderSub.orderSub,
      );
      response.status(findByOrderSub.status).json(findByOrderSub.message);
    } catch (err) {
      console.log(err);

      response.status(500).json('internal server error');
    }
  }
}
