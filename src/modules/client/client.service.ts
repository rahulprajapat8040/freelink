import { HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { generatePagination, responseSender, throwError } from "src/helper/funcation.helper";
import { JobsPosted, User } from "src/models";
import { addNewJob } from "./dto/client.dto";
import STRINGCONST from "src/common/stringConst";

@Injectable()
export class ClientService {
    constructor(
        @InjectModel(JobsPosted) private readonly jobsModel: typeof JobsPosted,
        @InjectModel(User) private readonly userModel: typeof User,
    ) { }

    async addNewJob(jobDto: addNewJob, user: User) {
        try {
            const newJob = await this.jobsModel.create({ ...jobDto, userId: user.id })
            return responseSender(STRINGCONST.JOB_ADDED, HttpStatus.CREATED, true, newJob)
        } catch (error) {
            throwError(error.message)
        }
    }

    async updateJob(jobDto: addNewJob, jobId: string) {
        try {
            const job = await this.jobsModel.findByPk(jobId)
            if (!job) {
                throw new NotFoundException(STRINGCONST.DATA_NOT_FOUND)
            }
            await job.update({ ...jobDto })
            return responseSender(STRINGCONST.JOB_UPDATED, HttpStatus.OK, true, job)
        } catch (error) {
            throwError(error.message)
        }
    }

    async getJobDetail(jobId: string) {
        try {
            const job = await this.jobsModel.findByPk(jobId)
            if (!job) {
                throw new NotFoundException(STRINGCONST.DATA_NOT_FOUND)
            }
            return responseSender(STRINGCONST.DATA_FOUND, HttpStatus.OK, true, job)
        } catch (error) {
            throwError(error.message)
        }
    }

    async getAllJobs(queryParams, user: User) {
        try {
            let { page, limit, filters } = queryParams;
            page = Number(page) || 1
            limit = Number(limit) || 10
            const offset = Number((page - 1) * limit)
            const jobs = await this.jobsModel.findAndCountAll({
                where: { userId: user.id },
                limit, offset
            })
            const response = generatePagination(jobs, page, limit)
            return responseSender(STRINGCONST.DATA_FOUND, HttpStatus.OK, true, response)
        } catch (error) {
            throwError(error.message)
        }
    }

    async deleteJob(jobId: string) {
        try {
            await this.jobsModel.destroy({ where: { id: jobId } })
            return responseSender(STRINGCONST.JOB_DELETED, HttpStatus.OK, true, null)
        } catch (error) {
            throwError(error.message)
        }
    }
}