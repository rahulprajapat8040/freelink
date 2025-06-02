import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import { FreelancerService } from "./freelancer.service";
import { AuthGuard } from "src/guards/auth.guard";
import { RolesGuard } from "src/guards/roles.guard";
import { Roles } from "src/guards/roles.decorator";
import { BidDto } from "./dto";
import { Request } from "express";
import { User } from "src/models";

@Controller('freelancer')
export class FreelancerController {
    constructor(
        private readonly freelancerService: FreelancerService
    ) { }


    @Post('apply-bid')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('freelancer')
    async applyBid(
        @Body() bidDto: BidDto,
        @Req() req: Request
    ) {
        return this.freelancerService.applyBid(bidDto, req.user as User)
    };

    @Get('get-bids')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('freelancer')
    async getBids(
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Req() req: Request
    ) {
        return this.freelancerService.getBids({ page, limit }, req.user as User)
    };

    @Get('get-bid')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('freelancer')
    async getBid(
        @Query('bidId') bidId: string,
        @Req() req: Request
    ) {
        return this.freelancerService.getBid(bidId, req.user as User)
    }

}