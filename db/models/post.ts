import { Model } from 'sequelize'

class Post extends Model {
  public id!: number
  public title!: string
  public body!: string
}

export default Post
