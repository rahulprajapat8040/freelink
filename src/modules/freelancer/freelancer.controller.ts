import { Body, Controller, Delete, Get, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { FreelancerService } from "./freelancer.service";
import { AuthGuard } from "src/guards/auth.guard";
import { RolesGuard } from "src/guards/roles.guard";
import { Roles } from "src/guards/roles.decorator";
import { BidDto, LanguageDto, SkillDto, WorkHistoryDto } from "./dto";
import { Request } from "express";
import { User } from "src/models";
import { MulterRequest } from "src/types/multerRequest";

@Controller('freelancer')
export class FreelancerController {
    constructor(
        private readonly freelancerService: FreelancerService
    ) { }

    @Get('get-freelancer-account')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles("freelancer")
    async getFreelancerAccount(
        @Req() req: Request
    ) {
        return this.freelancerService.getFreelancerAccount(req.user as User)
    };

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

    @Post('add-certificate')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles("freelancer")
    async addCertificate(
        @Req() req: MulterRequest
    ) {
        return this.freelancerService.addCertificates(req)
    }

    @Get('get-certificates')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles("freelancer")
    async getCertificates(
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Req() req: Request
    ) {
        return this.freelancerService.getCertificates({ page, limit }, req.user as User);
    };

    @Get('get-certificate')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles("freelancer")
    async getCertificate(
        @Query("certificateId") certificateId: string
    ) {
        return this.freelancerService.getCertificate(certificateId);
    };

    @Put('update-certificate')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles("freelancer")
    async updateCertificate(
        @Query("certificateId") certificateId: string,
        @Req() req: MulterRequest
    ) {
        return this.freelancerService.updateCertificate(certificateId, req);
    };

    @Delete('delete-certificate')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles("freelancer")
    async deleteCertificate(
        @Query("certificateId") certificateId: string
    ) {
        return this.freelancerService.deleteCertificate(certificateId);
    };

    @Post("add-language")
    @UseGuards(AuthGuard, RolesGuard)
    @Roles("freelancer")
    async addLanguage(
        @Body() languageDto: LanguageDto,
        @Req() req: Request
    ) {
        return this.freelancerService.addLanguage(languageDto, req.user as User);
    };

    @Get("get-all-language")
    @UseGuards(AuthGuard, RolesGuard)
    @Roles("freelancer")
    async getAllLanguages(
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Req() req: Request
    ) {
        return this.freelancerService.getLanugages({ page, limit }, req.user as User);
    };

    @Get("get-language")
    @UseGuards(AuthGuard, RolesGuard)
    @Roles("freelancer")
    async getLanguage(
        @Query("langId") langId: string
    ) {
        return this.freelancerService.getLanguage(langId);
    };

    @Put("update-language")
    @UseGuards(AuthGuard, RolesGuard)
    @Roles("freelancer")
    async updateLanguage(
        @Body() languageDto: LanguageDto,
        @Query("langId") langId: string
    ) {
        return this.freelancerService.updateLanguage(langId, languageDto);
    };

    @Delete("delete-language")
    @UseGuards(AuthGuard, RolesGuard)
    @Roles("freelancer")
    async deleteLanguage(
        @Query("langId") langId: string
    ) {
        return this.freelancerService.deleteLanguage(langId);
    }

    @Post("add-work-history")
    @UseGuards(AuthGuard, RolesGuard)
    @Roles("freelancer")
    async addWorkHistory(
        @Body() workHistoryDto: WorkHistoryDto,
        @Req() req: Request
    ) {
        return this.freelancerService.addWorkHistory(workHistoryDto, req.user as User);
    };

    @Get("get-work-histories")
    @UseGuards(AuthGuard, RolesGuard)
    @Roles("freelancer")
    async getWorkHistories(
        @Query('limit') limit: number,
        @Query("page") page: number,
        @Req() req: Request
    ) {
        return this.freelancerService.getWorkHistories({ page, limit }, req.user as User);
    };

    @Get('get-work-history')
    @UseGuards(AuthGuard, RolesGuard)
    @Roles("freelancer")
    async getWorkHistory(
        @Query("workHistoryId") workHistoryId: string
    ) {
        return this.freelancerService.getWorkHistory(workHistoryId);
    };

    @Put("update-work-history")
    @UseGuards(AuthGuard, RolesGuard)
    @Roles("freelancer")
    async updateWorkHistory(
        @Body() workHistoryDto: WorkHistoryDto,
        @Query("workHistoryId") workHistoryId: string
    ) {
        return this.freelancerService.updateWorkHistory(workHistoryId, workHistoryDto);
    };

    @Delete("delete-work-history")
    @UseGuards(AuthGuard, RolesGuard)
    @Roles("freelancer")
    async deleteWorkHistory(
        @Query("workHistoryId") workHistoryId: string
    ) {
        return this.freelancerService.deleteWorkHistory(workHistoryId);
    };

    @Post("add-skill")
    @UseGuards(AuthGuard, RolesGuard)
    @Roles("freelancer")
    async addSkill(
        @Body() skillDto: SkillDto,
        @Req() req: Request
    ) {
        return this.freelancerService.addSkill(skillDto, req.user as User);
    };

    @Get("get-skills")
    @UseGuards(AuthGuard, RolesGuard)
    @Roles("freelancer")
    async getSkills(
        @Query("page") page: number,
        @Query("limit") limit: string,
        @Req() req: Request
    ) {
        return this.freelancerService.getSkills({ page, limit }, req.user as User);
    };

    @Get("get-skill")
    @UseGuards(AuthGuard, RolesGuard)
    @Roles("freelancer")
    async getSkill(
        @Query("skillId") skillId: string
    ) {
        return this.freelancerService.getSkill(skillId);
    };

    @Put("update-skill")
    @UseGuards(AuthGuard, RolesGuard)
    @Roles("freelancer")
    async updateSkill(
        @Body() skillDto: SkillDto,
        @Query("skillId") skillId: string
    ) {
        return this.freelancerService.updateSkill(skillDto, skillId);
    };

    @Delete("delete-skill")
    @UseGuards(AuthGuard, RolesGuard)
    @Roles("freelancer")
    async deleteSkill(
        @Query("skillId") skillId: string
    ) {
        return this.freelancerService.deleteSkill(skillId);
    };
};