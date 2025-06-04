import { ForbiddenException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { generatePagination, responseSender, throwError } from 'src/helper/funcation.helper';
import { Bids, JobsPosted, Portfolio, User } from 'src/models';
import { BidDto } from './dto';
import STRINGCONST from 'src/common/stringConst';
import { FileService } from '../file/file.service';
import { MulterRequest } from 'src/types/multerRequest';

@Injectable()
export class FreelancerService {
    constructor(
        @InjectModel(User) private readonly userModel: typeof User,
        @InjectModel(JobsPosted) private readonly jobModel: typeof JobsPosted,
        @InjectModel(Bids) private readonly bidModel: typeof Bids,
        @InjectModel(Portfolio) private readonly portfolioModel: typeof Portfolio,
        private readonly fileService: FileService,
    ) { }

    async applyBid(bidDto: BidDto, user: User) {
        try {
            const res = await this.bidModel.create({ ...bidDto, userId: user.id });
            return responseSender(STRINGCONST.BID_APPLIED, HttpStatus.CREATED, true, res);
        } catch (error) {
            throwError(error.message);
        }
    }

    async getBids(queryParams, user: User) {
        try {
            let { page, limit } = queryParams;
            page = Number(page) || 1
            limit = Number(limit) || 10
            const offset = Number((page - 1) * limit)
            const bids = await this.bidModel.findAndCountAll({
                where: { userId: user.id },
                limit, offset,
            })
            return responseSender(STRINGCONST.DATA_FOUND, HttpStatus.OK, true, bids)
        } catch (error) {
            throwError(error.message)
        }
    }

    async getBid(bidId: string, user: User) {
        try {
            const bid = await this.bidModel.findOne({
                where: { id: bidId, userId: user.id }
            });
            if (!bid) {
                throw new NotFoundException(STRINGCONST.BID_NOT_FOUND);
            } else if (bid.userId !== user.id) {
                throw new ForbiddenException(STRINGCONST.UNAUTH_USER);
            };
            return responseSender(STRINGCONST.DATA_FOUND, HttpStatus.OK, true, bid);
        } catch (error) {
            throwError(error.message);
        }
    };

    async addPortfolioProject(req: MulterRequest, user: User) {
        const { file, body } = await this.fileService.uploadFile(req, 'portfolio');
        try {
            const project = await this.portfolioModel.create({
                ...body,
                userId: user.id,
                media: file[0] ? file[0].path : body.media
            });
            return responseSender(STRINGCONST.PORJECT_ADDED, HttpStatus.CREATED, true, project);
        } catch (error) {
            throwError(error.message);
        }
    }

    async getPortolios(queryParams, user: User) {
        try {
            let { page, limit } = queryParams;
            page = Number(page) || 1;
            limit = Number(limit) || 10;
            const offset = Number((page - 1) * limit);
            const projects = await this.portfolioModel.findAndCountAll({
                limit, offset,
                where: { userId: user.id }
            });
            const response = generatePagination(projects, page, limit);
            return responseSender(STRINGCONST.DATA_FOUND, HttpStatus.OK, true, response);
        } catch (error) {
            throwError(error.message)
        }
    }

    async getPortfolio(projectId: string) {
        try {
            const project = await this.portfolioModel.findByPk(projectId)
            if (!project) {
                throw new NotFoundException(STRINGCONST.PROJECT_NOT_FOUND)
            };
            return responseSender(STRINGCONST.DATA_FOUND, HttpStatus.OK, true, project)
        } catch (error) {
            throwError(error.message)
        }
    }

    async updateProject(req: MulterRequest, projectId: string) {
        const { file, body } = await this.fileService.uploadFile(req, 'portfolio')
        try {
            const project = await this.portfolioModel.findByPk(projectId);
            if (!project) {
                throw new NotFoundException(STRINGCONST.PROJECT_NOT_FOUND);
            };
            if (file) {
                this.fileService.removeFile(project.media)
            }
            await project.update({
                ...body,
                media: file[0] ? file[0].path : body.media
            });
            return responseSender(STRINGCONST.PROJECT_UPDATED, HttpStatus.OK, true, project)
        } catch (error) {
            throwError(error.message)
        }
    }

    async deleteProject(projectId: string) {
        try {
            await this.portfolioModel.destroy({
                where: { id: projectId }
            });
            return responseSender(STRINGCONST.PROJECT_REMOVED, HttpStatus.OK, true, null)
        } catch (error) {
            throwError(error.message);
        };
    };
}
