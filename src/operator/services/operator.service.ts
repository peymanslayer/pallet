import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { Operator } from '../operator.schema';
import { OrderService } from 'src/order/services/order.service';
import { AuthService } from 'src/auth/services/auth.service';
import { InsertOperatorDto } from '../dtos/insertDto';
import { OperatorShop } from 'src/operatorShop/operatorShop.schema';

@Injectable()
export class OperatorService {
  constructor(
    @Inject('OPERATOR_PROVIDER')
    private readonly operatorRepository: typeof Operator,
    private readonly orderService: OrderService,
    @Inject(forwardRef(()=>AuthService))
    private readonly authService:AuthService
  ) {}

  async insertOperator(body:InsertOperatorDto){
   let createOperator;
   const signUp=await this.authService.signUp(body);
   if(signUp.message!=='user exist'){
    createOperator=await this.operatorRepository.create({...body})
   }
   return{
    status:200,
    message:{
        signUp:signUp.message,
        createOperator
    }
   }
  }

  async findOneOperator(name:string){
    const findOneOperator=await this.operatorRepository.findOne({
        where:{name:name}
    });
    return{
     status:200,
     message:findOneOperator
    }
  }

  async findOneOperatorWithAssociaton(id:number){
   const findOneOperatorWithAssociaton=await this.operatorRepository.findOne({
    where:{id:id},
    include:OperatorShop
   })

   return{
    status:200,
    message:findOneOperatorWithAssociaton
   }
  }

  async updateOperator(oldName:string,newName:string){
   const update=this.operatorRepository.update({
    name:newName
   },{
    where:{name:oldName}
   });
   return update
  }

  async deleteOperator(name:string){
   const deleteOperator=await this.operatorRepository.destroy({
    where:{name:name}
   });
   return deleteOperator
  }
}
