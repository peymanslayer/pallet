import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class InsertOrderDto {
  @IsNotEmpty()
  @IsNumber()
  woodPallet: number;

  @IsNotEmpty()
  @IsNumber()
  plasticPallet: number;

  @IsNotEmpty()
  @IsNumber()
  basketOfPegahYogurt: number;

  @IsNotEmpty()
  @IsNumber()
  basketOfPegahِDough: number;

  @IsNotEmpty()
  @IsNumber()
  dominoBasket: number;

  @IsNotEmpty()
  @IsNumber()
  harazBasket: number;

  @IsNotEmpty()
  @IsNumber()
  kallehBasket: number;

  @IsNotEmpty()
  @IsNumber()
  boxBasket: number;

  @IsNotEmpty()
  @IsNumber()
  orderNumber: number;

  @IsNotEmpty()
  shopId: number;

  @IsNotEmpty()
  driverId: number;

  @IsNotEmpty()
  Password5Number: number;

  @IsNotEmpty()
  history: string;

  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  driverName: string;

  @IsNotEmpty()
  hoursOfRegisterDriver: string;

  @IsNotEmpty()
  historyOfDriver: string;

  @IsNotEmpty()
  shopUser: string;

  @IsNotEmpty()
  hours: string;

  @IsNotEmpty()
  woodPalletCheckDriver: boolean;

  @IsNotEmpty()
  plasticPalletCheckDriver: boolean;

  @IsNotEmpty()
  basketOfPegahYogurtCheckDriver: boolean;

  @IsNotEmpty()
  basketOfPegahِDoughCheckDriver: boolean;

  @IsNotEmpty()
  dominoBasketCheckDriver: boolean;

  @IsNotEmpty()
  harazBasketCheckDriver: boolean;

  @IsNotEmpty()
  kallehBasketCheckDriver: boolean;

  @IsNotEmpty()
  boxBasketCheckDriver: boolean;

  @IsNotEmpty()
  woodPalletCheckStock: boolean;

  @IsNotEmpty()
  plasticPalletCheckStock: boolean;

  @IsNotEmpty()
  basketOfPegahYogurtCheckStock: boolean;

  @IsNotEmpty()
  basketOfPegahِDoughCheckStock: boolean;

  @IsNotEmpty()
  dominoBasketCheckStock: boolean;

  @IsNotEmpty()
  harazBasketCheckStock: boolean;

  @IsNotEmpty()
  kallehBasketCheckStock: boolean;

  @IsNotEmpty()
  boxBasketCheckStock: boolean;

  @IsNotEmpty()
  basketOfpaakDough: number;

  @IsNotEmpty()
  basketOfpaakyogurt: number;

  @IsNotEmpty()
  basketOfpaakDoughCheckDriver: boolean;

  @IsNotEmpty()
  basketOfpaakyogurtCheckDriver: boolean;

  @IsNotEmpty()
  basketOfpaakyogurtCheckStock: boolean;

  @IsNotEmpty()
  basketOfpaakDoughCheckStock: boolean;

  @IsNotEmpty()
  orderSub: string;
}
