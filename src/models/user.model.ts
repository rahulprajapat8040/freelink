import { Column, DataType, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import ModelName from "src/common/modelName";
import { DeviceInfo } from "./deviceInfo.model";
import { JobsPosted } from "./jobsPosted";
@Table({ tableName: ModelName.user, paranoid: true })
export class User extends Model<User, Partial<User>> {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string
    @Column({
        type: DataType.STRING,
    })
    declare firstName: string
    @Column({
        type: DataType.STRING,
    })
    declare lastName: string
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare email: string
    @Column({
        type: DataType.ENUM("client", "freelancer"),
        defaultValue: "freelancer"
    })
    declare role: 'client' | 'freelancer'
    @Column({
        type: DataType.STRING
    })
    declare password: string

    @HasMany(() => DeviceInfo)
    declare devices: DeviceInfo[]
    @HasMany(() => JobsPosted)
    declare jobsPosted: JobsPosted[]
}