import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import ModelName from "src/common/modelName";
import { User } from "./user.model";

@Table({ tableName: ModelName.workHistory, paranoid: true })
export class WorkHistory extends Model<WorkHistory, Partial<WorkHistory>> {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string
    @Column({
        type: DataType.STRING
    })
    declare companyName: string
    @Column({
        type: DataType.DATEONLY
    })
    declare startDate: string
    @Column({
        type: DataType.DATEONLY
    })
    declare endDate: string
    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    declare isPresent: boolean
    @Column({
        type: DataType.STRING
    })
    declare role: string
    @Column({
        type: DataType.STRING(1000)
    })
    declare description: string

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID
    })
    declare userId: string
    @BelongsTo(() => User)
    declare user: User
}