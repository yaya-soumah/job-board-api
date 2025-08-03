import {
  Table,
  Column,
  BelongsTo,
  Model,
  ForeignKey,
  DataType,
  AllowNull,
  Unique,
  HasOne,
} from 'sequelize-typescript'

import { User, JobPost } from '../models/index'

@Table({ tableName: 'job_board_recruiterProfiles', timestamps: true })
export class RecruiterProfile extends Model {
  @ForeignKey(() => User)
  @AllowNull(false)
  @Unique
  @Column(DataType.INTEGER)
  userId!: number

  @AllowNull
  @Column(DataType.STRING)
  company?: string

  @AllowNull
  @Column(DataType.TEXT)
  bio?: string

  @BelongsTo(() => User)
  user!: User

  @HasOne(() => JobPost)
  jobPost!: JobPost
}
