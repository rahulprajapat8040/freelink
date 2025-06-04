import { Body, Controller, Delete, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import { FreelancerService } from "./freelancer.service";
import { AuthGuard } from "src/guards/auth.guard";
import { RolesGuard } from "src/guards/roles.guard";
import { Roles } from "src/guards/roles.decorator";
import { BidDto } from "./dto";
import { Request } from "express";
import { User } from "src/models";
import { MulterRequest } from "src/types/multerRequest";

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

    @Post('add-portfolio-project')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('freelancer', 'client')
    async addPortfolioProject(
        @Req() req: MulterRequest,
    ) {
        return this.freelancerService.addPortfolioProject(req, req.user as User);
    };

    @Get('get-all-projects')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('freelancer')
    async getPortolioProjects(
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Req() req: Request
    ) {
        return this.freelancerService.getPortolios({ page, limit }, req.user as User);
    };

    @Get('get-project-detail')
    @UseGuards(AuthGuard)
    async getPortfolioProject(
        @Query('projectId') projectId: string
    ) {
        return this.freelancerService.getPortfolio(projectId);
    };

    @Delete('delete-project')
    @UseGuards(AuthGuard)
    async deleteProject(
        @Query('projectId') projectId: string
    ) {
        return this.freelancerService.deleteProject(projectId);
    };

};