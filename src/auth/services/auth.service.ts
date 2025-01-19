import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from '../dtos/signUp.dto';
import { Auth } from '../auth.entity';
import { DriverService } from 'src/driver/services/driver.service';
import { StockService } from 'src/ReceiveStock/services/stock.service';
// import { MailerService } from '@nestjs-modules/mailer';
import { Sequelize } from 'sequelize';
import { Workbook } from 'exceljs';
import * as path from 'path';
import { UpdateDto } from '../dtos/update.dto';
import { OperatorService } from 'src/operator/services/operator.service';
import { Op } from 'sequelize';
import { TruckInfoService } from 'src/truck-info/truck-info.service';
import { ROLES } from 'src/static/enum';
import { TruckInfoInsertDto } from 'src/truck-info/dto/truck-info.insert.dto';
@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_REPOSITORY') private authRepository: typeof Auth,
    private readonly jwt: JwtService,
    private readonly driverService: DriverService,
    private readonly truckInfoService: TruckInfoService,
    private readonly stockService: StockService,
    // private readonly mailService: MailerService,
    @Inject(forwardRef(() => OperatorService))
    private readonly operatorService: OperatorService,
  ) {}

  async getAll() {
    try {
      // TODO ; relation "auth" and "truckInfo"
      const data = {};
      const rows = [];
      const users = await this.authRepository.findAndCountAll({
        attributes: [
          'id',
          'name',
          'originalPassword',
          'role',
          'mobile',
          'personelCode',
          'shopCode',
          'zone',
          'company',
        ],
        where: { role: { [Op.ne]: 'superAdmin' } },
        order: [['id', 'DESC']],
        limit: 100,
      });

      for (let user of users.rows) {
        const usersInfo = {};
        // console.log('user info', user.dataValues);
        Object.assign(usersInfo, user.dataValues);

        if (
          user.dataValues.role === ROLES.COMPANYDRIVER ||
          user.dataValues.role === ROLES.DRIVER
        ) {
          const truckInfo = await this.getTruckInfo(user.dataValues.id);
          if (truckInfo) {
            usersInfo['carNumber'] = truckInfo.carNumber;
            usersInfo['type'] = truckInfo.type;
          } else {
            usersInfo['carNumber'] = '';
            usersInfo['type'] = '';
          }
        }

        rows.push(usersInfo);
      }

      data['count'] = users.count;
      data['rows'] = rows;

      return { status: 200, data: data };
    } catch (err) {
      console.log(err);
      return { status: 500, data: err };
    }
  }
  // start signup service
  async signUp(BodyOfRequset: SignUpDto) {
    const signUp = await this.authRepository.findOne({
      where: { mobile: BodyOfRequset.mobile },
    });
    if (signUp) {
      return {
        status: 400,
        message: 'user exist',
      };
    } else {
      return await this.signUpProcess(BodyOfRequset);
    }
  }

  async signUpProcess(Body: SignUpDto) {
    const hashPassword = await bcrypt.hash(Body.password, 10);
    if (hashPassword) {
      return await this.generateTokenAndCreateUser(Body, hashPassword);
    } else {
      return {
        status: 400,
        message: 'password not hashed',
      };
    }
  }

  async generateTokenAndCreateUser(Body: SignUpDto, hashPassword: string) {
    const generateToken = this.jwt.sign({ name: Body.name });
    if (generateToken) {
      const insertUser = await this.createUser(
        generateToken,
        Body,
        hashPassword,
      );
      const insertToAllRoles = await this.registerAllRoles(
        Body.role,
        Body.name,
      );
      return {
        status: 200,
        message: {
          insertUser,
          insertToAllRoles,
        },
      };
    } else {
      return {
        status: 400,
        message: 'token not generate',
      };
    }
  }

  async registerAllRoles(role: string, name: string) {
    switch (role) {
      case 'driver':
        return this.driverService.insertDriver(name);
      case 'ReceiveStock':
        return this.stockService.insertStockReciever(name);
      case 'companyDriver':
        return this.driverService.insertDriver(name);
      default:
        break;
    }
  }

  async createUser(token: string, Body: SignUpDto, hashpassword: string) {
    Body['originalPassword'] = Body.password;
    Body['token'] = token;
    Body['password'] = hashpassword;
    Body['zone'] = Body.zone;

    const createUser = await this.authRepository.create({
      ...Body,
      // originalPassword: Body.password, // depricated
      // token: token, // depricated
      // password: hashpassword, // depricated
    });
    if (createUser) {
      if (Body.role === ROLES.DRIVER || Body.role === ROLES.COMPANYDRIVER) {
        let truckInfo = new TruckInfoInsertDto();
        truckInfo.carNumber = Body.carNumber
        truckInfo['type'] = Body.type;
        truckInfo['driverId'] = createUser.id;
        truckInfo['zone'] = Body.zone;

        await this.truckInfoService.add(truckInfo);
      }
      return {
        status: 200,
        message: createUser,
      };
    } else {
      return {
        status: 400,
        message: 'user not create',
      };
    }
  }
  // end of signup service

  /////////////////////////////////////

  // start login service

  async login(Body: SignUpDto) {
    let roleDriver: string;
    let driverId: number;
    // let carNumber: string;
    const findUser = await this.authRepository.findOne({
      where: { personelCode: Body.personelCode },
    });
    if (!findUser) {
      return {
        status: 400,
        message: 'user not exist',
      };
    } else {
      const role = findUser.dataValues.role;
      const userId = findUser.dataValues.id;
      console.log('find user is :', findUser.dataValues);
      console.log('driverId is: ', driverId);
      if (role === 'companyDriver') {
        const truckInfoDriver = await this.truckInfoService.get(userId);
        findUser.dataValues['carNumber'] = truckInfoDriver.carNumber;
        findUser.dataValues['truckId'] = truckInfoDriver.id
      }
      // console.log('findUser return endpoint: /n', findUser); // debug
      return await this.loginProcess(findUser, Body);
    }
  }

  async loginProcess(findedUser: Auth, Body: SignUpDto) {
    const comparePassword = await bcrypt.compare(
      Body.password,
      findedUser.password,
    );
    if (comparePassword) {
      return {
        status: 200,
        message: findedUser,
      };
    } else {
      return {
        status: 400,
        message: 'password not match',
      };
    }
  }

  // end of login service
  async generatePassword() {
    const maxNumberOfPassword = 99999;
    const minNumberOfPassword = 10000;
    const password = Math.floor(
      Math.random() * (maxNumberOfPassword - minNumberOfPassword) + 1,
    );
    return {
      status: 200,
      message: password,
    };
  }
  // async sendEmail(body: SignUpDto) {
  //   const findUserByEmail = await this.authRepository.findOne({
  //     where: { email: body.email },
  //   });
  //   if (!findUserByEmail) {
  //     return {
  //       status: 400,
  //       message: 'user not exist',
  //     };
  //   }
  //   this.mailService.sendMail({
  //     from: 'Oshanak.palet@gmail.com',
  //     to: body.email,
  //     subject: 'is email',
  //     text: findUserByEmail.originalPassword,
  //     html: `<div>${findUserByEmail.name} کاربر محترم <br>${findUserByEmail.personelCode} کد پرسنلی  </br><br>${findUserByEmail.originalPassword} رمز عبور </br> </div>`,
  //   });
  //   return {
  //     status: 200,
  //     message: 'email send',
  //   };
  // }

  async resetPassword(body: any) {
    const user = await this.authRepository.findOne({
      where: { personelCode: body.personelCode },
    });
    if (!user) {
      return {
        status: 400,
        message: 'user not exist',
      };
    }
    if (user && user.originalPassword === body.currentPassword) {
      // console.log(Object.entries(user));
      const hashPassword = await bcrypt.hash(body.newPassword, 10);
      // user.password = hashPassword;
      // user.originalPassword = body.newPassword;
      const res = await this.authRepository.update(
        {
          originalPassword: body.newPassword,
          password: hashPassword,
        },
        {
          where: {
            id: user.id,
          },
        },
      );
      if (res) {
        // not used send email in system
        // this.mailService.sendMail({
        //   from: 'Oshanak.palet@gmail.com',
        //   to: body.email,
        //   subject: 'is email',
        //   text: user.originalPassword,
        //   html: `<div>${user.name} کاربر محترم <br>${user.personelCode} کد پرسنلی  </br><br>${user.originalPassword} رمز عبور </br> </div>`,
        // });
        return {
          status: 200,
          message: 'change password successfully',
        };
      }
    } else {
      return {
        status: 420,
        message: ' wrong current password',
      };
    }
  }

  async sameUsers(body: SignUpDto) {
    let array = [];
    const duplicate = await this.authRepository.findAll({
      attributes: ['email'],
      group: ['email'],
      having: Sequelize.literal('COUNT(*) > 1'),
    });
    for (let i = 0; i < duplicate.length; i++) {
      const findAllUsers = await this.authRepository.findAll({
        where: { email: duplicate[i].email },
      });
      array.push(findAllUsers);
    }

    const duplicateMobile = await this.authRepository.findAll({
      attributes: ['mobile'],
      group: ['mobile'],
      having: Sequelize.literal('COUNT(*) > 1'),
    });
    for (let i = 0; i < duplicateMobile.length; i++) {
      const findAllUsers = await this.authRepository.findAll({
        where: { mobile: duplicateMobile[i].mobile },
      });
      array.push(findAllUsers);
    }

    return {
      status: 200,
      message: array,
    };
  }

  async findByRole(body: SignUpDto) {
    const findAllUsersByRole = await this.authRepository.findAll({
      where: { role: body.role },
    });

    return {
      status: 200,
      message: findAllUsersByRole,
    };
  }

  async importDriversExcelToMysql(file: Express.Multer.File) {
    let nameOfDrivers = [];
    let numberOfDrivers = [];
    const book = new Workbook();

    const excelPath = path.join(__dirname, '../../../uploads', file.filename);
    const readFile = book.xlsx.readFile(excelPath).then(async () => {
      const ws = book.getWorksheet('Sheet1');
      const c1 = ws.getColumn(1);
      c1.eachCell((x) => {
        console.log(x.value);
        nameOfDrivers.push(x.value);
      });
      const c2 = ws.getColumn(2);
      c2.eachCell((y) => {
        numberOfDrivers.push(y.value);
      });
      for (let i = 0; i < nameOfDrivers.length; i++) {
        const hashPassword = await bcrypt.hash('123456', 10);
        const token = this.jwt.sign({ name: nameOfDrivers[i] });
        await this.authRepository.create({
          name: nameOfDrivers[i],
          password: hashPassword,
          originalPassword: '123456',
          token: token,
          role: 'companyDriver',
          personelCode: `${numberOfDrivers[i]}`,
          mobile: numberOfDrivers[i],
        });
        await this.driverService.insertDriver(nameOfDrivers[i]);
      }
    });
  }

  async deleteUser(id: number) {
    const res = await this.authRepository.destroy({
      where: { id: id },
    });
    if (res == 0)
      return {
        status: 410,
        message: 'user not found for deleted',
      };
    // await this.driverService.deleteDriverByName(findUser.name); // not used driver model
    return {
      status: 200,
      message: 'deleted user successfully',
    };
  }

  async getUserById(id: number) {
    const getUserById = await this.authRepository.findByPk(id);
    if (getUserById) {
      return {
        status: 200,
        message: getUserById,
      };
    } else {
      return {
        status: 400,
        message: 'user not exist',
      };
    }
  }

  async getById(userId: number) {
    try {
      return await this.authRepository.findOne({
        where: {
          id: userId,
        },
      });
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'internal service error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  // check used in front?!!!
  async updateStockUser(body: UpdateDto) {
    const findedUser = await this.authRepository.findByPk(body.id);
    if (findedUser.role == 'driver' || findedUser.role == 'companyDriver') {
      if (body.password) {
        if (body.name) {
          // update to auth model , comment: checked, not impact
          const updateDriver = await this.driverService.updateDriver(
            findedUser.name,
            body.name,
          );
        }
        const hashed = await bcrypt.hash(body.password, 10);
        findedUser.save();
        const updateUser = await this.authRepository.update(
          {
            ...body,
            originalPassword: body.password,
            password: hashed,
          },
          {
            where: { id: body.id },
          },
        );
        const findUser = await this.authRepository.findByPk(body.id);
        return {
          status: 200,
          message: findUser,
        };
      } else {
        if (body.name) {
          const updateDriver = await this.driverService.updateDriver(
            findedUser.name,
            body.name,
          );
        }
        const updateUser = await this.authRepository.update(
          {
            ...body,
          },
          {
            where: { id: body.id },
          },
        );
        const findUser = await this.authRepository.findByPk(body.id);
        return {
          status: 200,
          message: findUser,
        };
      }
    }
    if (findedUser.role == 'operator') {
      if (body.password) {
        // #comment ; update same operator
        if (body.name) {
          const updateDriver = await this.operatorService.updateOperator(
            findedUser.name,
            body.name,
          );
        }
        const hashed = await bcrypt.hash(body.password, 10);
        // findedUser.save(); // edit by jamal
        const updateUser = await this.authRepository.update(
          {
            ...body,
            originalPassword: body.password,
            password: hashed,
          },
          {
            where: { id: body.id },
          },
        );
        const findUser = await this.authRepository.findByPk(body.id);
        return {
          status: 200,
          message: findUser,
        };
      } else {
        if (body.name) {
          const updateDriver = await this.operatorService.updateOperator(
            findedUser.name,
            body.name,
          );
        }
        const updateUser = await this.authRepository.update(
          {
            ...body,
          },
          {
            where: { id: body.id },
          },
        );
        const findUser = await this.authRepository.findByPk(body.id);
        return {
          status: 200,
          message: findUser,
        };
      }
    }
    // #check ; else if instead of if
    if (body.password) {
      const hashed = await bcrypt.hash(body.password, 10);
      findedUser.save();
      const updateUser = await this.authRepository.update(
        {
          ...body,
          originalPassword: body.password,
          password: hashed,
        },
        {
          where: { id: body.id },
        },
      );
      const findUser = await this.authRepository.findByPk(body.id);
      return {
        status: 200,
        message: findUser,
      };
    } else {
      const updateUser = await this.authRepository.update(
        {
          ...body,
        },
        {
          where: { id: body.id },
        },
      );
      const findUser = await this.authRepository.findByPk(body.id);
      return {
        status: 200,
        message: findUser,
      };
    }
  }

  async updateUser(body: UpdateDto, userId: number) {
    try {
      const fieldsUpdate: object = body;
      if (body.password) {
        fieldsUpdate['originalPassword'] = body.password;
        fieldsUpdate['password'] = await bcrypt.hash(body.password, 10);
      }
      if (await this.truckInfoService.get(userId)) {
        await this.truckInfoService.update(userId, {
          carNumber: body.carNumber,
        });
      }
      const user = await this.authRepository.update(fieldsUpdate, {
        where: {
          id: userId,
        },
      });
      if (user) {
        return {
          message: 'update user successfully',
          status: 200,
        };
      }
    } catch (err) {
      console.log(err);
      return {
        message: 'internal sevice error',
        status: 500,
      };
    }
  }

  async findUserByAttributes(shopId: any, subscriber: any, nmorpc: any) {
    try {
      let where = {};
      let findAllUsers: { rows: Auth[]; count: number };

      if (nmorpc) {
        findAllUsers = await this.authRepository.findAndCountAll({
          where: {
            [Op.or]: [
              { name: { [Op.like]: `%${nmorpc}%` } },
              { personelCode: { [Op.like]: `%${nmorpc}%` } },
            ],
          },
          attributes: [
            'id',
            'name',
            'originalPassword',
            'role',
            'mobile',
            'personelCode',
            'shopCode',
            'zone',
            'company',
          ],
          limit: 50,
        });
      } else {
        if (subscriber) {
          where['subscriber'] = subscriber;
        }
        if (shopId) {
          where['shopCode'] = shopId;
        }
        findAllUsers = await this.authRepository.findAndCountAll({
          where: where,
          attributes: [
            'id',
            'name',
            'originalPassword',
            'role',
            'mobile',
            'personelCode',
            'shopCode',
          ],
          limit: 50,
        });
      }

      return {
        status: 200,
        message: findAllUsers,
      };
    } catch (err) {
      console.log(err);
    }
  }

  async getUsersByShopCode(shopCode: string) {
    const findAll = await this.authRepository.findAll({
      where: { shopCode: shopCode, role: 'user' },
    });
    return {
      status: 200,
      message: findAll,
    };
  }

  async getUser(userId: number) {
    try {
      const user = await this.authRepository.findOne({
        where: {
          id: userId,
        },
      });
      if (user) {
        const data = {};
        Object.assign(data, user.dataValues);
        if (user.role === ROLES.DRIVER || user.role === ROLES.COMPANYDRIVER) {
          const truckInfo = await this.getTruckInfo(user.id);
          // TODO moved two after line to func "getTruckInfo"
          data['carNumber'] = truckInfo.carNumber || '';
          data['type'] = truckInfo.type || '';

          // Object.assign(data);
        }
        return {
          data: data,
          message: 'user find successfully',
          status: 200,
        };
      }
    } catch (err) {
      console.log(err);
    }
  }

  async getTruckInfo(driverId: number) {
    try {
      return await this.truckInfoService.get(driverId);
    } catch (err) {
      console.log(err);
    }
  }

  async findUsersBySubscriber(subscriber: string) {
    let array = [];
    let removeDuplicate = [];
    const findAll = await this.authRepository.findAll({
      where: { subscriber: subscriber },
    });
    const findAllShopCodes = await this.authRepository.findAll({
      where: { subscriber: subscriber },
      attributes: ['shopCode', 'updatedAt'],
      order: [['updatedAt', 'DESC']],
    });
    for (let i = 0; i < findAllShopCodes.length; i++) {
      console.log(array.includes(findAllShopCodes[i]));

      if (array.includes(findAllShopCodes[i].shopCode)) {
      } else {
        array.push(findAllShopCodes[i].shopCode);
      }
    }
    return {
      status: 200,
      message: {
        findAll,
        array,
      },
    };
  }

  async deleteOperator(id: number) {
    const findOneOperator = await this.authRepository.findOne({
      where: { id: id },
    });
    if (findOneOperator) {
      await this.authRepository.destroy({
        where: { id: id },
      });
      await this.operatorService.deleteOperator(findOneOperator.name);
      return {
        status: 200,
        message: 'operator deleted',
      };
    } else {
      return {
        status: 400,
        message: 'operator not found',
      };
    }
  }
  /**
   * find user's in the same zone
   * @param zone
   * @param role
   * is (optional)
   * @param attributes  select field's to return (optional)
   * if not set any thing return all field's
   * @returns user in the same zone
   */
  async userSameZone(
    zone: string,
    role: string = '',
    attributes: Array<string> = [],
    company?: string,
  ) {
    let attribute = {};

    if (!attributes.length) attribute['attributes'] = { exclude: [] };
    // else attribute['attributes'] = attributes;
    // if (!zone) zone = '%';
    // if (!role) role = '%';
    // if (!company) company = '%';
    console.log('attributes: ', attributes);
    console.log('role', role);
    console.log('zone', zone);
  const result= await this.authRepository.findAll({
      where: {
        zone:  role ,
        role:zone,
        company: company
      },
    });
    console.log(result);
    return result
    
  }
  async getUsersByCompanyName(companyName: string) {
    try {
      return await this.authRepository.findAll({
        // attributes: ['id'],
        where: {
          company: companyName,
        },
      });
    } catch (err) {
      console.log(err);
    }
  }

  async getDriverInfo(driverId: number) {
    const driver = await this.authRepository.findOne({
      where: {
        id: driverId,
        role: ROLES.COMPANYDRIVER,
      },
      attributes: ['personelCode', 'company', 'zone'], // فیلدهای موردنیاز از Auth
    });
    return driver;
  }
}
