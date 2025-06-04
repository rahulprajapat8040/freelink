import {
    Column,
    DataType,
    HasMany,
    Model,
    PrimaryKey,
    Table,
} from 'sequelize-typescript';
import ModelName from 'src/common/modelName';
import { DeviceInfo } from './deviceInfo.model';
import { JobsPosted } from './jobsPosted';
import { Bids } from './bids.model';
import { Portfolio } from './portfolio.model';
import { Reviews } from './reviews.model';

@Table({ tableName: ModelName.user, paranoid: true })
export class User extends Model<User, Partial<User>> {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
    })
    declare id: string;
    @Column({
        type: DataType.STRING,
    })
    declare firstName: string;
    @Column({
        type: DataType.STRING,
    })
    declare lastName: string;
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare email: string;
    @Column({
        type: DataType.ENUM('client', 'freelancer', "admin"),
        defaultValue: 'freelancer',
    })
    declare role: 'client' | 'freelancer' | "admin";
    @Column({
        type: DataType.STRING,
    })
    declare password: string;
    @Column({
        type: DataType.BOOLEAN,
        allowNull: false
    })
    declare isAgree: boolean
    @Column({
        type: DataType.BOOLEAN,
        allowNull: false
    })
    declare isSubscribed: boolean
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare countryCode: string
    @Column({
        type: DataType.ARRAY(DataType.JSON)
    })
    declare languages: object[]
    @Column({
        type: DataType.ARRAY(DataType.JSON)
    })
    declare certifications: object[]
    @Column({
        type: DataType.ARRAY(DataType.JSON)
    })
    declare workHistory: object[]
    @Column({
        type: DataType.FLOAT
    })
    declare hourlyRate: number
    @Column({
        type: DataType.STRING(1000)
    })
    declare aboutUser: string
    @HasMany(() => DeviceInfo)
    declare devices: DeviceInfo[];
    @HasMany(() => JobsPosted)
    declare jobsPosted: JobsPosted[];
    @HasMany(() => Bids)
    bids: Bids[];
    @HasMany(() => Portfolio)
    declare portfoio: Portfolio[]
    @HasMany(() => Reviews, 'userId')
    declare reviewsReceived: Reviews[];

    @HasMany(() => Reviews, 'reviewBy')
    declare reviewsGiven: Reviews[];
}
