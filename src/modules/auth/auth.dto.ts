import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignupDto {
    @IsNotEmpty({ message: "name is required" })
    @IsString()
    firstName: string
    @IsNotEmpty({ message: "name is required" })
    @IsString()
    lastName: string
    @IsNotEmpty({ message: "password is required" })
    @IsString()
    password: string
    @IsNotEmpty({ message: 'device_id can not be empty' })
    @IsString()
    deviceId: string
    @IsNotEmpty({ message: 'device_token is required' })
    @IsString()
    deviceToken: string
    @IsNotEmpty({ message: "email is required" })
    @IsString()
    email: string
    @IsNotEmpty({ message: "select a role" })
    role: 'client' | 'freelancer'
    otp: string
}

export class LoginDto {
    @IsNotEmpty({ message: "email is required" })
    @IsString()
    email: string
    @IsNotEmpty({ message: 'password can not be empty' })
    @IsString()
    password: string
    @IsNotEmpty({ message: 'device_id is required' })
    @IsString()
    deviceId: string
    @IsNotEmpty({ message: "device_token is required" })
    deviceToken: string
}