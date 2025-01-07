import { IsNumber } from "class-validator"

export class CreateKilometerDto {
    @IsNumber()
    carNumber: number
    @IsNumber()
    currenrKilometer: number
    @IsNumber()
    previousKilometer: number
}
