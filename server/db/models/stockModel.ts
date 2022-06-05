import { Model } from 'sequelize'

class StockModel extends Model {
  public id!: Stock['id']
  public pageTitle!: Stock['pageTitle']
  public url!: Stock['url']
  public createAt!: Stock['createdAt']
  public updateAt!: Stock['updatedAt']
}

export default StockModel
