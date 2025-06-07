import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import ModelName from "src/common/modelName";
import { User } from "./user.model";

@Table({ tableName: ModelName.certifications, paranoid: true })
export class Certifications extends Model<Certifications, Partial<Certifications>> {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string
    @Column({
        type: DataType.STRING
    })
    declare certificateImage: string
    @Column({
        type: DataType.STRING
    })
    declare certificateName: string
    @Column({
        type: DataType.STRING
    })
    declare issuer: string
    @Column({
        type: DataType.STRING
    })
    declare year: string

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID
    })
    declare userId: string
    @BelongsTo(() => User)
    declare user: User
}