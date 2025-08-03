import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  AllowNull,
  Unique,
  Default,
  HasOne,
  HasMany,
} from 'sequelize-typescript'
import { CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from 'sequelize'

import { RecruiterProfile, JobApplication } from '../models/index'

@Table({
  tableName: 'job_board_users',
  timestamps: true,
  defaultScope: {
    attributes: { exclude: ['password'] },
  },
  scopes: {
    withPassword: {
      attributes: { include: ['password'] },
    },
  },
})
export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: CreationOptional<number>

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  username!: string

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  email!: string

  @AllowNull(false)
  @Column(DataType.STRING)
  password!: string

  @Default('user')
  @Column(DataType.ENUM('user', 'recruiter', 'admin'))
  role!: CreationOptional<'user' | 'recruiter' | 'admin'>

  @AllowNull
  @Column(DataType.STRING(128))
  bio?: string

  @AllowNull
  @Column(DataType.STRING)
  avatar?: string

  @HasOne(() => RecruiterProfile)
  recruiter!: NonAttribute<RecruiterProfile>

  @HasMany(() => JobApplication)
  jobs!: JobApplication[]
}
