import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import ModelName from "src/common/modelName";
import { User } from "./user.model";

@Table({ tableName: ModelName.deviceInfo, paranoid: true })
export class DeviceInfo extends Model<DeviceInfo, Partial<DeviceInfo>> {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string
    @Column({
        type: DataType.STRING
    })
    declare deviceId: string
    @Column({
        type: DataType.STRING
    })
    declare deviceToken: string
    @Column({
        type: DataType.STRING
    })
    declare accessToken: string
    @Column({
        type: DataType.STRING
    })
    declare refreshToken: string
    @Column({
        type: DataType.STRING
    })
    declare otp: string
    @Column({
        type: DataType.BOOLEAN,
        defaultValue: true
    })
    declare otpStatus: boolean

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID
    })
    declare userId: string
    @BelongsTo(() => User)
    declare user: User
}