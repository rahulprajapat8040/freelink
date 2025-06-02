import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { Observable } from "rxjs";
import { User } from "src/models";
import { ROLE_KEY } from "./roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector
    ) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLE_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) return true;

        const request: Request = context.switchToHttp().getRequest()
        const user = request.user as User
        if (!user || !requiredRoles.includes(user.role)) {
            throw new ForbiddenException('Access defined');
        }

        return true
    }
}