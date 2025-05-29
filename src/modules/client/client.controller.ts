import { Body, Controller, Get, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/guards/auth.guard";
import { ClientService } from "./client.service";
import { addNewJob } from "./dto/client.dto";
import { Request } from "express";
import { User } from "src/models";

@Controller('client')
export class ClientController {
    constructor(
        private readonly clientService: ClientService
    ) { }

    @Post("add-new-job")
    @UseGuards(AuthGuard)
    async addNewJob(@Body() jobDto: addNewJob, @Req() req: Request) {
        return this.clientService.addNewJob(jobDto, req.user as User)
    }

    @Put('update-job')
    @UseGuards(AuthGuard)
    async updateJob(
        @Body() jobDto: addNewJob,
        @Query('jobId') jobId: string
    ) {
        return this.clientService.updateJob(jobDto, jobId)
    }

    @Get('get-all-jobs')
    @UseGuards(AuthGuard)
    async getAllJobs(
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Req() req: Request
    ) {
        return this.clientService.getAllJobs({ page, limit }, req.user as User)
    }

    @Get('get-job-detail')
    @UseGuards(AuthGuard)
    async getJobDetail(
        @Query('jobId') jobId: string
    ) {
        return this.clientService.getJobDetail(jobId)
    }
}