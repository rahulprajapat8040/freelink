import { BadRequestException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { otpGenerator, responseSender, throwError } from "src/helper/funcation.helper";
import { DeviceInfo, User } from "src/models";
import { LoginDto, SignupDto } from "./auth.dto";
import STRINGCONST from "src/common/stringConst";
import * as bcrypt from 'bcryptjs'
import { JwtService } from "@nestjs/jwt";
import { MulterRequest } from "src/types/multerRequest";
import { FileService } from "../file/file.service";

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(DeviceInfo) private readonly deviceModel: typeof DeviceInfo,
        @InjectModel(User) private readonly userModel: typeof User,
        private readonly fileService: FileService,
        private jwtService: JwtService
    ) { }

    async signup(signupDto: SignupDto) {
        try {
            const { firstName, lastName, email, otp, deviceId, deviceToken, password, role, isAgree, isSubscribed, countryCode } = signupDto
            const existUser = await this.userModel.findOne({ where: { email: email } })
            if (existUser) {
                throw new BadRequestException(STRINGCONST.EMAIL_FOUND)
            }
            const existingDevice = await this.deviceModel.findOne({ where: { deviceId } });
            if (!otp) {
                const generatedOtp = otpGenerator()
                if (existingDevice) {
                    await existingDevice.update({ otp: String(generatedOtp), otpStatus: false, deviceToken });
                } else {
                    await this.deviceModel.create({ deviceId, deviceToken, otp: String(generatedOtp), otpStatus: false });
                }
                return responseSender(STRINGCONST.OTP_SENT, HttpStatus.OK, true, generatedOtp);
            }
            if (!existingDevice) {
                throwError("Device not found");
            }
            if (existingDevice?.otp !== otp) {
                throwError(STRINGCONST.INVALID_OTP);
            }
            const hashPassword = await bcrypt.hash(password, 15)
            const newUser = await this.userModel.create({ firstName, lastName, email, password: hashPassword, role, isAgree, isSubscribed, countryCode, });
            const payload = { userId: newUser.id }
            const accessToken = await this.jwtService.signAsync(payload)
            await existingDevice?.update({ otpStatus: true, accessToken: accessToken });
            (newUser as any).dataValues.accessToken = accessToken;
            return responseSender(STRINGCONST.SIGNUP_SUCCESS, HttpStatus.CREATED, true, newUser);
        } catch (error) {
            throwError(error.message)
        }
    };

    async login(loginDto: LoginDto) {
        try {
            const { email, password, deviceId, deviceToken } = loginDto;
            const user = await this.userModel.findOne({ where: { email: email } })
            if (!user) {
                throw new BadRequestException(STRINGCONST.USER_NOT_FOUND)
            }
            await this.deviceModel.create({ deviceId, deviceToken, userId: user.id })
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throwError(STRINGCONST.USER_NOT_FOUND)
            }
            const payload = { userId: user.id }
            const accessToken = await this.jwtService.signAsync(payload);
            (user as any).dataValues.accessToken = accessToken;
            return responseSender(STRINGCONST.USER_LOGGEDIN, HttpStatus.OK, true, user)
        } catch (error) {
            throwError(error.message)
        }
    }

    async logout(deviceId: string) {
        try {
            await this.deviceModel.destroy({ where: { deviceId }, force: true })
            return responseSender(STRINGCONST.LOGGED_OUT, HttpStatus.OK, true, null)
        } catch (error) {
            throwError(error.message)
        }
    }

    async getUser(user: User) {
        try {
            const result = await this.userModel.findByPk(user.id)
            if (!result) {
                throw new NotFoundException(STRINGCONST.USER_NOT_FOUND)
            }
            return responseSender(STRINGCONST.USER_FOUND, HttpStatus.OK, true, result)
        } catch (error) {
            throwError(error.message)
        }
    }

    async updateUserDetail(req: MulterRequest, user: User) {
        const { file, body } = await this.fileService.uploadFile(req, 'profile');
        try {
            const res = await this.userModel.findByPk(user.id);
            if (!res) {
                throw new NotFoundException(STRINGCONST.USER_NOT_FOUND);
            };
            const hashPassword = body.password && await bcrypt.hash(body.password, 15)
            await res.update({
                ...body,
                profilePhoto: file[0] ? file[0].path : body.profilePhoto,
                password: body.password && hashPassword
            });
            return responseSender(STRINGCONST.USER_UPDATED, HttpStatus.OK, true, res)
        } catch (error) {
            throwError(error.message);
        };
    };
};