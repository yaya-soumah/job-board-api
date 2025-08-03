import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  DataType,
  AllowNull,
  HasMany,
} from 'sequelize-typescript'

import { RecruiterProfile, JobApplication } from '../models/index'

@Table({
  tableName: 'job_board_job_posts',
  timestamps: true,
})
export class JobPost extends Model {
  @AllowNull(false)
  @Column(DataType.STRING)
  title!: string

  @AllowNull(false)
  @Column(DataType.TEXT)
  description!: string

  @AllowNull(false)
  @Column(DataType.STRING)
  location!: string

  @AllowNull(false)
  @Column(DataType.STRING)
  type!: string // e.g., full-time, part-time, contract

  @ForeignKey(() => RecruiterProfile)
  @Column(DataType.INTEGER)
  recruiterId!: number

  @AllowNull
  @Column(DataType.INTEGER)
  salary!: number

  @BelongsTo(() => RecruiterProfile)
  recruiter!: RecruiterProfile

  @HasMany(() => JobApplication)
  jobs!: JobApplication[]
}
