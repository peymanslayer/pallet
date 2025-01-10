import { Operator } from "./operator.schema";

export const OperatorProviders = [
  {
    provide: 'OPERATOR_PROVIDER',
    useValue: Operator,
  },
];
