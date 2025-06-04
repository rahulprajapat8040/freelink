import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import ModelName from 'src/common/modelName';
import { User } from './user.model';
import { Bids } from './bids.model';
import { Category } from './category.model';

@Table({ tableName: ModelName.jobsPosted, paranoid: true })
export class JobsPosted extends Model<JobsPosted, Partial<JobsPosted>> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare projectName: string;
  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  declare minPrice: number;
  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  declare maxPrice: number;
  @Column({
    type: DataType.STRING(10000),
    allowNull: false,
  })
  declare description: string;
  @Column({
    type: DataType.ARRAY(DataType.STRING)
  })
  declare tags: string[]
  @Column({
    type: DataType.ARRAY(DataType.STRING)
  })
  declare skillsRequired: string[]
  @ForeignKey(() => Category)
  @Column({
    type: DataType.UUID
  })
  declare categoryId: string
  @BelongsTo(() => Category)
  declare category: Category

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
  })
  declare userId: string;
  @BelongsTo(() => User)
  declare user: User;
  @HasMany(() => Bids)
  declare bids: Bids[];
}
