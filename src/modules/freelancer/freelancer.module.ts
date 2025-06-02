import { Module } from "@nestjs/common";
import { FreelancerController } from "./freelancer.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Models } from "src/models";
import { FreelancerService } from "./freelancer.service";

@Module({
    imports: [SequelizeModule.forFeature(Models)],
    controllers: [FreelancerController],
    providers: [FreelancerService]
})

export class FreelancerModule { }