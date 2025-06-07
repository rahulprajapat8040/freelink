import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import ModelName from "src/common/modelName";
import { User } from "./user.model";

@Table({ tableName: ModelName.skills, paranoid: true })
export class Skills extends Model<Skills, Partial<Skills>> {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string
    @Column({
        type: DataType.STRING
    })
    declare skillName: string
    @Column({
        type: DataType.ENUM("beginner", "intermediate", "expert")
    })
    declare level: string

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID
    })
    declare userId: string
    @BelongsTo(() => User)
    declare user: User
};