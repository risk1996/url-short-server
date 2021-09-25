import { DataTypes, Model, ModelAttributes, Sequelize } from 'sequelize'

export interface UrlsModelAttributes {
  id: string
  originalUrl: string
  isCustom: boolean
  visitCount: number
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

export type CreateUrlsModelAttributes =
  Pick<
    UrlsModelAttributes,
    'id' | 'originalUrl' | 'isCustom'
  >

export default class Urls extends Model<
  UrlsModelAttributes,
  CreateUrlsModelAttributes
> implements UrlsModelAttributes {
  public id!: string
  public originalUrl!: string
  public isCustom!: boolean
  public visitCount!: number
  public createdAt!: Date
  public updatedAt!: Date
  public deletedAt!: Date | null

  public static getAttributes(): ModelAttributes<Urls, UrlsModelAttributes> {
    return {
      id: {
        primaryKey: true,
        type: DataTypes.STRING(128),
      },
      originalUrl: {
        allowNull: false,
        field: 'original_url',
        type: DataTypes.STRING(2_408),
      },
      isCustom: {
        allowNull: false,
        field: 'is_custom',
        type: DataTypes.BOOLEAN,
      },
      visitCount: {
        allowNull: false,
        defaultValue: 0,
        field: 'visit_count',
        type: DataTypes.INTEGER,
        validate: { min: 0 },
      },
      createdAt: {
        allowNull: false,
        defaultValue: Sequelize.fn('DATETIME'),
        field: 'created_at',
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        defaultValue: Sequelize.fn('DATETIME'),
        field: 'updated_at',
        type: DataTypes.DATE,
      },
      deletedAt: {
        allowNull: true,
        field: 'deleted_at',
        type: DataTypes.DATE,
      },
    }
  }
}
