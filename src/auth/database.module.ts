import { Module } from '@nestjs/common';
import { AuthProviders } from './auth.provider';
import { databaseProviders } from 'src/config/database';

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
