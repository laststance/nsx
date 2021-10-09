import { Model } from 'sequelize'

import type { Post as PostDomainType } from '../../@types/app'

class PostModel extends Model {
  public id!: PostDomainType['id']
  public title!: PostDomainType['title']
  public body!: PostDomainType['body']
  public createAt!: PostDomainType['createdAt']
  public updateAt!: PostDomainType['updatedAt']
}

export default PostModel
