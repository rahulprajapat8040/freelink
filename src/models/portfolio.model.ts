import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import ModelName from "src/common/modelName";
import { User } from "./user.model";
@Table({ tableName: ModelName.portfolio, paranoid: true })
export class Portfolio extends Model<Portfolio, Partial<Portfolio>> {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string
    @Column({
        type: DataType.STRING
    })
    declare projectName: string
    @Column({
        type: DataType.STRING(1000)
    })
    declare description: string
    @Column({
        type: DataType.STRING
    })
    declare media: string
    @Column({
        type: DataType.ENUM("video", "image")
    })
    declare mediaType: 'video' | 'image'
    @Column({
        type: DataType.STRING
    })
    declare projectLink: string

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID
    })
    declare userId: string
    @BelongsTo(() => User)
    declare user: User
}