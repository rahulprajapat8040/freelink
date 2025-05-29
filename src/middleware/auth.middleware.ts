import { Injectable, NestMiddleware } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { NextFunction, Request, Response } from "express";
import * as jwt from 'jsonwebtoken'
import { User } from "src/models";
@Injectable()
export class AuthMiddleWare implements NestMiddleware {
    constructor(@InjectModel(User) private readonly userModel: typeof User) { }
    async use(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer")) {
            const token = authHeader.split(" ")[1];
            try {
                const secretKey = process.env.JWT_ACCESS_TOKEN_KEY;
                if (!secretKey) throw new Error("JWT_ACCESS_TOKEN_KEY is not defined!");
                const decoded = jwt.verify(token, secretKey) as unknown as { userId: string; role: string };
                const user: User | null = await this.userModel.findByPk(decoded.userId)
                if (user) {
                    req.user = user;
                } else {
                    req.user = undefined
                }
            } catch (error) {
                req.user = undefined
            }
        }
        next()
    }
}