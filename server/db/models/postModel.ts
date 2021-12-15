import { Model } from 'sequelize'

class PostModel extends Model {
  public id!: Post['id']
  public title!: Post['title']
  public body!: Post['body']
  public createAt!: Post['createdAt']
  public updateAt!: Post['updatedAt']
}

export default PostModel
