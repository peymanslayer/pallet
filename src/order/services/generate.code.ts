import { Injectable } from '@nestjs/common';

@Injectable()
export class GenerateCode {
  constructor() {}

  generateCode() {
    const maxNumberOfPassword = 99999;
    const minNumberOfPassword = 10000;
    const password= Math.floor(
        Math.random() * (maxNumberOfPassword - minNumberOfPassword) + 1,
      );
    return{
        status:200,
        message:password
    }
  }
}
