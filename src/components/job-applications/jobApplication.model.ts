import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  AllowNull,
  Default,
} from 'sequelize-typescript'
import { DataTypes } from 'sequelize'

import { User, JobPost } from '../models/index'

export enum ApplicationStatus {
  PENDING = 'pending',
  SHORTLISTED = 'shortlisted',
  REJECTED = 'rejected',
}

@Table({ tableName: 'job_board_job_applications', timestamps: true })
export class JobApplication extends Model {
  @ForeignKey(() => User)
  @Column(DataTypes.INTEGER)
  userId!: number

  @ForeignKey(() => JobPost)
  @Column(DataTypes.INTEGER)
  jobId!: number

  @AllowNull
  @Column(DataTypes.TEXT)
  coverLetter?: string

  @Default('pending')
  @Column(DataTypes.ENUM('pending', 'shortlisted', 'rejected'))
  status!: ApplicationStatus

  @BelongsTo(() => User)
  user!: User

  @BelongsTo(() => JobPost)
  job!: JobPost
}
