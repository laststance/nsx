import { Model } from 'sequelize'

class Post extends Model {
  public id!: number
  public title!: string
  public body!: string
}

export type PostModel = Post

export default Post
