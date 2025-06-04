import { BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import ModelName from "src/common/modelName";
import { User } from "./user.model";
import { Bids } from "./bids.model";

@Table({ tableName: ModelName.review, paranoid: true })
export class Reviews extends Model<Reviews, Partial<Reviews>> {
    @PrimaryKey
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string
    @Column({
        type: DataType.FLOAT
    })
    declare ratting: number
    @Column({
        type: DataType.STRING
    })
    declare review: string

    @ForeignKey(() => Bids)
    @Column({
        type: DataType.UUID
    })
    declare onBid: string
    @BelongsTo(() => Bids)
    declare bid: Bids

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID
    })
    declare userId: string
    @BelongsTo(() => User)
    declare user: User

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID
    })
    declare reviewBy: string;

    @BelongsTo(() => User)
    declare reviewedUser: User;  // Fixed 
}