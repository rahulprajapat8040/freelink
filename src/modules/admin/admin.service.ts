import { InjectModel } from "@nestjs/sequelize";
import { Category } from "src/models";
import { FileService } from "../file/file.service";
import { generatePagination, responseSender, throwError } from "src/helper/funcation.helper";
import STRINGCONST from "src/common/stringConst";
import { HttpStatus } from "@nestjs/common";

export class AdminService {
    constructor(
        @InjectModel(Category) private readonly categoryModel: typeof Category,
        private readonly fileService: FileService
    ) { }

    async addCategory(req: any) {
        const { file, body } = await this.fileService.uploadFile(req, 'category');
        try {
            const category = await this.categoryModel.create({
                ...body,
                categoryImage: file[0] ? file[0].path : body.categoryImage
            })
            return responseSender(STRINGCONST.DATA_ADDED, HttpStatus.CREATED, true, category)
        } catch (error) {
            throwError(error.message)
        }
    };

    async getCategories(queryParams) {
        try {
            let { page, limit } = queryParams;
            page = Number(page) || 1
            limit = Number(limit) || 10
            const offset = Number((page - 1) * limit);
            const categories = await this.categoryModel.findAndCountAll({
                limit, offset
            })
            const response = generatePagination(categories, page, limit)
            return responseSender(STRINGCONST.DATA_FOUND, HttpStatus.OK, true, response)
        } catch (error) {
            throwError(error.message)
        }
    }
}