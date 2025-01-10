import { OperatorShop } from "./operatorShop.schema";

export const OperatorShopProviders = [
  {
    provide: 'OPERATOR_SHOP',
    useValue: OperatorShop,
  },
];