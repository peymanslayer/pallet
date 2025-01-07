import { PartialType } from '@nestjs/mapped-types';
import { CreateKilometerDto } from './create-kilometer.dto';

export class UpdateKilometerDto extends PartialType(CreateKilometerDto) {}
