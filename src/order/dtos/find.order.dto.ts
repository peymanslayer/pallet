import { IsNotEmpty, IsNumber } from "class-validator";

export class FindOrderDto{
 @IsNotEmpty()
 @IsNumber()
 shopId:number

 @IsNotEmpty()
 @IsNumber()
 userId:number

 @IsNotEmpty()
 id:number

 @IsNotEmpty()
 beforeHistory:string

 @IsNotEmpty()
 afterHistory:string

 @IsNotEmpty()
 name:string

 @IsNotEmpty()
 stockId:number

 @IsNotEmpty()
 hoursOfRegisterStock:string

 @IsNotEmpty()
 historyOfStock:string

 @IsNotEmpty()
 woodPalletCheckDriver:boolean

 @IsNotEmpty()
 plasticPalletCheckDriver:boolean

 @IsNotEmpty()
 basketOfPegahYogurtCheckDriver:boolean

 @IsNotEmpty()
 basketOfPegahِDoughCheckDriver:boolean

 @IsNotEmpty()
 dominoBasketCheckDriver:boolean

 @IsNotEmpty()
 harazBasketCheckDriver:boolean

 @IsNotEmpty()
 kallehBasketCheckDriver:boolean

 @IsNotEmpty()
 boxBasketCheckDriver:boolean

 @IsNotEmpty()
 woodPalletCheckStock:boolean

 @IsNotEmpty()
 plasticPalletCheckStock:boolean

 @IsNotEmpty()
 basketOfPegahYogurtCheckStock:boolean

 @IsNotEmpty()
 basketOfPegahِDoughCheckStock:boolean

 @IsNotEmpty()
 dominoBasketCheckStock:boolean

 @IsNotEmpty()
 harazBasketCheckStock:boolean

 @IsNotEmpty()
 kallehBasketCheckStock:boolean

 @IsNotEmpty()
 boxBasketCheckStock:boolean

 @IsNotEmpty()
 basketOfpaakDough:number

 @IsNotEmpty()
 basketOfpaakyogurt:number

 @IsNotEmpty()
 basketOfpaakDoughCheckDriver:boolean

 @IsNotEmpty()
 basketOfpaakyogurtCheckDriver:boolean

 @IsNotEmpty()
 basketOfpaakyogurtCheckStock:boolean

 @IsNotEmpty()
 basketOfpaakDoughCheckStock:boolean

 @IsNotEmpty()
 shopCode:string

}