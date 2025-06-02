import { Column, DataType, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import ModelName from "src/common/modelName";
import { JobsPosted } from "./jobsPosted";


@Table({ tableName: ModelName.category, paranoid: true })
export class Category extends Model<Category, Partial<Category>> {
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
    declare categoryName: string
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare categoryImage: string
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare description: string

    @HasMany(() => JobsPosted)
    declare jobsPosted: JobsPosted[]
}