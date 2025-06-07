import { ForbiddenException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { generatePagination, responseSender, throwError } from 'src/helper/funcation.helper';
import { Bids, Certifications, JobsPosted, Portfolio, Skills, User, UserLanguages, WorkHistory } from 'src/models';
import { BidDto, LanguageDto, SkillDto, WorkHistoryDto } from './dto';
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
        @InjectModel(Certifications) private readonly certificateModel: typeof Certifications,
        @InjectModel(UserLanguages) private readonly langModel: typeof UserLanguages,
        @InjectModel(WorkHistory) private readonly workHistoryModel: typeof WorkHistory,
        @InjectModel(Skills) private readonly skillModel: typeof Skills,
        private readonly fileService: FileService,
    ) { }

    async getFreelancerAccount(user: User) {
        try {
            const result = await this.userModel.findByPk(user.id, {
                include: [
                    { model: this.certificateModel },
                    { model: this.workHistoryModel },
                    { model: this.langModel },
                    { model: this.skillModel }
                ]
            })
            if (!result) {
                throw new NotFoundException(STRINGCONST.USER_NOT_FOUND)
            }
            return responseSender(STRINGCONST.USER_FOUND, HttpStatus.OK, true, result)
        } catch (error) {
            throwError(error.message)
        }
    }

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

    async addCertificates(req: MulterRequest) {
        const { file, body } = await this.fileService.uploadFile(req, 'certificates')
        try {
            const user = req.user as User
            const certificate = await this.certificateModel.create({
                ...body,
                certificateImage: file[0] ? file[0].path : body.certificateImage,
                userId: user.id
            })
            return responseSender(STRINGCONST.CERTIFICATE_ADDED, HttpStatus.CREATED, true, certificate)
        } catch (error) {
            throwError(error.message)
        }
    }

    async getCertificates(queryParams, user: User) {
        try {
            let { page, limit } = queryParams;
            page = Number(page) || 1;
            limit = Number(limit) || 10;
            const offset = Number((page - 1) * limit);
            const certificates = await this.certificateModel.findAndCountAll({
                limit, offset,
                where: {
                    userId: user.id
                }
            });
            const response = generatePagination(certificates, page, limit);
            return responseSender(STRINGCONST.DATA_FOUND, HttpStatus.OK, true, response)
        } catch (error) {
            throwError(error.message);
        };
    };

    async getCertificate(certificateId: string) {
        try {
            const certificate = await this.certificateModel.findByPk(certificateId);
            if (!certificate) {
                throw new NotFoundException(STRINGCONST.CERTIFICATE_NOT_FOUND);
            };
            return responseSender(STRINGCONST.DATA_FOUND, HttpStatus.OK, true, certificate);
        } catch (error) {
            throwError(error.message);
        };
    };

    async updateCertificate(certificateId: string, req: MulterRequest) {
        const { file, body } = await this.fileService.uploadFile(req, 'certificates')
        try {
            const certificate = await this.certificateModel.findByPk(certificateId);
            if (!certificate) {
                throw new NotFoundException(STRINGCONST.CERTIFICATE_NOT_FOUND);
            };
            if (file) {
                this.fileService.removeFile(certificate.certificateImage);
            };
            await certificate.update({
                ...body,
                certificateImage: file[0] ? file[0].path : body.certificateImage
            });
            return responseSender(STRINGCONST.CERTIFICATE_UPDATE, HttpStatus.OK, true, certificate)
        } catch (error) {
            throwError(error.message);
        };
    };

    async deleteCertificate(certificateId: string) {
        try {
            const certificate = await this.certificateModel.findByPk(certificateId);
            if (!certificate) {
                throw new NotFoundException(STRINGCONST.CERTIFICATE_NOT_FOUND);
            }
            this.fileService.removeFile(certificate.certificateImage);
            await certificate.destroy();
            return responseSender(STRINGCONST.CERTIFICATE_DELETE, HttpStatus.OK, true, null);
        } catch (error) {
            throwError(error.message);
        };
    };

    async addLanguage(languageDto: LanguageDto, user: User) {
        try {
            const res = await this.langModel.create({
                ...languageDto,
                userId: user.id
            });
            return responseSender(STRINGCONST.LANGUAGE_ADDED, HttpStatus.CREATED, true, res);
        } catch (error) {
            throwError(error.message);
        };
    };

    async getLanugages(queryParams, user: User) {
        try {
            let { page, limit } = queryParams;
            page = Number(page) || 1;
            limit = Number(limit) || 10;
            const offset = Number((page - 1) * limit);
            const res = await this.langModel.findAndCountAll({
                limit, offset,
                where: {
                    userId: user.id
                }
            });
            const response = generatePagination(res, page, limit);
            return responseSender(STRINGCONST.DATA_FOUND, HttpStatus.OK, true, response);
        } catch (error) {
            throwError(error.message);
        };
    };

    async getLanguage(langId: string) {
        try {
            const res = await this.langModel.findByPk(langId);
            if (!res) {
                throw new NotFoundException(STRINGCONST.LANGUAGE_NOT_FOUND);
            };
            return responseSender(STRINGCONST.DATA_FOUND, HttpStatus.OK, true, res)
        } catch (error) {
            throwError(error.message);
        };
    };

    async updateLanguage(langId: string, languageDto: LanguageDto) {
        try {
            const res = await this.langModel.findByPk(langId);
            if (!res) {
                throw new NotFoundException(STRINGCONST.LANGUAGE_NOT_FOUND);
            };
            await res.update(languageDto);
            return responseSender(STRINGCONST.LANGUAGE_UPDATED, HttpStatus.OK, true, res)
        } catch (error) {
            throwError(error.message)
        };
    };

    async deleteLanguage(langId: string) {
        try {
            await this.langModel.destroy({
                where: { id: langId }
            });
            return responseSender(STRINGCONST.LANGUAGE_DELETED, HttpStatus.OK, true, null);
        } catch (error) {
            throwError(error.message);
        };
    }

    async addWorkHistory(workHistoryDto: WorkHistoryDto, user: User) {
        try {
            const workHistory = await this.workHistoryModel.create({
                ...workHistoryDto,
                userId: user.id
            });
            return responseSender(STRINGCONST.WORK_HISTORY_ADDED, HttpStatus.CREATED, true, workHistory);
        } catch (error) {
            throwError(error.message);
        };
    };

    async getWorkHistories(queryParams, user: User) {
        try {
            let { page, limit } = queryParams;
            page = Number(page) || 1;
            limit = Number(limit) || 10;
            const offset = Number((page - 1) * limit);
            const workHistory = await this.workHistoryModel.findAndCountAll({
                limit, offset,
                where: { userId: user.id }
            });
            const response = generatePagination(workHistory, page, limit);
            return responseSender(STRINGCONST.DATA_FOUND, HttpStatus.OK, true, response);
        } catch (error) {
            throwError(error.message);
        };
    };

    async getWorkHistory(workHistoryId: string) {
        try {
            const workHistory = await this.workHistoryModel.findByPk(workHistoryId);
            if (!workHistory) {
                throw new NotFoundException(STRINGCONST.WORK_HISTORY_NOT_FOUND);
            };
            return responseSender(STRINGCONST.DATA_FOUND, HttpStatus.OK, true, workHistory);
        } catch (error) {
            throwError(error.message);
        };
    };

    async updateWorkHistory(workHistoryId: string, workHistoryDto: WorkHistoryDto) {
        try {
            const workHistory = await this.workHistoryModel.findByPk(workHistoryId);
            if (!workHistory) {
                throw new NotFoundException(STRINGCONST.WORK_HISTORY_NOT_FOUND);
            };
            await workHistory.update(workHistoryDto);
            return responseSender(STRINGCONST.WORK_HISTORY_UPDATED, HttpStatus.OK, true, workHistory);
        } catch (error) {
            throwError(error.message);
        };
    };

    async deleteWorkHistory(workHistoryId: string) {
        try {
            await this.workHistoryModel.destroy({ where: { id: workHistoryId } });
            return responseSender(STRINGCONST.WORK_HISTORY_DEELTED, HttpStatus.OK, true, null);
        } catch (error) {
            throwError(error.message);
        }
    };

    async addSkill(skillDto: SkillDto, user: User) {
        try {
            const skill = await this.skillModel.create({
                ...skillDto,
                userId: user.id
            });
            return responseSender(STRINGCONST.SKILL_ADDED, HttpStatus.CREATED, true, skill);
        } catch (error) {
            throwError(error.messaeg);
        };
    };

    async getSkills(queryParams, user: User) {
        try {
            let { page, limit } = queryParams;
            page = Number(page) || 1;
            limit = Number(limit) || 10;
            const offset = Number((page - 1) * limit);
            const skill = await this.skillModel.findAndCountAll({
                limit, offset,
                where: { userId: user.id }
            });
            const response = generatePagination(skill, page, limit);
            return responseSender(STRINGCONST.DATA_FOUND, HttpStatus.OK, true, response)
        } catch (error) {
            throwError(error.messaeg);
        };
    };

    async getSkill(skillId: string) {
        try {
            const skill = await this.skillModel.findByPk(skillId);
            if (!skill) {
                throw new NotFoundException(STRINGCONST.SKILL_NOT_FOUND);
            };
            return responseSender(STRINGCONST.DATA_FOUND, HttpStatus.OK, true, skill);
        } catch (error) {
            throwError(error.messaeg);
        };
    };

    async updateSkill(skillDto: SkillDto, skillId: string) {
        try {
            const skill = await this.skillModel.findByPk(skillId);
            if (!skill) {
                throw new NotFoundException(STRINGCONST.SKILL_NOT_FOUND);
            };
            await skill.update(skillDto);
            return responseSender(STRINGCONST.SKILL_UPDATED, HttpStatus.OK, true, skill)
        } catch (error) {
            throwError(error.messaeg);
        };
    };

    async deleteSkill(skillId: string) {
        try {
            await this.skillModel.destroy({ where: { id: skillId } });
            return responseSender(STRINGCONST.SKILL_DELETED, HttpStatus.OK, true, null);
        } catch (error) {
            throwError(error.messaeg);
        };
    };
};
