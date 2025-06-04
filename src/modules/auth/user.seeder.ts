import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { throwError } from "src/helper/funcation.helper";
import { User } from "src/models";
import * as bcrypt from 'bcryptjs'

@Injectable()
export class UserSeeder implements OnModuleInit {
    constructor(
        @InjectModel(User) private readonly userModel: typeof User
    ) { }
    async onModuleInit() {
        await this.seedAdmin()
    }

    private async seedAdmin() {
        try {
            const exist = await this.userModel.findOne({ where: { role: "admin" } })
            if (!exist) {
                const hashedPassword = await bcrypt.hash('admin', 10)
                await this.userModel.create({
                    firstName: "admin",
                    lastName: "admin",
                    email: "admin@gmail.com",
                    role: "admin",
                    countryCode: "IN",
                    isAgree: true,
                    isSubscribed: true,
                    password: hashedPassword
                })
                console.log('admin created')
            }
        } catch (error) {
            throwError(error.message)
        }
    }
}