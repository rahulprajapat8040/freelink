import { Body, Controller, Get, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, SignupDto } from "./auth.dto";
import { Request } from "express";
import { AuthGuard } from "src/guards/auth.guard";
import { User } from "src/models";
import { MulterRequest } from "src/types/multerRequest";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) { }
    @Post('signup')
    async signup(@Body() signupDto: SignupDto) {
        return this.authService.signup(signupDto)
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto)
    }

    @Get('log-out')
    async logout(
        @Query('deviceId') deviceId: string
    ) {
        return this.authService.logout(deviceId)
    }

    @Get('user-info')
    @UseGuards(AuthGuard)
    async getUserInfo(
        @Req() req: Request
    ) {
        return this.authService.getUser(req.user as User)
    }

    @Put('update-user-info')
    @UseGuards(AuthGuard)
    async updateUserInfo(
        @Req() req: MulterRequest
    ) {
        return this.authService.updateUserDetail(req, req.user as User)
    }
}