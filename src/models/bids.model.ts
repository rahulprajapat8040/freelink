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
import { JobsPosted } from './jobsPosted';
import { User } from './user.model';
import { Reviews } from './reviews.model';

@Table({ tableName: ModelName.bids, paranoid: true })
export class Bids extends Model<Bids, Partial<Bids>> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;
  @Column({
    type: DataType.STRING(1000),
  })
  declare whyYou: string;
  @Column({
    type: DataType.ENUM('pending', 'accpected', 'rejected', 'missed'),
    defaultValue: 'pending',
  })
  declare status: 'pending' | 'accpected' | 'rejected' | 'missed';
  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  declare bidAmount: number;
  @ForeignKey(() => JobsPosted)
  @Column({
    type: DataType.UUID,
  })
  declare jobId: string;
  @BelongsTo(() => JobsPosted)
  declare job: JobsPosted;
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
  })
  declare userId: string;
  @BelongsTo(() => User)
  declare user: User;
  @HasMany(() => Reviews)
  declare review: Reviews[]
}
