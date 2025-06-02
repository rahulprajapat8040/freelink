import { ForbiddenException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { responseSender, throwError } from 'src/helper/funcation.helper';
import { Bids, JobsPosted, User } from 'src/models';
import { BidDto } from './dto';
import STRINGCONST from 'src/common/stringConst';

@Injectable()
export class FreelancerService {
    constructor(
        @InjectModel(User) private readonly userModel: typeof User,
        @InjectModel(JobsPosted) private readonly jobModel: typeof JobsPosted,
        @InjectModel(Bids) private readonly bidModel: typeof Bids,
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
                throw new NotFoundException(STRINGCONST.BID_NOT_FOUND)
            } else if (bid.userId !== user.id) {
                throw new ForbiddenException(STRINGCONST.UNAUTH_USER)
            };
            return responseSender(STRINGCONST.DATA_FOUND, HttpStatus.OK, true, bid);
        } catch (error) {
            throwError(error.message);
        }
    };

    
}
