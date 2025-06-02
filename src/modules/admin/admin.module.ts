import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { Category } from "src/models";
import { FileService } from "../file/file.service";

@Module({
    imports: [
        SequelizeModule.forFeature([Category])
    ],
    controllers: [AdminController],
    providers: [AdminService, FileService]
})

export class AdminModule { }