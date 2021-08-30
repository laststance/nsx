import { Model } from 'sequelize'

class Author extends Model {
  public id!: number
  public name!: string
  public password!: string
}

export default Author
