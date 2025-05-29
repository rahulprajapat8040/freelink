
import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import ModelName from "src/common/modelName";
import { User } from "./user.model";

@Table({ tableName: ModelName.jobsPosted, paranoid: true })
export class JobsPosted extends Model<JobsPosted, Partial<JobsPosted>> {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare projectName: string
    @Column({
        type: DataType.FLOAT,
        allowNull: false
    })
    declare minPrice: number
    @Column({
        type: DataType.FLOAT,
        allowNull: false
    })
    declare maxPrice: number
    @Column({
        type: DataType.STRING(10000),
        allowNull: false
    })
    declare description: string
    @Column({
        type: DataType.STRING
    })
    declare deadlineDays: string
    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID
    })
    declare userId: string
    @BelongsTo(() => User)
    declare user: User
}