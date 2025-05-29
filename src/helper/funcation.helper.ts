import { BadRequestException } from "@nestjs/common"

export const throwError = (message: string) => {
    throw new BadRequestException(message)
}

export const responseSender = (message: string, status: number, success = true, data: any) => {
    return { message, data, status, success }
}

export const generatePagination = (
    data: { rows: [], count: number },
    page: number,
    limit: number
) => {
    return {
        data: data.rows,
        pageInfo: {
            total: data.count,
            currentPage: page,
            totalPage: Math.ceil(data.count / limit)
        }
    }
}

export const otpGenerator = (size = 6) => {
    const value = Math.pow(10, size - 1)
    return Math.floor(value + (Math.random() * (9 * value)))
}