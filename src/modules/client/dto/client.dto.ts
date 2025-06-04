import { IsNotEmpty, IsString } from "class-validator";

export class addNewJob {
    @IsNotEmpty({ message: "Project is required" })
    @IsString()
    projectName: string
    @IsNotEmpty({ message: "min price is required" })
    minPrice: number
    @IsNotEmpty({ message: "max price is required" })
    maxPrice: number
    @IsNotEmpty({ message: "descripiton is required" })
    @IsString()
    description: string
}