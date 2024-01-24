import { Injectable } from '@nestjs/common';

@Injectable()
export class GenerateCode {
  constructor() {}

  generateCode() {
    const maxNumberOfPassword = 99999;
    const minNumberOfPassword = 10000;
    let password = Math.floor(
      Math.random() * (maxNumberOfPassword - minNumberOfPassword) + 1,
    );
    if (password.toString().length < 4) {
      password = password * 10;
    }

    return {
      status: 200,
      message: password,
    };
  }
}
