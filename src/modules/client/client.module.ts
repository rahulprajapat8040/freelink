import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Models } from "src/models";
import { ClientController } from "./client.controller";
import { ClientService } from "./client.service";

@Module({
    imports: [SequelizeModule.forFeature(Models)],
    controllers: [ClientController],
    providers: [ClientService]
})

export class ClientModule { }