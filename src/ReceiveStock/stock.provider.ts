import { Stock } from "./stock.entity";

export const StockProviders = [
  {
    provide: 'STOCK_REPOSITORY',
    useValue: Stock,
  },
];
