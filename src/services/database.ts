import { DataTypes, Sequelize } from 'sequelize'

// INSERT INTO urls(id, original_id, is_custom) VALUES...
// TODO: Move this to models/Urls
export interface CreateShortUrlData {
  id: string
  originalUrl: string
  isCustom: boolean
}

export default class DatabaseService {
  private connection!: Sequelize;

  public constructor() {
    try {
      this.connection = new Sequelize({
        dialect: 'sqlite',
        storage: './db.sqlite'
      })
      this.connection.authenticate()
      this.initializeModels()

      console.log("DB connection success")
    } catch {
      console.error("DB connection failure")
    }
  }

  private initializeModels() {
    // TODO: Move this to models/Urls
    this.connection.define('urls', {
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
    })
  }

  public async insertUrl(data: CreateShortUrlData) {
    return this.connection.models.urls.create(data)
  }

  public async getUrl(id: string) {
    return this.connection.models.urls.findByPk(id)
  }

  public async incrementUrlVisitCount(id: string) {
    return this.connection.models.urls.increment('visitCount', {
      by: 1,
      where: { id }
    })
  }
}
