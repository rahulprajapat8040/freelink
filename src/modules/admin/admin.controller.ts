import { Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { Request } from "express";
import { AuthGuard } from "src/guards/auth.guard";
import { RolesGuard } from "src/guards/roles.guard";
import { Roles } from "src/guards/roles.decorator";

@Controller("admin")
export class AdminController {
    constructor(
        private readonly adminService: AdminService
    ) { }

    @Post("add-category")
    @UseGuards(AuthGuard, RolesGuard)
    @Roles("admin")
    async addCategory(@Req() req: Request) {
        return this.adminService.addCategory(req)
    };

    @Get("get-categories")
    async getCategories(
        @Query('page') page: number,
        @Query('limit') limit: number
    ) {
        return this.adminService.getCategories({ page, limit });
    }
}