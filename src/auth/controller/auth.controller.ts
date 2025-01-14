import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  UseInterceptors,
  UploadedFile,
  Delete,
  Put,
  Query,
  Param,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { SignUpDto } from '../dtos/signUp.dto';
import { Response } from 'express';
import { UniqueConstraintError } from 'sequelize';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { DeleteUserDto } from '../dtos/deleteUser';
import { UpdateDto } from '../dtos/update.dto';
import { FindUserDto } from '../dtos/findUser';
import { listOfZone } from 'src/static/enum';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/api/auth/all')
  async getAll(@Res() response: Response) {
    try {
      const res = await this.authService.getAll();
      response.status(res.status).json(res.data);
    } catch (err) {
      console.log(err);
      response.status(500).json('internal server Error');
    }
  }

  @Get('/api/auth/get/:userId')
  async getUser(@Res() response: Response, @Param('userId') userId: number) {
    try {
      const user = await this.authService.getUser(userId);
      response
        .status(user.status)
        .json({ message: user.message, data: user.data });
    } catch (err) {
      console.log(err);
      response.status(500).json('internal server Error');
    }
  }

  @Get('/api/auth/zone') async listZone(@Res() response: Response) {
    try {
      response.status(200).json({ message: 'list of zone', data: listOfZone });
    } catch (err) {
      console.log(err);
      response.status(500).json('internal server Error');
    }
  }
  @Post('/api/signup')
  async signUp(@Body() body: SignUpDto, @Res() response: Response) {
    try {
      const signUp = await this.authService.signUp(body);
      response.status(signUp.status).json(signUp.message);
    } catch (err) {
      if (err instanceof UniqueConstraintError) {
        response.status(400).json('already in use');
      } else {
        console.log(err);
        response.status(500).json('internal server Error');
      }
    }
  }

  @Put('/api/auth/updateUser/:userId')
  async updateUser(
    @Body() body: any,
    @Res() response: Response,
    @Param('userId') userId: number,
  ) {
    try {
      const updateUser = await this.authService.updateUser(body, userId);
      response.status(updateUser.status).json(updateUser.message);
    } catch (err) {
      console.log(err);
      response.status(500).json('internal server Error');
    }
  }

  @Post('/api/login')
  async logIn(@Body() body: SignUpDto, @Res() response: Response) {
    try {
      const logIn = await this.authService.login(body);
      console.log(logIn.message);

      response.status(logIn.status).json(logIn.message);
    } catch (err) {
      console.log(err);
      response.status(500).json('internal server Error');
    }
  }

  // @Post('/api/sendEmail')
  // async sendEmail(@Body() body: SignUpDto, @Res() response: Response) {
  //   try {
  //     const sendEmail = await this.authService.sendEmail(body);
  //     response.status(sendEmail.status).json(sendEmail.message);
  //   } catch (err) {
  //     console.log(err);
  //     response.status(500).json('is internal');
  //   }
  // }

  @Post('/api/resetPassword')
  async resetPassword(@Body() body: any, @Res() response: Response) {
    try {
      const resetPassword = await this.authService.resetPassword(body);
      response.status(resetPassword.status).json(resetPassword.message);
    } catch (err) {
      response.status(500).json('inetrnal server error');
    }
  }

  @Get('/api/sameUser')
  async sameUsers(@Body() body: SignUpDto, @Res() response: Response) {
    try {
      const sameUser = await this.authService.sameUsers(body);
      response.status(sameUser.status).json(sameUser.message);
    } catch (err) {
      console.log(err);

      response.status(500).json('internal server error');
    }
  }

  @Post('/api/findByRole')
  async findByRole(@Body() body: SignUpDto, @Res() response: Response) {
    try {
      const findByRole = await this.authService.findByRole(body);
      response.status(findByRole.status).json(findByRole.message);
    } catch (err) {
      response.status(500).json('internal server error');
    }
  }

  @Post('/api/importExcel')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'uploads/',
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    }),
  )
  async importExcel(
    @UploadedFile() file: Express.Multer.File,
    @Res() response: Response,
  ) {
    try {
      const importExcel =
        await this.authService.importDriversExcelToMysql(file);
      response.status(200).json('uploaded');
    } catch (err) {
      console.log(err);

      response.status(500).json('internal server error');
    }
  }

  @Delete('/api/deleteUser/:userId')
  async deleteUser(@Param('userId') userId: number, @Res() response: Response) {
    try {
      const deleteUser = await this.authService.deleteUser(userId);
      response.status(deleteUser.status).json(deleteUser.message);
    } catch (err) {
      console.log(err);

      response.status(500).json('internal server error');
    }
  }

  @Post('/api/getUserById')
  async getUserById(@Body() body: DeleteUserDto, @Res() response: Response) {
    try {
      const getUserById = await this.authService.getUserById(body.id);
      response.status(getUserById.status).json(getUserById.message);
    } catch (err) {
      response.status(500).json('internal server error');
    }
  }

  @Put('/api/updateStockUser')
  async updateStockUser(@Body() body: UpdateDto, @Res() response: Response) {
    try {
      const updateStockUser = await this.authService.updateStockUser(body);
      response.status(updateStockUser.status).json(updateStockUser.message);
    } catch (err) {
      response.status(500).json('internal server error');
    }
  }
  //#hint search user
  @Get('/api/findUserByName')
  async findUserByName(
    @Query('shopId') shopId: any,
    @Query('subscriber') subscriber: any,
    @Query('nmorpc') nmorpc: any,
    @Res() response: Response,
  ) {
    try {
      const findUserByName = await this.authService.findUserByAttributes(
        shopId,
        subscriber,
        nmorpc,
      );
      response.status(findUserByName.status).json(findUserByName.message);
    } catch (err) {
      response.status(500).json('internal server error');
    }
  }

  @Post('/api/getUsersByShopCode')
  async getUsersByShopCode(
    @Body() body: FindUserDto,
    @Res() response: Response,
  ) {
    try {
      const getUsersByShopCode = await this.authService.getUsersByShopCode(
        body.shopCode,
      );
      response
        .status(getUsersByShopCode.status)
        .json(getUsersByShopCode.message);
    } catch (err) {
      response.status(500).json('internal server error');
    }
  }

  @Post('/api/findAllBySubscriber')
  async findAllBySubscriber(
    @Body() body: SignUpDto,
    @Res() response: Response,
  ) {
    try {
      const findAllBySubscriber = await this.authService.findUsersBySubscriber(
        body.subscriber,
      );
      response
        .status(findAllBySubscriber.status)
        .json(findAllBySubscriber.message);
    } catch (err) {
      response.status(500).json('internal server error');
    }
  }

  @Delete('/api/deleteOperator')
  async deleteOperator(@Body() body: DeleteUserDto, @Res() response: Response) {
    try {
      const deleteOperator = await this.authService.deleteOperator(body.id);
      response.status(deleteOperator.status).json(deleteOperator.message);
    } catch (err) {
      response.status(500).json('internal server error');
    }
  }
}
