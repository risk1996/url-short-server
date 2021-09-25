import { Sequelize } from 'sequelize'
import Urls, { CreateUrlsModelAttributes } from '../models/Urls'

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

  private initializeModels(): void {
    Urls.init(Urls.getAttributes(), { sequelize: this.connection })
  }

  public async insertUrl(data: CreateUrlsModelAttributes): Promise<Urls> {
    return Urls.create(data)
  }

  public async getUrl(id: string): Promise<Urls | null> {
    return Urls.findByPk(id)
  }

  public async incrementUrlVisitCount(id: string): Promise<Urls> {
    return Urls.increment('visitCount', {
      by: 1,
      where: { id }
    })
  }
}
