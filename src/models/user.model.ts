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
import { Certifications } from './certifications.model';
import { UserLanguages } from './userLang.model';
import { WorkHistory } from './workHistory.model';
import { Skills } from './skills.model';

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
        type: DataType.STRING
    })
    declare profilePhoto: string
    @Column({
        type: DataType.STRING
    })
    declare title: string
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
        type: DataType.FLOAT
    })
    declare hourlyRate: number
    @Column({
        type: DataType.STRING(1000)
    })
    declare aboutUser: string
    @Column({
        type: DataType.STRING
    })
    declare responseTime: string

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
    @HasMany(() => Certifications)
    declare certifications: Certifications[]
    @HasMany(() => UserLanguages)
    declare languages: UserLanguages[]
    @HasMany(() => WorkHistory)
    declare workHistory: WorkHistory
    @HasMany(() => Skills)
    declare skills: Skills[]
}
